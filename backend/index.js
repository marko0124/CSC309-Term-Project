#!/usr/bin/env node
'use strict';
const { setupDatabase } = require('./setUpdb');
const { PrismaClient } = require('@prisma/client');
let prisma;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const port = process.env.PORT || 3001;

const express = require("express");
const cors = require("cors");
const fs = require('fs');
const app = express();
// Better CORS handling
const corsOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
const formattedOrigin = corsOrigin.startsWith('http') 
  ? corsOrigin 
  : `https://${corsOrigin}`;

app.use(cors({
  origin: formattedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

console.log('CORS configured with origin:', formattedOrigin);

// Start server first
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Then initialize database and routes
setupDatabase()
  .then(() => {
    console.log('Database setup complete');
    prisma = new PrismaClient();
    
    // Add routes after database is ready
    const userRoutes = require("./routes/users");
    const authRoutes = require("./routes/auth");
    const transactionRoutes = require("./routes/transactions");
    const eventRoutes = require("./routes/events");
    const promotionRoutes = require("./routes/promotions");
    
    app.use(express.json());
    app.use("/users", userRoutes);
    app.use("/auth", authRoutes);
    app.use("/transactions", transactionRoutes);
    app.use("/events", eventRoutes);
    app.use("/promotions", promotionRoutes);
    
    // Update health check
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        database: 'SQLite',
        dbPath: process.env.DATABASE_URL,
        timestamp: new Date().toISOString()
      });
    });
  })
  .catch(error => {
    console.error('Failed to setup database:', error);
  });

server.on('error', (err) => {
  console.error(`cannot start server: ${err.message}`);
  process.exit(1);
});