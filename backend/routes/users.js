#!/usr/bin/env node
'use strict';

const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const auth = require('../middleware/auth');

router.post('/', auth.login, auth.checkRole('cashier'), async (req, res) => {
    try {
        const {utorid, name, email} = req.body;

        if (!utorid || !name || !email || !(/^[a-zA-Z0-9]+$/.test(utorid)) || utorid.length !== 8 || name.length < 1 || name.length > 50 || !email.endsWith("@mail.utoronto.ca")) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    {utorid: utorid},
                    {email: email}
                ]
            }
        });
        if (existing) {
            return res.status(409).json({"error": "Conflict"});
        }

        const token = uuidv4();
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        const newUser = await prisma.user.create({
            data: {
                utorid: utorid,
                email: email,
                name: name,
                resetToken: token,
                expiresAt: expiry
            }
        });

        return res.status(201).json({
            id: newUser.id,
            utorid: newUser.utorid,
            name: newUser.name,
            email: newUser.email,
            verified: newUser.verified,
            expiresAt: expiry.toISOString(),
            resetToken: token
        });
    } catch (error) {
        console.errror('Error', error);
    }
    
});

router.get('/', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const {name, role, verified, activated, page=1, limit=10, orderBy="asc"} = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const conditions = {};
    
        if (name) {
            conditions.OR = [
                {utorid: {contains: name}},
                {name: {contains: name}}
            ];
        }
    
        if (role) {
            const roles = role.split(" ");
            if (roles.length === 1) {
                const lowerRole = roles[0].toLowerCase();
                const validRoles = ["regular", "cashier", "manager", "superuser"];
                if (!validRoles.includes(lowerRole)) {
                    return res.status(400).json({"error": "Bad Request"});
                }
                conditions.role = {equals: lowerRole};
            } else {
                conditions.role = {in: roles};
            }
        }
        if (verified) {
            if (verified === 'true' || verified === 'false') {
                const ver = (verified === 'true')
                conditions.verified = {equals: ver};
            } else {
                return res.status(400).json({"error": "Bad Request"});
            }
        }
        
        if (activated) {
            if (activated === 'true') {
                conditions.lastLogin = {not: null};
            } else if (activated === 'false') {
                conditions.lastLogin = null;
            }
        }
    
        const total = await prisma.user.count({
            where: conditions
        });
        const users = await prisma.user.findMany({
            where: conditions,
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: {
                id: orderBy
            }
        });
        const response = users.map(user => {
            return {
                id: user.id,
                utorid: user.utorid,
                name: user.name,
                email: user.email,
                birthday: user.birthday.toISOString().split('T')[0],
                role: user.role,
                points: user.points,
                createdAt: user.createdAt.toISOString(),
                lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
                verified: user.verified,
                avatarUrl: user.avatarUrl,
                suspicious: user.suspicious
            };
        });
    
        return res.status(200).json({
            count: total,
            results: response
        });
    } catch (error) {
        console.error("Error", error);
    }
});

