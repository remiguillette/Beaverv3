
import { Router } from "express";
import { storage } from "./storage";

export function setupPanneauRoutes(app: Router) {
  app.get("/api/panneaux", async (req, res) => {
    const panneaux = await storage.getPanneaux();
    res.json(panneaux);
  });

  app.post("/api/panneaux", async (req, res) => {
    try {
      const { title, description, url } = req.body;
      
      if (!title || !description || !url) {
        return res.status(400).json({ 
          error: "Tous les champs sont requis" 
        });
      }

      const panneau = await storage.addPanneau(req.body);
      
      if (!panneau) {
        return res.status(500).json({ 
          error: "Erreur lors de la sauvegarde du panneau" 
        });
      }

      res.status(201).json(panneau);
    } catch (error) {
      console.error("Erreur serveur:", error);
      res.status(500).json({ 
        error: "Erreur interne du serveur" 
      });
    }
  });

  app.delete("/api/panneaux/:id", async (req, res) => {
    const success = await storage.deletePanneau(req.params.id);
    if (success) {
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  });
}
