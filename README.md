
# Gestionnaire de Proxy Express

Une application web pour gérer les configurations de proxy avec Express et React.

## Fonctionnalités
- Gestion des configurations de proxy
- Authentification utilisateur
- Redirection du trafic réseau

## Installation
1. Cloner le dépôt
2. Installer les dépendances :
```bash
npm install
```
3. Configurer les variables d'environnement (voir section Configuration)
4. Démarrer le serveur de développement :
```bash
npm run dev
```

## Configuration
L'application utilise les variables d'environnement suivantes :
- `DATABASE_URL` : Chaîne de connexion à la base de données PostgreSQL 
- `PORT` : Port du serveur (par défaut : 5000)

## Configuration du Port
Le port du serveur peut être modifié dans :
- Développement : `server/index.ts`
- Production : Définir la variable d'environnement `PORT`
- Déploiement : Configurer dans le fichier `.replit`

## Production
Compiler et démarrer :
```bash
npm run build
npm run start
```
