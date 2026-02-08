#!/bin/bash

sudo apt update
sudo wget https://raw.githubusercontent.com/2elarabi/files/refs/heads/main/config.json
sudo wget https://raw.githubusercontent.com/2elarabi/files/refs/heads/main/main_desktop_with_update.py
sudo wget https://raw.githubusercontent.com/2elarabi/files/refs/heads/main/serviceAccountKey.json
sudo apt install -y python3-pip
sudo pip3 install firebase-admin supabase requests google-auth google-auth-oauthlib google-auth-httplib2
python3 main_desktop_with_update.py
