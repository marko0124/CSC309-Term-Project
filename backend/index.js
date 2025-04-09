#!/usr/bin/env node
'use strict';

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

app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/events", eventRoutes);
app.use("/promotions", promotionRoutes);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error(`cannot start server: ${err.message}`);
    process.exit(1);
});