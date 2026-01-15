import undetected_chromedriver as uc
from selenium.webdriver import ChromeOptions
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import os
import requests
from supabase import create_client, Client

"""
sudo apt update
sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
sudo apt install -y python3-pip
sudo pip3 install requests supabase selenium undetected_chromedriver
python3 gmail_test_not_captcha.py
"""

ip = requests.get("https://api.ipify.org?format=json").json()["ip"]

url_1 = "https://jdnmanfimzvbilacjgcj.supabase.co"
key1 = "sb_secret_eVYWCtpPzmFsbJryaEug0A_EYBBcCII"

url_ = "https://vptrmftnkfewhscirhqe.supabase.co"
key = "sb_secret_xw2d9ghzJh0MezkSGTCeOw_C1_4FXKj"
supabase_1: Client = create_client(url_, key)

response_data_3 = supabase_1.table('datas').select("*").eq("active", 1).execute()
table_name = str(response_data_3.data[0]['name'])

response_data_3 = supabase_1.table('offers').select("*").eq("active", 1).execute()
subject = str(response_data_3.data[0]['subject'])
of_id = str(response_data_3.data[0]['id'])
letter = str(response_data_3.data[0]['letter'])
letter = letter.replace("[of_id]", of_id)
letter = letter.replace("[my_ip]", ip)

