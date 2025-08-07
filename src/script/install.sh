#!/bin/bash

# Habilitar logging detallado
set -xe

# Instalar Git
dnf install -y git

# Clonar tu repo
git clone https://github.com/Khahory/yt-ninjas.git /home/ec2-user/yt-ninjas

# Instalar Node.js 18 desde Nodesource (compatible y LTS)
curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
dnf install -y nodejs

# Verificar instalación
node -v
npm -v

# Cambiar propietario del repo clonado (muy importante en user-data)
chown -R ec2-user:ec2-user /home/ec2-user/yt-ninjas

# Instalar dependencias del proyecto
npm install --prefix /home/ec2-user/yt-ninjas

# Crear un archivo de prueba
touch /home/ec2-user/creado-automaticamente.txt