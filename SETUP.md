
# Setup Guide

## Linux Installation

1. Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Install PostgreSQL:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

3. Clone and setup project:
```bash
git clone <your-repo-url>
cd <project-directory>
npm install
```

4. Database setup:
```bash
sudo -u postgres psql
CREATE DATABASE proxymanager;
CREATE USER proxyuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE proxymanager TO proxyuser;
```

5. Environment setup:
```bash
echo "DATABASE_URL=postgresql://proxyuser:yourpassword@localhost:5432/proxymanager" > .env
```

6. Start development server:
```bash
npm run dev
```

## Dependencies List
- Core:
  - express
  - react
  - typescript
  - drizzle-orm
  - @neondatabase/serverless
  - passport
  - express-session

- UI:
  - tailwindcss
  - shadcn/ui components
  - lucide-react

- Development:
  - vite
  - tsx
  - typescript
  - esbuild

## Port Configuration Guide

1. Development port (server/index.ts):
```typescript
const port = process.env.PORT || 5000;
```

2. Production port:
- Set PORT environment variable
- Update .replit configuration:
```toml
[[ports]]
localPort = YOUR_PORT
externalPort = 80
```

3. Verify port access:
```bash
sudo netstat -tulpn | grep LISTEN
```

4. Firewall configuration (if needed):
```bash
sudo ufw allow YOUR_PORT/tcp
```