thh = True
while thh:
    response_data_3 = supabase_1.rpc(
        "claim_unused_gmail_account",
        {"uid": 1}
    ).execute()
    
    print('response_data_3: ', response_data_3.data[0])
    
    gm_username = response_data_3.data[0]['email']
    gm_pass = response_data_3.data[0]['pass']
    gm_recovery = response_data_3.data[0]['rec_em']
    max_send = response_data_3.data[0]['max_send']
    time_between_msg = int(21600 / max_send)


    url = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dgmail.com%26oq%3Dgmail%26gs_lcrp%3DEgZjaHJvbWUqBwgBEAAYjwIyBggAEEUYOTIHCAEQABiPAjIHCAIQABiPAjIGCAMQRRg9MgYIBBBFGD3SAQgzMTAxajBqNKgCALACAQ%26sourceid%3Dchrome%26ie%3DUTF-8&dsh=S-1894901072%3A1764852364751767&ec=futura_srp_og_si_72236_p&hl=fr&ifkv=ARESoU16T_GnNuZ0_jDfKA7W7GSa0ZNwFJ_TNwIRGIXc3uKOwUcwczEv6GWc0OlMyQsuh5bnlkRM&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
    options = uc.ChromeOptions()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-first-run --no-service-autorun --password-store=basic")
    driver = uc.Chrome(options=options)
    driver.maximize_window()
    driver.get(url)
    actions = ActionChains(driver)


    src = f"""
    function setNativeValue(element, value) {{
      const lastValue = element.value;
      element.value = value;

      const event = new Event("input", {{ bubbles: true }});

      const tracker = element._valueTracker;
      if (tracker) tracker.setValue(lastValue);

      element.dispatchEvent(event);
    }};
    let ss = document.querySelector('[id="identifierId"]')
    setNativeValue(ss, '{gm_username}')
    document.querySelector('\div[id="identifierNext"]').querySelector('button').click()
    """
    driver.execute_script(src)
    time.sleep(3)
    not_found = driver.execute_script("return document.querySelectorAll('[class=\"Ekjuhf Jj6Lae\"]')")
    if len(not_found) > 0:
        pass
    else:
        thus = True
        while thus:
            captcha = driver.execute_script("return document.querySelectorAll('[title=\"reCAPTCHA\"]')")
            print('captcha: ', len(captcha))
            if len(captcha) > 0:
                thus = False
                response_data_step = supabase_1.table('gmails_acc').update({"phone_notification": 1}).eq("id", gm_id).execute()
            else:
                thus = False
                
                src = f"""
                function setNativeValue(element, value) {{
                  const lastValue = element.value;
                  element.value = value;

                  const event = new Event("input", {{ bubbles: true }});

                  const tracker = element._valueTracker;
                  if (tracker) tracker.setValue(lastValue);

                  element.dispatchEvent(event);
                }};
                let sss = document.querySelector('[name="Passwd"]')
                setNativeValue(sss, '{gm_pass}')
                document.querySelector('\div[id="passwordNext"]').querySelector('button').click()
                """
                th_name = True
                while th_name:
                    mames = driver.execute_script("return document.querySelectorAll('[name=\"Passwd\"]')")
                    if len(mames) > 0:
                        th_name = False
                driver.execute_script(src)
                time.sleep(3)
                
                page_title = driver.execute_script("return document.title")
                if "deux étapes" in page_title or "2-Step" in page_title:
                    src_try_2 = """
                        const ellq = Array.from(document.querySelectorAll('button[type="button"]'))
                        .find(e => e.textContent.includes("Essayer une autre méthode") || e.textContent.includes("Try another way"));

                        if (ellq) ellq.click();
                    """
                    driver.execute_script(src_try_2)
                    time.sleep(5)
                    src_try_3 = """
                    const elementsWithText = [...document.querySelectorAll('div.VV3oRb.YZVTmd.SmR8')]
                    .filter(el => 
                        el.innerText.includes('Tap Yes') ||
                        el.innerText.includes('Appuyez sur Oui')
                    );
                    elementsWithText[0].click()
                    """
                    driver.execute_script(src_try_3)
                    time.sleep(5)
                    
                    src_yes = """
                        const ell = Array.from(document.querySelectorAll('button[type="button"]'))
                        .find(e => e.textContent.includes("Oui") || e.textContent.includes("Yes"));

                        if (ell) ell.click();
                    """
                    driver.execute_script(src_yes)
                else:
                    mames_2 = driver.execute_script("return document.querySelectorAll('div[class=\"VV3oRb YZVTmd SmR8\"]')")
                    if len(mames_2) > 0:
                        src = """
                        const elementsWithText = [...document.querySelectorAll('div.VV3oRb.YZVTmd.SmR8')]
                        .filter(el => 
                            el.innerText.includes('Confirm') ||
                            el.innerText.includes('herstelmailadres')
                        );
                        elementsWithText[0].click()
                        """
                        driver.execute_script(src)
                        time.sleep(3)

                        src = f"""

                        function setNativeValue(element, value) {{
                          const lastValue = element.value;
                          element.value = value;

                          const event = new Event("input", {{ bubbles: true }});

                          const tracker = element._valueTracker;
                          if (tracker) tracker.setValue(lastValue);

                          element.dispatchEvent(event);
                        }};
                        let ss = document.querySelector('[id="knowledge-preregistered-email-response"]')
                        setNativeValue(ss, '{gm_recovery}')
                        document.querySelector('button[jscontroller="soHxf"').click()

                        """
                        driver.execute_script(src)
                        time.sleep(3)
                
                url = "https://mail.google.com/mail/u/0/#sent"
                driver.get(url)
                
                src = """
                    const policy = trustedTypes.createPolicy('default', {
                      createHTML: (input) => input, // sanitize properly in production
                    });
                    if (window.trustedTypes && !window._seleniumPolicy) {
                        try {
                            window._seleniumPolicy = trustedTypes.createPolicy(
                                'seleniumPolicy',
                                { createHTML: x => x }
                            );
                        } catch (e) {
                            // Policy already exists or creation blocked
                            window._seleniumPolicy = null;
                        }
                    }
                """
                driver.execute_script(src)
                for emy in range(max_send):
                    """
                    response_data_3 = supabase_1.rpc(
                        "get_one_email_and_insert",
                        {"p_offer_id": int(of_id), "p_table": table_name}
                    ).execute()
                    """
                    bnc_url = "https://vptrmftnkfewhscirhqe.supabase.co/functions/v1/get_email?table="+table_name+"&offer_id=" + of_id
                    response = requests.get(
                        bnc_url
                    )
                    response.raise_for_status()
                    daata = response.json()

                    #x = str(response_data_3.data[0]['email'])
                    x = daata['email']
                    
                    letter__  = letter
                    letter_ = letter__.replace("[em]", x)
                    src_1 = """
                        var element = document.querySelector('.Am.aiL.Al.editable');
                        if (window._seleniumPolicy) {
                            element.innerHTML = window._seleniumPolicy.createHTML(`[msg]`);
                        }
                    """
                    src_1 = src_1.replace("[msg]", letter_)
                    
                    src_2 = """
                        const ell = Array.from(document.querySelectorAll('div[role="button"]'))
                        .find(e => e.textContent.includes("Envoyer") || e.textContent.includes("Send"));

                        if (ell) ell.click();
                        setTimeout(()=>{
                          let not_delivered = document.querySelectorAll('.zA.zE')
                          if(not_delivered.length > 0){
                              for(let ii=0; ii<not_delivered.length; ii++){
                                  let not_ems = not_delivered[ii].querySelectorAll(`[email="[ermss]"]`)
                                  if(not_ems.length > 0){
                                      fetch(`https://vptrmftnkfewhscirhqe.functions.supabase.co/insert_bounced_email_outlook?email=[ermss]`);
                                      console.log('bounced done')
                                      break
                                  }
                              }
                          }
                        }, 20000)
                    """
                    src_2 = src_2.replace("[ermss]", x)
                    th_compose = True
                    while th_compose:
                        composes = driver.execute_script("return document.querySelectorAll('[class=\"T-I T-I-KE L3\"]')")
                        if len(composes) > 0:
                            time.sleep(1)
                            driver.execute_script("document.querySelectorAll('[class=\"T-I T-I-KE L3\"]')[0].click()")
                            th_compose = False
                            
                    th_recepient = True
                    while th_recepient:
                        recepients = driver.execute_script("return document.querySelectorAll('[class=\"agP aFw\"]')")
                        if len(recepients) > 0:
                            time.sleep(1)
                            em = x
                            x_src = f"document.querySelectorAll('[class=\"agP aFw\"]')[0].value = \"{em}\""
                            driver.execute_script(x_src)
                            th_recepient = False
                            
                    th_recepient = True
                    while th_recepient:
                        recepients = driver.execute_script("return document.querySelectorAll('[placeholder=\"Subject\"], [placeholder=\"Objet\"]')")
                        if len(recepients) > 0:
                            time.sleep(1)
                            driver.execute_script(f"document.querySelectorAll('[placeholder=\"Subject\"], [placeholder=\"Objet\"]')[0].value = \"{subject}\"")
                            th_recepient = False
                            time.sleep(2)
                            driver.execute_script(src_1)
                            time.sleep(3)
                            driver.execute_script(src_2)
                            time.sleep(time_between_msg)
        
        
time.sleep(100000)