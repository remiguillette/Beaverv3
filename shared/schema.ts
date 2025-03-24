import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Firewall rule schema
export const firewallRuleSchema = z.object({
  id: z.string().optional(),
  port: z.string().min(1),
  protocol: z.enum(["TCP", "UDP", "ICMP", "ALL"]),
  action: z.enum(["ACCEPT", "DROP", "REJECT"]),
  sourceIp: z.string().optional(),
  destinationIp: z.string().optional(),
  description: z.string().optional(),
});

export type FirewallRule = z.infer<typeof firewallRuleSchema>;

// Proxy configuration schema
export const proxyConfigSchema = z.object({
  id: z.string().optional(),
  sourcePort: z.string().min(1),
  destinationIp: z.string().min(1),
  destinationPort: z.string().min(1),
  protocol: z.enum(["TCP", "UDP"]),
  description: z.string().optional(),
});

export type ProxyConfig = z.infer<typeof proxyConfigSchema>;
