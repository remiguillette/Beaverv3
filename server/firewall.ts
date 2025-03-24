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

export function setupFirewallRoutes(app: Express) {
  // Get all firewall rules
  app.get("/api/firewall/rules", ensureAuthenticated, async (req, res) => {
    try {
      const rules = await storage.getFirewallRules();
      res.json(rules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add a new firewall rule
  app.post("/api/firewall/rules", ensureAuthenticated, async (req, res) => {
    try {
      const { port, protocol, action, sourceIp, destinationIp, description } = req.body;

      // Validate required fields
      if (!port || !protocol || !action) {
        return res.status(400).json({ message: "Port, protocole et action sont requis" });
      }

      // Apply the rule using iptables
      const hasIptables = await commandExists("iptables");
      
      if (hasIptables) {
        try {
          let command = `iptables -A INPUT`;
          
          if (protocol !== "ALL") {
            command += ` -p ${protocol.toLowerCase()}`;
          }
          
          command += ` --dport ${port}`;
          
          if (sourceIp) {
            command += ` -s ${sourceIp}`;
          }
          
          if (destinationIp) {
            command += ` -d ${destinationIp}`;
          }
          
          command += ` -j ${action}`;
          
          // Execute the command
          await execAsync(command);
        } catch (execError: any) {
          console.error("Iptables command failed:", execError.message);
          // Continue with storing the rule even if iptables command fails
        }
      }

      // Store the rule in memory
      const newRule = await storage.addFirewallRule({
        port,
        protocol,
        action,
        sourceIp,
        destinationIp,
        description
      });

      res.status(201).json(newRule);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete a firewall rule
  app.delete("/api/firewall/rules/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the rule first
      const rules = await storage.getFirewallRules();
      const rule = rules.find(r => r.id === id);
      
      if (!rule) {
        return res.status(404).json({ message: "Règle non trouvée" });
      }
      
      // Try to delete the rule using iptables if available
      const hasIptables = await commandExists("iptables");
      
      if (hasIptables && rule) {
        try {
          let command = `iptables -D INPUT`;
          
          if (rule.protocol !== "ALL") {
            command += ` -p ${rule.protocol.toLowerCase()}`;
          }
          
          command += ` --dport ${rule.port}`;
          
          if (rule.sourceIp) {
            command += ` -s ${rule.sourceIp}`;
          }
          
          if (rule.destinationIp) {
            command += ` -d ${rule.destinationIp}`;
          }
          
          command += ` -j ${rule.action}`;
          
          // Execute the command
          await execAsync(command);
        } catch (execError: any) {
          console.error("Iptables delete command failed:", execError.message);
          // Continue with removing the rule even if iptables command fails
        }
      }

      // Remove the rule from storage
      const deleted = await storage.deleteFirewallRule(id);
      
      if (deleted) {
        res.status(200).json({ message: "Règle supprimée avec succès" });
      } else {
        res.status(500).json({ message: "Erreur lors de la suppression de la règle" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
