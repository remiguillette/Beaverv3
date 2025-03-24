import { users, type User, type InsertUser } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Firewall rules
  getFirewallRules(): Promise<any[]>;
  addFirewallRule(rule: any): Promise<any>;
  deleteFirewallRule(id: string): Promise<boolean>;
  
  // Proxy configurations
  getProxyConfigs(): Promise<any[]>;
  addProxyConfig(config: any): Promise<any>;
  deleteProxyConfig(id: string): Promise<boolean>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private firewallRules: Map<string, any>;
  private proxyConfigs: Map<string, any>;
  public sessionStore: session.SessionStore;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.firewallRules = new Map();
    this.proxyConfigs = new Map();
    this.currentId = 1;
    
    // Set up memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Create a default admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$8wKJfQVMZsLSGypOyP0.DOVj4EHmGg8MRqvfj3jH8JUmJDwGZNcPW", // "password" hashed
      email: "admin@beavernet.local"
    });
    
    // Create default user with provided credentials
    this.createUser({
      username: "Remiguillette",
      password: "$2b$10$Q9w.q7rS3Oqk6F6YxV3DHeqEeAGj7clfjUTwqtbceDH/XOP8ebP3q", // "MC44rg99qc@" hashed
      email: "remiguillette@beavernet.local"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Firewall rules
  async getFirewallRules(): Promise<any[]> {
    return Array.from(this.firewallRules.values());
  }
  
  async addFirewallRule(rule: any): Promise<any> {
    const id = Date.now().toString();
    const newRule = { ...rule, id };
    this.firewallRules.set(id, newRule);
    return newRule;
  }
  
  async deleteFirewallRule(id: string): Promise<boolean> {
    return this.firewallRules.delete(id);
  }
  
  // Proxy configurations
  async getProxyConfigs(): Promise<any[]> {
    return Array.from(this.proxyConfigs.values());
  }
  
  async addProxyConfig(config: any): Promise<any> {
    const id = Date.now().toString();
    const newConfig = { ...config, id };
    this.proxyConfigs.set(id, newConfig);
    return newConfig;
  }
  
  async deleteProxyConfig(id: string): Promise<boolean> {
    return this.proxyConfigs.delete(id);
  }
}

export const storage = new MemStorage();
