#!/bin/bash

sudo apt update
sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb
sudo apt install -y python3-pip
sudo wget https://raw.githubusercontent.com/2elarabi/files/main/sprint_host_3_captcha_open_ai_two_captcha.py
#sudo pip3 install requests supabase selenium undetected_chromedriver faster-whisper
sudo pip3 install requests supabase selenium undetected_chromedriver whisper openai-whisper
sudo pip3 install torch --index-url https://download.pytorch.org/whl/cu121
sudo wget https://raw.githubusercontent.com/2elarabi/files/main/sprint_host_3.py
python3 sprint_host_3_captcha_open_ai_two_captcha.py
