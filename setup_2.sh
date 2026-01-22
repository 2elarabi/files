#!/bin/bash

sudo apt update
sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb
sudo apt install -y python3-pip
sudo pip3 install requests supabase selenium undetected_chromedriver faster-whisper
sudo wget https://raw.githubusercontent.com/2elarabi/files/main/sprint_host_3.py
python3 sprint_host_3.py
