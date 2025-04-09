#!/usr/bin/env node
'use strict';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const port = process.env.PORT || 3001;

const express = require("express");
const cors = require("cors");

const app = express();
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const eventRoutes = require("./routes/events");
const promotionRoutes = require("./routes/promotions");
// Add after app initialization
app.get('/debug-prisma', async (req, res) => {
    try {
      // Test direct database access
      const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
      res.json({
        tables: result,
        dbUrl: process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'),
        fileExists: require('fs').existsSync(process.env.DATABASE_URL.replace('file:', '')),
        dbDir: require('fs').readdirSync('/data/sqlite')
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        code: error.code,
        meta: error.meta
      });
    }
  });
  
  // Fix CORS issues
  const corsOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
  const formattedOrigin = corsOrigin.startsWith('http') 
    ? corsOrigin 
    : `https://${corsOrigin}`;
  
  
  
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  console.log('CORS configured with origin:', formattedOrigin);

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/events", eventRoutes);
app.use("/promotions", promotionRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      database: 'SQLite',
      dbPath: process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    });
  });

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error(`cannot start server: ${err.message}`);
    process.exit(1);
});