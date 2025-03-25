import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "beavernet-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Nom d'utilisateur déjà existant");
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Mettre à jour la durée du cookie de session si l'option "remember me" est activée
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
    } else {
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 jour (défaut)
    }
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  app.patch("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).send("Non autorisé");

    try {
      const user = req.user as SelectUser;
      const updateData: any = {};

      if (req.body.email) {
        updateData.email = req.body.email;
      }

      if (req.body.newPassword && req.body.newPassword.length > 0) {
        updateData.password = await hashPassword(req.body.newPassword);
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).send("Aucune donnée à mettre à jour");
      }

      const updatedUser = await storage.updateUser(user.id, updateData);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  });

  // Middleware to check if user is authenticated with redirect
  const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }

    const originalPort = req.get('x-forwarded-port') || req.socket.localPort;

    // If not authenticated and trying to access protected routes, redirect to auth
    if (originalPort && ['5001', '5002'].includes(originalPort.toString())) {
      return res.redirect('http://0.0.0.0:5000/auth');
    }

    res.status(401).json({ message: "Non autorisé" });
  };

  //Example usage of the middleware.  Replace with your actual protected routes.
  app.use('/api/user', ensureAuthenticated, (req,res,next) => {next()});
  app.use('/api/patch', ensureAuthenticated, (req,res,next) => {next()});

}