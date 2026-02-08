import os
import time
import secrets
import json
from queue import Queue
from concurrent.futures import ThreadPoolExecutor

import firebase_admin
from firebase_admin import credentials, tenant_mgt
import requests
from supabase import create_client
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession, Request

# =========================
# LOAD CONFIG FROM JSON
# =========================
CONFIG_FILE = "config.json"

with open(CONFIG_FILE, "r") as f:
    config = json.load(f)

SUPABASE_URL = config["SUPABASE_URL"]
SUPABASE_KEY = config["SUPABASE_KEY"]
PROJECT_ID = config["PROJECT_ID"]
API_KEY = config["API_KEY"]
SERVICE_ACCOUNT_FILE = config["SERVICE_ACCOUNT_FILE"]

EMAILS_PER_BATCH = config.get("EMAILS_PER_BATCH", 1000)
MAX_TENANT_WORKERS = config.get("MAX_TENANT_WORKERS", 5)
OF_ID = config.get("OF_ID", 15)
WANTED_TENANT_COUNT = config.get("WANTED_TENANT_COUNT", 20)

queue = Queue()

# =========================
# FIREBASE + GOOGLE AUTH
# =========================
cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
firebase_admin.initialize_app(cred)

SCOPES = ["https://www.googleapis.com/auth/identitytoolkit"]
sa_creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
authed_session = AuthorizedSession(sa_creds)

# =========================
# SUPABASE
# =========================
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
TENANTS_URL = f"https://identitytoolkit.googleapis.com/v2/projects/{PROJECT_ID}/tenants"

# =========================
# HELPERS
# =========================
def random_alpha(n=7):
    return "".join(secrets.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") for _ in range(n))

def fetch_emails(batch_size):
    try:
        r = supabase.rpc(
            "get_100_emails_and_insert",
            {"p_table": "gmx_tenant_users", "p_offer_id": OF_ID, "p_limit": batch_size}
        ).execute()
        emails = [row["email"] for row in r.data if row.get("email")]
        for email in emails:
            queue.put(email)
        return len(emails)
    except Exception as e:
        print("❌ Supabase error:", e)
        return 0

def send_tenant_password_reset(email, tenant_id):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={API_KEY}"
    payload = {"requestType": "PASSWORD_RESET", "email": email, "tenantId": tenant_id}
    r = requests.post(url, json=payload)
    if r.status_code != 200:
        print(f"❌ Reset failed {email}: {r.text}")

def add_user_and_send_reset(tenant_id, email):
    client = tenant_mgt.auth_for_tenant(tenant_id)
    try:
        client.create_user(
            email=email,
            password=random_alpha(14),
            email_verified=False,
            display_name=f"{random_alpha()} {random_alpha()}"
        )
    except Exception:
        pass
    send_tenant_password_reset(email, tenant_id)

# =========================
# TENANT MANAGEMENT
# =========================
def get_all_tenants():
    tenants, page_token = [], None
    while True:
        url = f"{TENANTS_URL}?pageSize=100"
        if page_token:
            url += f"&pageToken={page_token}"

        r = authed_session.get(url).json()
        tenants.extend(r.get("tenants", []))
        page_token = r.get("nextPageToken")
        if not page_token:
            break
    return tenants

def ensure_tenant_count(wanted_count):
    tenants = get_all_tenants()
    existing_count = len(tenants)

    print(f"🏢 Existing tenants: {existing_count}")
    print(f"🎯 Wanted tenants:   {wanted_count}")

    if existing_count >= wanted_count:
        return tenants

    missing = wanted_count - existing_count
    print(f"➕ Creating {missing} tenants...")

    for i in range(missing):
        display_name = f"auto-tenant-{existing_count + i + 1}"
        payload = {
            "displayName": display_name,
            "emailSignInConfig": {"enabled": True, "passwordRequired": True}
        }
        r = authed_session.post(TENANTS_URL, json=payload)
        if r.status_code not in (200, 201):
            print(f"❌ Failed to create {display_name}: {r.text}")
        else:
            tenant_name = r.json()["name"].split("/")[-1]
            print(f"✅ Created tenant {display_name} ({tenant_name})")

    return get_all_tenants()

# =========================
# UPDATE INHERITANCE TEMPLATE
# =========================
def update_template(credentials_, project_id, tenant_id):
    credentials_.refresh(Request())
    access_token = credentials_.token

    url_ = f'https://identitytoolkit.googleapis.com/v2/projects/{project_id}/tenants/{tenant_id}'
    data_ = {'inheritance': {'emailSendingConfig': True}}
    params = {'updateMask': 'inheritance.emailSendingConfig'}
    headers_ = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}

    response = requests.patch(url_, params=params, json=data_, headers=headers_)

    if response.status_code == 200:
        print(f"✅ Tenant {tenant_id} inheritance updated successfully")
    else:
        print(f"❌ Error updating tenant {tenant_id}: {response.status_code} - {response.text}")

def update_all_tenants_inheritance():
    tenants = get_all_tenants()
    for t in tenants:
        tenant_id = t["name"].split("/")[-1]
        update_template(sa_creds, PROJECT_ID, tenant_id)

# =========================
# CHUNK TENANTS INTO LISTS OF 5
# =========================
def chunk_tenants(tenants, chunk_size=5):
    tenant_ids = [t["name"].split("/")[-1] for t in tenants]
    return [tenant_ids[i:i + chunk_size] for i in range(0, len(tenant_ids), chunk_size)]

# =========================
# WORKER
# =========================
def tenant_worker(tenant):
    tenant_id = tenant["name"].split("/")[-1]
    while True:
        try:
            email = queue.get(timeout=10)
        except:
            time.sleep(2)
            continue

        try:
            add_user_and_send_reset(tenant_id, email)
            print(f"✅ {tenant_id} → processed → {email}")
        except Exception as e:
            print(f"❌ {tenant_id} → {email}: {e}")

        queue.task_done()

# =========================
# MAIN
# =========================
def main():
    # 1️⃣ Ensure tenants exist
    ensure_tenant_count(WANTED_TENANT_COUNT)

    # 2️⃣ Update inheritance for all tenants
    update_all_tenants_inheritance()

    # 3️⃣ Fetch all tenants and split into chunks of 5
    all_tenants = get_all_tenants()
    big_list_of_chunks = chunk_tenants(all_tenants, 5)

    print("✅ All tenants split into chunks of 5:")
    for i, chunk in enumerate(big_list_of_chunks):
        print(f"Index {i}: {chunk}")

    # 4️⃣ Choose which chunk of 5 tenants to use
    chunk_index_to_use = int(input("Enter the index of the 5-tenant chunk to use for sending emails: "))

    if chunk_index_to_use < 0 or chunk_index_to_use >= len(big_list_of_chunks):
        raise ValueError("❌ Invalid chunk index!")

    selected_tenants = big_list_of_chunks[chunk_index_to_use]
    print(f"🎯 Using tenants: {selected_tenants} for sending emails")

    # Convert to tenant dicts for tenant_worker
    tenants_to_use = [{"name": f"projects/{PROJECT_ID}/tenants/{tid}"} for tid in selected_tenants]

    # 5️⃣ Start tenant workers
    with ThreadPoolExecutor(max_workers=len(tenants_to_use)) as executor:
        for tenant in tenants_to_use:
            executor.submit(tenant_worker, tenant)

        round_num = 1
        while True:
            print(f"\n🔥 Batch {round_num}")
            fetched = fetch_emails(EMAILS_PER_BATCH)
            print(f"📨 Emails fetched: {fetched}")
            round_num += 1
            queue.join()


if __name__ == "__main__":
    main()
