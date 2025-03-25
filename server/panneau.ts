
import { Router } from "express";
import { storage } from "./storage";

export function setupPanneauRoutes(app: Router) {
  app.get("/api/panneaux", async (req, res) => {
    const panneaux = await storage.getPanneaux();
    res.json(panneaux);
  });

  app.post("/api/panneaux", async (req, res) => {
    const panneau = await storage.addPanneau(req.body);
    res.json(panneau);
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
