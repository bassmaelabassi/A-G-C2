# Microservice de Gestion de Compétences

Ce projet est un microservice Node.js/Express pour gérer les compétences et leurs évaluations.

## Prérequis

- Node.js (v18+)
- Docker (recommandé)
- MongoDB

## Installation

1. Clonez le dépôt.
2. Accédez au dossier `backend` : `cd backend`
3. Installez les dépendances : `npm install`

## Configuration

1. Créez un fichier `.env` à la racine du dossier `backend`.
2. Inspirez-vous du fichier `.env.example` (s'il existe) ou ajoutez les variables suivantes :

```
# Port du serveur
PORT=9000

# URI de connexion à votre base MongoDB
# Pour Docker, utilisez le nom du service mongo
MONGO_URI=mongodb://mongo:27017/competencesDB
# Pour une instance locale
# MONGO_URI=mongodb://localhost:27017/competencesDB
```

## Lancement

### Avec Docker (Recommandé)

Assurez-vous que Docker est en cours d'exécution, puis lancez :

```bash
docker-compose up --build
```

L'API sera accessible sur `http://localhost:9000`.

### Localement

Pour lancer le serveur en mode développement (avec rechargement automatique) :

```bash
npm run dev
```

Pour lancer en production :

```bash
npm start
```

## Lancer les tests

Pour exécuter la suite de tests unitaires et d'intégration :

```bash
npm test
``` 