router.patch('/me', auth.login, upload.single('avatar'), async (req, res) => {
    try {
        const {name, email, birthday} = req.body;
        const user = req.user;
    
        if (!user) {
            return res.status(401).json({"error": "Unauthorized"});
        }
    
        const update = {};
        if (name) {
            if (typeof name !== 'string' || name.length < 1 || name.length > 50) {
                return res.status(400).json({"error": "Bad Request"});
            }
            update.name = name;
        }
        if (email) {
            if (typeof email !== 'string' || !email.endsWith("@mail.utoronto.ca")) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const existing = await prisma.user.findFirst({
                where: {
                        email,
                        NOT: { id: user.id}
                }
            });
            if (existing) {
                return res.status(409).json({"error": "Conflict"});
            }
            update.email = email;
        }
        if (birthday) {
            if (typeof birthday !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const date = birthday.split('-');
            const month = parseInt(date[1], 10);
            const day = parseInt(date[2], 10);
            const short_months = [4, 6, 9, 11];
            if (month < 1 || month > 12 || day < 1 || day > 31 || (month === 2 && day > 29) || (short_months.includes(month) && day > 30)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const bday = new Date(birthday)
            if (isNaN(bday.getTime())) {
                return res.status(400).json({"error": "Bad Request"});
            }
            update.birthday = bday;
        }
        if (req.file) {
            update.avatarUrl = '/uploads/' + req.file.originalname;
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const updateUser = await prisma.user.update({
            where: {id: req.user.id},
            data: update
        });
    
        return res.status(200).json({
            id: updateUser.id,
            utorid: updateUser.utorid,
            name: updateUser.name,
            email: updateUser.email,
            birthday: updateUser.birthday.toISOString().split('T')[0],
            role: updateUser.role,
            points: updateUser.points,
            createdAt: updateUser.createdAt.toISOString(),
            lastLogin: updateUser.lastLogin ? updateUser.lastLogin.toISOString() : null,
            verified: updateUser.verified,
            avatarUrl: updateUser.avatarUrl,
        });
    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/me', auth.login, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
            include: {
                promotions: {},
                attended: {},
            }
        });
    
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
        const attended = user.attended.map(event => {
            return {
                id: event.id,
            }
        });
        const promotions = user.promotions.map(promotion => {
            return {
                id: promotion.id,
                name: promotion.name,
                minSpending: promotion.minSpend,
                rate: promotion.rate,
                points: promotion.points
            }
        })
    
        return res.status(200).json({
            id: user.id,
            utorid: user.utorid,
            name: user.name,
            email: user.email,
            birthday: user.birthday.toISOString().split('T')[0],
            role: user.role,
            points: user.points,
            createdAt: user.createdAt.toISOString(),
            lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
            verified: user.verified,
            avatarUrl: user.avatarUrl,
            promotions: promotions,
            attended: attended
        });
    } catch (error) {
        console.error("Error", error);
    }
});

router.patch('/me/password', auth.login, async (req, res) => {
    try {
        const {old, new: newPass} = req.body;
        const user = req.user;
    
        if (old === undefined || typeof old !== 'string') {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (old !== user.password) {
            return res.status(403).json({"error": "Forbidden"});
        }
        if (!newPass || newPass === undefined || typeof newPass !== 'string' || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(newPass)) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const updateUser = await prisma.user.update({
            where: {id: user.id},
            data: {password: newPass}
        });
        return res.status(200).json({user: updateUser.utorid + "'s password was updated."});
    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/me/transactions', auth.login, async (req, res) => {
    try {
        const {type, relatedId, promotionId, amount, operator, page = 1, limit = 10, orderBy="asc"} = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const conditions = {
            OR: [
                {senderId: req.user.id},
                {receiverId: req.user.id},
                {processorId: req.user.id},
                {creatorId: req.user.id}
            ]
        };

        if (type) {
            const types = ["purchase", "adjustment", "transfer", "redemption", "event"];
            if (!types.includes(type)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.transactionType = type;
        }
        if (relatedId) {
            if (!type) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const id = parseInt(relatedId, 10);
            if (isNaN(id)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.relatedId = id;
        }
        if (promotionId) {
            const promoId = parseInt(promotionId, 10);
            if (isNaN(promoId)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.promotions = {
                some: {id: promoId}
            };
        }
        if (amount) {
            if (!operator || (operator !== "gte" && operator !== "lte")) {
                return res.status(400).json({"error": "Bad Request"}); 
            }
            const points = parseInt(amount, 10);
            if (isNaN(points)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (operator === "gte") {
                conditions.points = {gte: points};
            }
            else if (operator === "lte") {
                conditions.points = {lte: points};
            }
            else {
                return res.status(400).json({"error": "Bad Request"});
            }
        }
        
        const total = await prisma.transaction.count({
            where: conditions
        });
        const transactions = await prisma.transaction.findMany({
            where: conditions,
            include: {
                sender: {},
                receiver: {},
                processor: {},
                createdBy: {},
                promotions: {}
            },
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: {
                id: orderBy
            }
        });
        const response = transactions.map(transaction => {
            const promotions = transaction.promotions.map(promo => promo.id);
            if (transaction.transactionType === "purchase") {
                return {
                    id: transaction.id,
                    type: transaction.transactionType,
                    spent: transaction.amount,
                    amount: transaction.points,
                    promotionIds: promotions,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
            else if (transaction.transactionType === "adjustment") {
                return {
                    id: transaction.id,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    relatedId: transaction.relatedId,
                    promotionIds: promotions,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
            else if (transaction.transactionType === "redemption") {
                return {
                    id: transaction.id,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    relatedId: transaction.relatedId,
                    promotionIds: promotions,
                    redeemed: transaction.points,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
            else if (transaction.transactionType === "transfer") {
                return {
                    id: transaction.id,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    relatedId: transaction.relatedId,
                    sender: transaction.sender.utorid,
                    recipient: transaction.receiver.utorid,
                    promotionIds: promotions,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
            else {
                return {
                    id: transaction.id,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    relatedId: transaction.relatedId,
                    promotionIds: promotions,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
        });
    
        return res.status(200).json({
            count: total,
            results: response
        });
    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/:userId', auth.login, auth.checkRole('cashier'), async (req, res) => {
    try {
        const id = parseInt(req.params.userId, 10);
        if (isNaN(id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const user = await prisma.user.findUnique({
            where: {id: id},
            include: {
                promotions: {}
            }
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
    
        const promotions = user.promotions.map(promotion => {
            return {
                id: promotion.id,
                name: promotion.name,
                minSpending: promotion.minSpend,
                rate: promotion.rate,
                points: promotion.points
            }
        })
    
        if (req.user.role === 'cashier') {
            return res.status(200).json({
                id: user.id,
                utorid: user.utorid,
                name: user.name,
                points: user.points,
                verified: user.verified,
                promotions: promotions
            });
        }
        else {
            return res.status(200).json({
                id: user.id,
                utorid: user.utorid,
                name: user.name,
                email: user.email,
                birthday: user.birthday,
                role: user.role,
                points: user.points,
                createdAt: user.createdAt.toISOString(),
                lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
                verified: user.verified,
                suspicious: user.sus,
                avatarUrl: user.avatarUrl,
                promotions: promotions
            });
        }
    } catch (error) {
        console.error("Error", error);
    }
});

router.patch('/:userId', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const id = parseInt(req.params.userId, 10);
        if (isNaN(id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const {email, verified, suspicious: sus, role} = req.body;
        if (!email && (verified === undefined || verified === null) && (sus === undefined || sus === null) && !role) {
            return res.status(400).json({"error": "Bad Request"});
        }

        if ((verified && typeof verified !== "boolean") || verified === false) {
            return res.status(400).json({"error": "Bad Request"});
        }

        if (sus && typeof sus !== "boolean") {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const user = await prisma.user.findUnique({
            where: {id: id}
        });
    
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
    
        const update = {};
        if (email) {
            if (typeof email !== 'string' || !email.endsWith("@mail.utoronto.ca")) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const existing = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: {id}
                }
            });
            if (existing) {
                return res.status(409).json({"error": "Conflict"});
            }
            update.email = email;
        }
        if (verified) {
            update.verified = verified;
        }
        if (sus || sus === false) {
            update.sus = sus;
        }
        if (role) {
            const lowerRole = role.toLowerCase();
            const roles = ["regular", "cashier", "manager", "superuser"];
            if (!roles.includes(lowerRole)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (roles.indexOf(req.user.role) <= roles.indexOf(lowerRole)) {
                return res.status(403).json({"error": "Forbidden"});
            }
            update.role = lowerRole;
        }
    
        const updateUser = await prisma.user.update({
            where: {id},
            data: update
        });
    
        const result = {
            id: updateUser.id,
            utorid: updateUser.utorid,
            name: updateUser.name
        }
    
        if (email) {
            result.email = updateUser.email;
        }
        if (verified || verified === false) {
            result.verified = updateUser.verified;
        }
        if (sus || sus === false) {
            result.suspicious = updateUser.sus;
        }
        if (role) {
            result.role = updateUser.role;
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error", error);
    }
});

router.post('/me/transactions', auth.login, async (req, res) => {
    try {
        const {type, amount, remark} = req.body;
        if (!type || typeof type !== "string" || type !== "redemption") {
            return res.status(400).json({"error": "Bad Request"});
        }
        const points = amount ? parseInt(amount, 10) : 0;
        if (amount && (isNaN(points) || points < 0 || points > req.user.points)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (!req.user.verified) {
            return res.status(403).json({"error": "Forbidden"});
        }

        const transaction = await prisma.transaction.create({
            data: {
                transactionType: type,
                points,
                remark: remark || "",
                sender: {
                    connect: {id: req.user.id}
                },
                createdBy: {
                    connect: {id: req.user.id}
                }
            }
        });

        return res.status(201).json({
            id: transaction.id,
            utorid: req.user.utorid,
            type: type,
            processedBy: null,
            amount: points,
            remark: transaction.remark,
            createdBy: req.user.utorid
        })
    } catch (error) {
        console.error('Error', error);
    }
});

router.post('/:userId/transactions', auth.login, async (req, res) => {
    try {
        const {type, amount, remark} = req.body;
        const id = parseInt(req.params.userId, 10);
        if (isNaN(id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const points = parseInt(amount, 10);
        if (!type || typeof type !== "string" || type !== "transfer" || !amount || isNaN(points) || points < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const recipient = await prisma.user.findUnique({
            where: {id}
        });
        if (!recipient) {
            return res.status(404).json({"error": "Not Found"});
        }

        if (req.user.points < points) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (!req.user.verified) {
            return res.status(403).json({"error": "Forbidden"});
        }

        const result = await prisma.$transaction(async (prisma) => {
            const senderTransaction = await prisma.transaction.create({
                data: {
                    transactionType: type,
                    points: -points,
                    remark: remark || "",
                    relatedId: recipient.id,
                    sender: {
                        connect: {id: req.user.id}
                    },
                    receiver: {
                        connect: {id: recipient.id}
                    },
                    createdBy: {
                        connect: {id: req.user.id}
                    }
                }
            });
            const receiverTransaction = await prisma.transaction.create({
                data: {
                    transactionType: type,
                    points,
                    remark: remark || "",
                    relatedId: req.user.id,
                    sender: {
                        connect: {id: req.user.id}
                    },
                    receiver: {
                        connect: {id: recipient.id}
                    },
                    createdBy: {
                        connect: {id: req.user.id}
                    }
                }
            });
            const sender = await prisma.user.update({
                where: {id: req.user.id},
                data: {
                    points: {decrement: points}
                }
            });
            const receiver = await prisma.user.update({
                where: {id: recipient.id},
                data: {
                    points: {increment: points}
                }
            });

            return {senderTransaction, receiverTransaction, sender, receiver};
        });

        return res.status(201).json({
            id: result.senderTransaction.id,
            sender: req.user.utorid,
            recipient: recipient.utorid,
            type: type,
            sent: points,
            remark: result.senderTransaction.remark,
            createdBy: req.user.utorid
        });
    } catch (error) {
        console.errror('Error', error);
    }
});

module.exports = router;