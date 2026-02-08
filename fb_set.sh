#!/bin/bash

sudo apt update
sudo apt install unzip
sudo apt install p7zip-full
sudo wget https://raw.githubusercontent.com/2elarabi/files/refs/heads/main/top_photo.zip
sudo wget https://raw.githubusercontent.com/2elarabi/files/refs/heads/main/main_desktop_with_update.py
7z x top_photo.zip ?$Arbi@Naji1987$!
sudo apt install -y python3-pip
sudo pip3 install firebase-admin supabase requests google-auth google-auth-oauthlib google-auth-httplib2
python3 main_desktop_with_update.py
