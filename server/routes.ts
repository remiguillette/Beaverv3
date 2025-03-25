import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuthRoutes } from "./auth";

import { setupPanneauRoutes } from "./panneau";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user

  setupPanneauRoutes(app);

  setupAuthRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
