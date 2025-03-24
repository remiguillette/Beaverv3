import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Middleware to check if user is authenticated
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Non autorisé" });
};

// Check if command exists
function commandExists(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    exec(`which ${command}`, (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export function setupProxyRoutes(app: Express) {
  // Get all proxy configurations
  app.get("/api/proxy/configs", ensureAuthenticated, async (req, res) => {
    try {
      const configs = await storage.getProxyConfigs();
      res.json(configs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add a new proxy configuration
  app.post("/api/proxy/configs", ensureAuthenticated, async (req, res) => {
    try {
      const { sourcePort, destinationIp, destinationPort, protocol, description } = req.body;

      // Validate required fields
      if (!sourcePort || !destinationIp || !destinationPort || !protocol) {
        return res.status(400).json({ 
          message: "Port source, IP destination, port destination et protocole sont requis" 
        });
      }

      // Apply the proxy configuration using iptables
      const hasIptables = await commandExists("iptables");
      
      if (hasIptables) {
        try {
          // Enable IP forwarding
          await execAsync("sysctl -w net.ipv4.ip_forward=1");
          
          // Setup NAT prerouting
          const preRoutingCmd = `iptables -t nat -A PREROUTING -p ${protocol.toLowerCase()} --dport ${sourcePort} -j DNAT --to ${destinationIp}:${destinationPort}`;
          
          // Setup routing for forwarded packets
          const forwardCmd = `iptables -A FORWARD -p ${protocol.toLowerCase()} -d ${destinationIp} --dport ${destinationPort} -j ACCEPT`;
          
          // Execute the commands
          await execAsync(preRoutingCmd);
          await execAsync(forwardCmd);
        } catch (execError: any) {
          console.error("Iptables proxy command failed:", execError.message);
          // Continue with storing the config even if iptables command fails
        }
      }

      // Store the config in memory
      const newConfig = await storage.addProxyConfig({
        sourcePort,
        destinationIp,
        destinationPort,
        protocol,
        description
      });

      res.status(201).json(newConfig);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete a proxy configuration
  app.delete("/api/proxy/configs/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the config first
      const configs = await storage.getProxyConfigs();
      const config = configs.find(c => c.id === id);
      
      if (!config) {
        return res.status(404).json({ message: "Configuration non trouvée" });
      }
      
      // Try to delete the config using iptables if available
      const hasIptables = await commandExists("iptables");
      
      if (hasIptables && config) {
        try {
          // Remove NAT prerouting rule
          const preRoutingCmd = `iptables -t nat -D PREROUTING -p ${config.protocol.toLowerCase()} --dport ${config.sourcePort} -j DNAT --to ${config.destinationIp}:${config.destinationPort}`;
          
          // Remove forward rule
          const forwardCmd = `iptables -D FORWARD -p ${config.protocol.toLowerCase()} -d ${config.destinationIp} --dport ${config.destinationPort} -j ACCEPT`;
          
          // Execute the commands
          await execAsync(preRoutingCmd);
          await execAsync(forwardCmd);
        } catch (execError: any) {
          console.error("Iptables proxy delete command failed:", execError.message);
          // Continue with removing the config even if iptables command fails
        }
      }

      // Remove the config from storage
      const deleted = await storage.deleteProxyConfig(id);
      
      if (deleted) {
        res.status(200).json({ message: "Configuration supprimée avec succès" });
      } else {
        res.status(500).json({ message: "Erreur lors de la suppression de la configuration" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
