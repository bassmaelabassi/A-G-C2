# Utilise une image Node officielle
FROM node:18

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Expose le port 3000
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"] 