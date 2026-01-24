import requests
from selenium.webdriver import ChromeOptions
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import imaplib
import email
from faster_whisper import WhisperModel
from email.header import decode_header
import re
from supabase import create_client, Client
import threading
import secrets
import string

API_TOKEN = "7WzMVY2nbsLMFkzl6ddbO88m6qfyuTnCXS4_stXU"
ZONE_ID = "8b1c58cba0ef71e103f8d15b16e8d66b"
DOMAIN = "meetoffer.online"
DEST_EMAIL = "adamhardison284@gmail.com"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}
BASE_URL = "https://api.cloudflare.com/client/v4"

url_ = "https://jdnmanfimzvbilacjgcj.supabase.co"
key = "sb_secret_eVYWCtpPzmFsbJryaEug0A_EYBBcCII"

supabase: Client = create_client(url_, key)

"""
sudo apt update
sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb -y
sudo apt install -y python3-pip
sudo pip3 install requests supabase selenium undetected_chromedriver faster-whisper
python sprint_host_3.py
"""
options = ChromeOptions()


def get_alias_id_by_email(zone_id, email):
    r = requests.get(
        f"{BASE_URL}/zones/{zone_id}/email/routing/rules",
        headers=HEADERS
    )
    r.raise_for_status()

    rules = r.json()["result"]

    for rule in rules:
        for matcher in rule.get("matchers", []):
            if (
                matcher.get("field") == "to"
                and matcher.get("type") == "literal"
                and matcher.get("value") == email
            ):
                return rule["id"]

    return None
    
def delete_alias(zone_id, rule_id):
    r = requests.delete(
        f"{BASE_URL}/zones/{zone_id}/email/routing/rules/{rule_id}",
        headers=HEADERS
    )
    r.raise_for_status()
    print("Alias deleted")
    
def create_alias(zone_id, alias, destination):
    payload = {
        "name": f"{alias} alias",
        "enabled": True,
        "matchers": [{
            "type": "literal",
            "field": "to",
            "value": f"{alias}@{DOMAIN}"
        }],
        "actions": [{
            "type": "forward",
            "value": [destination]
        }]
    }

    r = requests.post(
        f"{BASE_URL}/zones/{zone_id}/email/routing/rules",
        headers=HEADERS,
        json=payload
    )
    r.raise_for_status()
    print(f"Alias created: {alias}@{DOMAIN}")

def clear_browser_data(driver):
    """Completely clears browser cookies, cache, localStorage, and sessionStorage."""
    try:
        # Clear cookies via Selenium
        driver.delete_all_cookies()

        # Clear localStorage and sessionStorage via JavaScript
        driver.execute_script("window.localStorage.clear();")
        driver.execute_script("window.sessionStorage.clear();")

        # Use Chrome DevTools Protocol (CDP) to clear real browser cache and cookies
        try:
            driver.execute_cdp_cmd('Network.clearBrowserCache', {})
            driver.execute_cdp_cmd('Network.clearBrowserCookies', {})
            print("[+] Browser cache and cookies cleared via CDP.")
        except Exception:
            print("[!] CDP not supported by this driver (skipping cache clear).")

        print("[✓] All browser data cleared successfully.")
    except Exception as e:
        print(f"[x] Error while clearing browser data: {e}")
        

def get_code(rec):
    tthus = True
    inc = 0
    while tthus:
        code = None
        if inc < 120:
            inc = inc + 1
            IMAP_SERVER = "imap.gmail.com"
            """
            EMAIL_ACCOUNT = "helenalary180@gmail.com"
            EMAIL_PASSWORD = "emxebzcliuznfbjo"  # 16-char app password
            """
            EMAIL_ACCOUNT = "adamhardison284@gmail.com"
            EMAIL_PASSWORD = "idspsdpmgungtrtb"
            
            # === CONNECT ===
            imap = imaplib.IMAP4_SSL(IMAP_SERVER)
            imap.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)

            # Search both inbox and spam if needed
            imap.select("INBOX")
            result, data = imap.search(None, f'TO "{rec}"')
            try:
                msg_ids = data[0].split()
                msg_ids = msg_ids[::-1]
                if len(msg_ids) > 0:
                    tthus = False
                    for msg_id in msg_ids:
                        result, msg_data = imap.fetch(msg_id, "(RFC822)")
                        raw_email = msg_data[0][1]
                        msg = email.message_from_bytes(raw_email)
                        subject, encoding = decode_header(msg.get("Subject"))[0]
                        subject = subject.decode(encoding or "utf-8", errors="ignore")
                        numbers = re.findall(r'\d+', subject)
                        code = numbers[0]
                        imap.logout()
            except:
                imap.logout()
            time.sleep(1)
        else:
            tthus = False
                   
    return code
        
    
    

