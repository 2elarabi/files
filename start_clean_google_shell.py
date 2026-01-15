import subprocess
import time

'''
pip install requests selenium
python3 start_clean_google_shell.py
'''

for x in range(9):
    subprocess.Popen(["python3", "gmail_test_not_captcha.py"])
    time.sleep(60)
