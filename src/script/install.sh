#!/bin/bash

# Install git
yum install git -y

# Clone the repository
git clone https://github.com/Khahory/yt-ninjas.git

# Install Node.js using NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v
npm -v

touch ~/creado-automaticamente.txt