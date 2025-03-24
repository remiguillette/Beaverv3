
# Guide d'Installation

## Installation Linux

1. Installer Node.js et npm :
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Installer PostgreSQL :
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

3. Cloner et configurer le projet :
```bash
git clone <url-de-votre-dépôt>
cd <dossier-du-projet>
npm install
```

4. Configuration de la base de données :
```bash
sudo -u postgres psql
CREATE DATABASE proxymanager;
CREATE USER proxyuser WITH PASSWORD 'votremotdepasse';
GRANT ALL PRIVILEGES ON DATABASE proxymanager TO proxyuser;
```

5. Configuration de l'environnement :
```bash
echo "DATABASE_URL=postgresql://proxyuser:votremotdepasse@0.0.0.0:5432/proxymanager" > .env
```

6. Démarrer le serveur de développement :
```bash
npm run dev
```

## Liste des Dépendances
- Core :
  - express
  - react
  - typescript
  - drizzle-orm
  - @neondatabase/serverless
  - passport
  - express-session

- Interface utilisateur :
  - tailwindcss
  - composants shadcn/ui
  - lucide-react

- Développement :
  - vite
  - tsx
  - typescript
  - esbuild

## Guide de Configuration des Ports

1. Port de développement (server/index.ts) :
```typescript
const port = process.env.PORT || 5000;
```

2. Port de production :
- Définir la variable d'environnement PORT
- Mettre à jour la configuration .replit :
```toml
[[ports]]
localPort = VOTRE_PORT
externalPort = 80
```

3. Vérifier l'accès au port :
```bash
sudo netstat -tulpn | grep LISTEN
```

4. Configuration du pare-feu (si nécessaire) :
```bash
sudo ufw allow VOTRE_PORT/tcp
```
