import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuthRoutes } from "./auth";
import { setupFirewallRoutes } from "./firewall";
import { setupProxyRoutes } from "./proxy";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuthRoutes(app);
  
  // Setup firewall and proxy routes
  setupFirewallRoutes(app);
  setupProxyRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
