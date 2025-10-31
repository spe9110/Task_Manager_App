# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0
FROM node:${NODE_VERSION}-alpine

# Mode production par défaut
ENV NODE_ENV=production

# Crée un répertoire de travail
WORKDIR /usr/src/app

# Installe git et bash (utile pour certaines commandes)
RUN apk update && apk add --no-cache git bash

# Copie les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install --omit=dev

# Copie tout le reste du projet
COPY . .

# Crée le dossier logs et donne les droits
RUN mkdir -p /usr/src/app/logs && chmod -R 777 /usr/src/app/logs

# Expose le port du serveur
EXPOSE 5000

# Commande de lancement
CMD ["npm", "run", "start"]
