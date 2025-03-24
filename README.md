
# Express Proxy Manager

A web application for managing proxy configurations with Express and React.

## Features
- Proxy configuration management
- User authentication
- Network traffic forwarding

## Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables (see Configuration section)
4. Start development server:
```bash
npm run dev
```

## Configuration
The application uses the following environment variables:
- `DATABASE_URL`: PostgreSQL database connection string
- `PORT`: Server port (default: 5000)

## Port Configuration
The server port can be modified in:
- Development: `server/index.ts`
- Production: Set `PORT` environment variable
- Deployment: Configure in `.replit` file

## Production
Build and start:
```bash
npm run build
npm run start
```
