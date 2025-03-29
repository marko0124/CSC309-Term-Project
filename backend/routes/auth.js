#!/usr/bin/env node
'use strict';

const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const rateLimiter = {
    ips: new Map(),
    checkTimer(ip) {
        const curr = Date.now();
        const lastReset = this.ips.get(ip);
        if (lastReset && curr - lastReset < 60000) {
            return false;
        }
        return true;
    },
    set(ip) {
        this.ips.set(ip, Date.now());
    }
}

router.post('/tokens', async (req, res) => {
    try {
        const {utorid, password} = req.body;

        if (!utorid || typeof utorid !== "string" || !password || password === undefined || password === null || typeof password !== "string") {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const user = await prisma.user.findUnique({
            where: {utorid}
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (!user.password || password !== user.password) {
            return res.status(401).json({"error": "Unauthorized"});
        }

        const authUser = await prisma.user.update({
            where: {id: user.id},
            data: {
                lastLogin: new Date()
            }
        });
        if (!authUser) {
            return res.status(404).json({"error": "Not Found"});
        }
        
        const token = jwt.sign({id: authUser.id, role: authUser.role}, 'your-secret-key', {expiresIn: '24h'});
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + (24 * 60 * 60 * 1000));
    
        return res.status(200).json({token: token,
            expiresAt: expiry
        });
    } catch (error) {
        console.error("Error", error);
    }
});

router.post('/resets', async (req, res) => {
    try {
        const {utorid} = req.body;
        if (!utorid) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (!rateLimiter.checkTimer(req.ip)) {
            return res.status(429).json({"error": "Too Many Requests"});
        }
    
        const user = await prisma.user.findUnique({
            where: {utorid}
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }

        const token = uuidv4();
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + (60 * 60 * 1000));
        const authUser = await prisma.user.update({
            where: {id: user.id},
            data: {
                resetToken: token,
                expiresAt: expiry
            }
        });
        if (!authUser) {
            return res.status(404).json({"error": "Not Found"});
        }
        
        rateLimiter.set(req.ip);
        return res.status(202).json({
            expiresAt: expiry,
            resetToken: token
        });
    } catch (error) {
        console.error("Error", error);
    }
});

router.post('/resets/:resetToken', async (req, res) => {
    try {
        const {utorid, password} = req.body;
        const {resetToken} = req.params;
    
        if (!utorid || !password || !resetToken) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const user = await prisma.user.findUnique({
            where: {utorid}
        });
        const tokenUser = await prisma.user.findFirst({
            where: {resetToken}
        });
        if (!user || !tokenUser) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (user.resetToken !== resetToken || user.id !== tokenUser.id) {
            return res.status(401).json({"error": "Unauthorized"});
        }
        if (!user.resetToken) {
            return res.status(404).json({"error": "Not Found"});
        }
        const curr = new Date();
        if (!user.expiresAt || curr > user.expiresAt) {
            return res.status(410).json({"error": "Gone"});
        }
    
        if (typeof password !== 'string' || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const updateUser = await prisma.user.update({
            where: {id: user.id},
            data: {
                password: password,
                resetToken: null,
                expiresAt: null
            }
        });
    
        return res.status(200).json({user: updateUser.utorid + "'s password was updated."});
    } catch (error) {
        console.error("Error", error);
    }
});

module.exports = router;