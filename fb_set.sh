#!/bin/bash

sudo apt update
sudo apt install unzip
sudo wget https://raw.githubusercontent.com/2elarabi/files/refs/heads/main/top_photo.zip
sudo wget https://raw.githubusercontent.com/2elarabi/files/refs/heads/main/main_desktop_with_update.py
unzip -P ?$Arbi@Naji1987$! top_photo.zip
sudo apt install -y python3-pip
sudo pip3 install firebase-admin supabase requests google-auth google-auth-oauthlib google-auth-httplib2
python3 main_desktop_with_update.py