"""
options.add_argument("--headless")  # Run Chrome in headless mode
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
"""

def run_register(driver):  
    bcl_2 = True
    while bcl_2:
        new_alias = ''.join(secrets.choice(string.ascii_lowercase) for _ in range(20))
        create_alias(ZONE_ID, new_alias, DEST_EMAIL)
        email_acc = new_alias + "@" + DOMAIN
        print('email_acc: ', email_acc)
        url ="https://cp.sprinthost.ru/customer/sites/index"
        driver.get(url)
        thus = True
        actions = ActionChains(driver)
        while thus:
            try:
                link = driver.find_element(By.LINK_TEXT, "Создать аккаунт")
                link.click()
                thus = False
            except:
                time.sleep(2)
                
        thus = True
        while thus:
            try:
                button = driver.find_element(
                    By.CSS_SELECTOR,
                    ".ui5-button-main.ui5-button-main--grey.ui5-button-main--L.ui5-button-main--dark.ui5-button-main--full"
                )
                button.click()
                thus = False
            except:
                time.sleep(2)
        thus = True
        while thus:
            print('input 1')
            try:
                email_ins = driver.find_elements(
                    By.TAG_NAME,
                    "input"
                )
                if len(email_ins) > 0:
                    print('input 2')
                    for inp in email_ins:
                        if inp.get_attribute("class") == "ui5-input__input ym-record-keys":
                            dd = driver.execute_script("return document.getElementsByClassName('ui5-input__input ym-record-keys')[0]")
                            actions.move_to_element(dd).click(dd).perform()
                            time.sleep(2)
                            dd.send_keys(email_acc)
                            time.sleep(2)
                            print('input 3')
                            try:
                                button = driver.find_element(
                                    By.CSS_SELECTOR,
                                    ".ui5-button-main.ui5-button-main--grey.ui5-button-main--L.ui5-button-main--dark.ui5-button-main--full"
                                )
                                actions.move_to_element(button).click(button).perform()
                                print('input 4')
                            except:
                                time.sleep(2)
                                print('input 5')
                            thus = False
            except:
                time.sleep(2)

        time.sleep(2)
        thus = True
        while thus:
            captcha = driver.execute_script("return document.querySelectorAll('[title=\"reCAPTCHA\"]')")
            print('captcha: ', len(captcha))
            if len(captcha) > 1:
                driver.switch_to.frame(captcha[0])
                thuss = True
                while thuss:
                    try:
                        anch = driver.find_element(By.ID, "recaptcha-anchor")
                        thuss = False
                    except:
                        pass
                actions.move_to_element(anch).click(anch).perform()
                time.sleep(3)
                thus = False
                thus_2 = True
                incc = 0
                while thus_2:
                        anch = driver.find_element(By.ID, "recaptcha-anchor")
                        if anch.get_attribute("aria-checked") == "true":
                            thus_2 = False
                            driver.switch_to.default_content()
                            
                            thus_1 = True
                            inc = 0
                            while thus_1:
                                if inc < 5:
                                    try:
                                        #btnns = driver.execute_script("return document.querySelectorAll('.cl-v3-btn-base.cl-v3-btn-base--main.cl-v3-btn-base--lg')")
                                        btnns = driver.find_elements(By.TAG_NAME, "button")
                                        for bt in btnns:
                                            if bt.get_attribute("class") == "cl-v3-btn-base cl-v3-btn-base--main cl-v3-btn-base--lg":
                                                actions.move_to_element(bt).click(bt).perform()
                                                break
                                        time.sleep(1)
                                        inc = inc + 1
                                    except:
                                        inc = inc + 1
                                        time.sleep(1)
                                        print('errrr')
                                else:
                                    thus_1 = False
                        else:
                            print('audio captcha')
                            thus_2 = False
                            driver.switch_to.default_content()
                            captchas = driver.execute_script("return document.querySelectorAll('[title=\"recaptcha challenge expires in two minutes\"]')")
                            print('captchas: ', len(captchas))
                            driver.switch_to.frame(captchas[0])
                            bttns = driver.find_elements(By.TAG_NAME, "button")
                            
                            bttns = driver.find_elements(By.TAG_NAME, "button")
                            print('bttns_1: ', len(bttns))
                            for bttn in bttns:
                                try:
                                    if bttn.get_attribute("class") == "rc-button goog-inline-block rc-button-audio":
                                        
                                        driver.execute_script("document.getElementsByClassName('rc-button goog-inline-block rc-button-audio')[0].click()")
                                except:
                                    pass
                                
                            bttns = driver.find_elements(By.TAG_NAME, "button")
                            print('bttns_2: ', len(bttns))
                            for bttn in bttns:
                                try:
                                    if bttn.get_attribute("class") == "rc-button-default goog-inline-block":
                                        bttns = driver.find_elements(By.TAG_NAME, "button")
                                        print('bttns_3: ', len(bttns))
                                        driver.execute_script("document.getElementsByClassName('rc-button-default goog-inline-block')[0].click()")
                                except:
                                    pass
                            time.sleep(3)
                            auds = driver.find_elements(By.TAG_NAME, "a")
                            bttns = driver.find_elements(By.TAG_NAME, "button")
                            print('auds: ', len(auds))
                            for aud in auds:
                                if aud.get_attribute("class") == "rc-audiochallenge-tdownload-link":
                                    aud_link = str(aud.get_attribute("href"))
                                    print('aud_link: ', aud_link)
                                    response = requests.get(aud_link)

                                    with open("audio.mp3", "wb") as f:
                                        f.write(response.content)
                                                                        
                                    model = WhisperModel("small")

                                    segments, info = model.transcribe("audio.mp3")

                                    text = ""
                                    for seg in segments:
                                        text += seg.text + " "

                                    bttns = driver.find_elements(By.TAG_NAME, "input")
                                    for bttn in bttns:
                                        try:
                                            if bttn.get_attribute("id") == "audio-response":
                                                bttn.send_keys(text, Keys.ENTER)
                                                time.sleep(2)
                                        except:
                                            pass
                                    break
                            
                            trthu = True
                            while trthu:
                                btntns = driver.find_elements(By.TAG_NAME, "div")
                                for btntn in btntns:
                                    try:
                                        if btntn.get_attribute("class") == "rc-audiochallenge-error-message":
                                            text = driver.execute_script("return arguments[0].innerText;", btntn)
                                            if "Multiple correct solutions" in text:
                                                btntnss = driver.execute_script('return document.getElementsByClassName("rc-button goog-inline-block rc-button-reload")')
                                                for btntnss_ in btntnss:
                                                    try:
                                                        if btntnss_.get_attribute("class") == "rc-button goog-inline-block rc-button-reload":
                                                            #actions.move_to_element(btntnss_).click(btntnss_).perform()
                                                            driver.execute_script('return document.getElementsByClassName("rc-button goog-inline-block rc-button-reload")[0].click()')
                                                            time.sleep(2)
                                                            bttns = driver.find_elements(By.TAG_NAME, "button")
                                                            for bttn in bttns:
                                                                try:
                                                                    if bttn.get_attribute("class") == "rc-button-default goog-inline-block":
                                                                        
                                                                        driver.execute_script("document.getElementsByClassName('rc-button-default goog-inline-block')[0].click()")
                                                                except:
                                                                    pass
                                                            
                                                            auds = driver.find_elements(By.TAG_NAME, "a")
                                                            for aud in auds:
                                                                if aud.get_attribute("class") == "rc-audiochallenge-tdownload-link":
                                                                    aud_link = str(aud.get_attribute("href"))
                                                                    print('aud_link: ', aud_link)
                                                                    response = requests.get(aud_link)

                                                                    with open("audio.mp3", "wb") as f:
                                                                        f.write(response.content)
                                                                                                        
                                                                    model = WhisperModel("small")

                                                                    segments, info = model.transcribe("audio.mp3")

                                                                    text = ""
                                                                    for seg in segments:
                                                                        text += seg.text + " "

                                                                    bttns = driver.find_elements(By.TAG_NAME, "input")
                                                                    for bttn in bttns:
                                                                        try:
                                                                            if bttn.get_attribute("id") == "audio-response":
                                                                                bttn.send_keys(text, Keys.ENTER)
                                                                                time.sleep(2)
                                                                        except:
                                                                            pass
                                                                    break
                                                            break
                                                    except:
                                                        pass
                                            break
                                    except:
                                        pass
                                trthu = False
                                
            else:
                try:
                    inps = driver.find_elements(By.TAG_NAME, "input")
                    for inp in inps:
                        if inp.get_attribute("class") == "ui5-input-code__input":
                            thus = False
                except:
                    pass
                            
        driver.switch_to.default_content()
        thus_1 = True
        inc = 0
        while thus_1:
            if inc < 5:
                try:
                    #btnns = driver.execute_script("return document.querySelectorAll('.cl-v3-btn-base.cl-v3-btn-base--main.cl-v3-btn-base--lg')")
                    btnns = driver.find_elements(By.TAG_NAME, "button")
                    for bt in btnns:
                        if bt.get_attribute("class") == "cl-v3-btn-base cl-v3-btn-base--main cl-v3-btn-base--lg":
                            actions.move_to_element(bt).click(bt).perform()
                            break
                    time.sleep(1)
                    inc = inc + 1
                except:
                    inc = inc + 1
                    time.sleep(1)
                    print('errrr')
            else:
                thus_1 = False
                
        code_ = None
        thus = True
        while thus:
            inps = driver.execute_script("return document.querySelectorAll('input[class=\"ui5-input-code__input empty\"]')")
            if len(inps) > 0:
                thus = False
                inp = inps[0]
                actions.move_to_element(inp).click(inp).perform()
                if code_ == None:
                    code_ = get_code(email_acc)
                    print('code_: ', code_)
                th_check = True
                while th_check:
                    for lt in code_:
                        scs = f"""
                            function setNativeValue(element, value) {{
                              const lastValue = element.value;
                              element.value = value;

                              const event = new Event("input", {{ bubbles: true }});
                              // React 17+ special handling
                              const tracker = element._valueTracker;
                              if (tracker) {{
                                tracker.setValue(lastValue);
                              }}

                              element.dispatchEvent(event);
                            }}
                            
                            setInterval(()=>{{setNativeValue(document.querySelector('[class="ui5-input-code__input empty"]'), "{lt}")}}, 300)"""
                        driver.execute_script(scs)
                    time.sleep(3)
                    inpsss = driver.execute_script("return document.querySelectorAll('input[class=\"ui5-input-code__input empty\"]')")
                    if len(inpsss) == 0:
                        th_check = False
            
            
        user_id = ""
        thus = True
        while thus:
            try:
                phns = driver.execute_script("return document.getElementsByClassName('ui5-button-main ui5-button-main--grey ui5-button-main--L ui5-button-main--dark ui5-button-main--full button-primary')")
                if len(phns) > 0:
                    driver.execute_script("document.getElementsByClassName('ui5-button-main ui5-button-main--grey ui5-button-main--L ui5-button-main--dark ui5-button-main--full button-primary')[0].click()")
                    thus = False
                    driver.execute_script("document.getElementsByClassName('profile-button header__item')[0].click()")
                    time.sleep(1)
                    user_id = driver.execute_script("return document.getElementsByClassName('ui5-menu-item__title')[1].innerText")
                    time.sleep(1)
            except:
                pass

        thus = True
        while thus:
            try:
                phns = driver.execute_script("return document.getElementsByClassName('skip-button')")
                if len(phns) > 0:
                    driver.execute_script("document.getElementsByClassName('skip-button')[0].click()")
                    thus = False
            except:
                pass
                
        print("user_id: ", user_id)
        thus = True
        while thus:
            driver.get("https://cp.sprinthost.ru/customer/mail/main")
            try:
                phns = driver.execute_script("return document.getElementsByClassName('ui5-button-main ui5-button-main--grey ui5-button-main--L ui5-button-main--dark ui5-button-main--full')")
                if len(phns) > 0:
                    driver.execute_script("document.getElementsByClassName('ui5-button-main ui5-button-main--grey ui5-button-main--L ui5-button-main--dark ui5-button-main--full')[0].click()")
                    thus = False
                    time.sleep(3)
            except:
                pass
                
        url = "https://cp.sprinthost.ru/customer/email-pop/index?domain="+user_id+".xsph.ru"
        driver.get(url)
        time.sleep(1)
        driver.execute_script("document.getElementsByClassName('ui5-button-graphic ui5-button-graphic--ghost')[0].click();")
        time.sleep(1)
        script = """
        document.querySelector('[name="user"]').value = 'helena-jahn';
        document.querySelector('[name="passwd"]').value = 'Arbinaji1987$';
        document.querySelector('[name="passwd2"]').value = 'Arbinaji1987$'; 
        document.getElementsByClassName('btn btn-primary hidden visible-xs visible-sm')[0].click()
        """
        driver.execute_script(script)
        time.sleep(3)
        username = "helena-jahn@" + user_id + ".xsph.ru"
        smtp_host = "smtp." + user_id + ".xsph.ru"
        imap_host = "mail." + user_id + ".xsph.ru"
        dataa = {"username": username, "host": smtp_host, "imap": imap_host}

        response = supabase.table("sprint_host_smtps").insert(dataa).execute()
        """
        driver.close()
        driver.quit()
        """
        clear_browser_data(driver)

bcl_1 = True
while bcl_1:
    driver_ = webdriver.Chrome(options=options)
    driver_.maximize_window()
    run_register(driver_)
    driver_.close()
    driver_.quit()
