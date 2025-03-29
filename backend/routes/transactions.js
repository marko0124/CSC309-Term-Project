#!/usr/bin/env node
'use strict';

const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.post('/', auth.login, auth.checkRole('cashier'), async (req, res) => {
    try {
        const {utorid, type, promotionIds = [], remark} = req.body;

        if (!utorid || !type) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const user = await prisma.user.findUnique({
            where: {utorid},
            include: {
                promotions: {}
            }
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
    
        if (type === 'purchase') {
            const {spent} = req.body;
            if (!spent) {
                return res.status(400).json({"error": "Bad Request"});
            }
            let amount = parseFloat(spent);
            if (isNaN(amount) || amount < 0) {
                return res.status(400).json({"error": "Bad Request"});
            }
            let points = Math.floor(parseFloat(spent) / .25);

            let promos = [];
            if (promotionIds && promotionIds.length > 0) {
                const valid = await prisma.promotion.findMany({
                    where: {
                        id: {in: promotionIds.map(id => parseInt(id, 10))},
                        start: {lte: new Date()},
                        end: {gte: new Date()}
                    },
                    include: {
                        users: {}
                    }
                });
                if (valid.length !== promotionIds.length) {
                    return res.status(400).json({"error": "Bad Request"});
                }

                for (const promo of valid) {
                    if (promo.type === "automatic") {
                        if (!promo.minSpend || amount >= promo.minSpend) {
                            if (promo.rate) {
                                points += Math.floor(amount * 100 * promo.rate);
                            }
                            if (promo.points) {
                                points += promo.points;
                            }
                            promos.push(promo.id);
                        } else {
                            return res.status(400).json({"error": "Bad Request"});
                        }
                    } else if (promo.type === "one-time") {
                        if (promo.users.some(u => u.id === user.id)) {
                            return res.status(400).json({"error": "Bad Request"});
                        }
                        if (!promo.minSpend || amount >= promo.minSpend) {
                            if (promo.rate) {
                                points += Math.floor(amount * 100 * promo.rate);
                            }
                            if (promo.points) {
                                points += promo.points;
                            }
                            promos.push(promo.id);
                        } else {
                            return res.status(400).json({"error": "Bad Request"});
                        }
                    }
                }
            }

            const authHeader = req.header('Authorization');
            if (!authHeader) {
                return res.status(401).json({"error": "Unauthorized"});
            }
            const result = await prisma.$transaction(async (prisma) => {
                const sus = req.user.sus;
                const transaction = await prisma.transaction.create({
                    data: {
                        transactionType: type,
                        amount: amount,
                        points: sus ? 0 : points,
                        pointsWitheld: sus ? points : 0,
                        remark: remark || "",
                        sus,
                        verified: !sus,
                        needVerify: sus,
                        sender: {
                            connect: {id: user.id}
                        },
                        createdBy: {
                            connect: {id: req.user.id}
                        },
                        promotions: {
                            connect: promos.map(id => ({id}))
                        },
                        needVerify: sus
                    }
                });
                if (!sus) {
                    const updateUser = await prisma.user.update({
                        where: {utorid},
                        data: {
                            points: user.points + points
                        }
                    });
                }
                if (promos.length > 0) {
                    const oneTime = await prisma.promotion.findMany({
                        where: {
                            id: {in: promos},
                            type: "one-time"
                        }
                    });
                    if (oneTime.length > 0) {
                        const removePromos = await prisma.user.update({
                            where: {id: user.id},
                            data: {
                                promotions: {
                                    connect: oneTime.map(promo => ({id: promo.id}))
                                }
                            }
                        });
                    }
                }
                return {transaction};
            });
    
            return res.status(201).json({
                id: result.transaction.id,
                utorid: user.utorid,
                type: result.transaction.transactionType,
                spent: result.transaction.amount,
                earned: result.transaction.points,
                remark: result.transaction.remark,
                promotionIds: promos,
                createdBy: req.user.utorid
            });
        }
        else if (type === "adjustment") {
            if (req.user.role === 'cashier') {
                return res.status(403).json({"error": "Forbidden"});
            }
            const {amount, relatedId} = req.body;
            if (!amount || !relatedId) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const adjustment = parseInt(amount, 10);
            const related = parseInt(relatedId, 10);
            if (isNaN(adjustment) || isNaN(related)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const transaction = await prisma.transaction.findUnique({
                where: {id: related}
            });
            if (!transaction) {
                return res.status(404).json({"error": "Not Found"});
            }
            let promos = [];
            if (promotionIds && promotionIds.length > 0) {
                const valid = await prisma.promotion.findMany({
                    where: {
                        id: {in: promotionIds.map(id => parseInt(id, 10))},
                        start: {lte: new Date()},
                        end: {gte: new Date()}
                    },
                    include: {
                        users: {where: {id: user.id}}
                    }
                });
                if (valid.length !== promotionIds.length) {
                    return res.status(400).json({"error": "Bad Request"});
                }
                for (const promo of valid) {
                    promos.push(promo.id);
                }
            }
            const result = await prisma.$transaction(async (prisma) => {
                const transaction = await prisma.transaction.create({
                    data: {
                        transactionType: type,
                        points: adjustment,
                        remark: remark || "",
                        relatedId: related,
                        sender: {
                            connect: {id: user.id}
                        },
                        createdBy: {
                            connect: {id: req.user.id}
                        },
                        promotions: {
                            connect: promos.map(id => ({id}))
                        }
                    }
                });
                const updateUser = await prisma.user.update({
                    where: {utorid},
                    data: {
                        points: {
                            increment: adjustment
                        }
                    }
                });
                if (promos.length > 0) {
                    const oneTime = await prisma.promotion.findMany({
                        where: {
                            id: {in: promos},
                            type: "one-time"
                        }
                    });
                    if (oneTime.length > 0) {
                        const removePromos = await prisma.user.update({
                            where: {id: user.id},
                            data: {
                                promotions: {
                                    connect: oneTime.map(promo => ({id: promo.id}))
                                }
                            }
                        });
                    }
                }
                return {transaction, updateUser};
            });
            return res.status(201).json({
                id: result.transaction.id,
                utorid: result.updateUser.utorid,
                amount: result.transaction.points,
                type: result.transaction.transactionType,
                relatedId: transaction.id,
                remark: result.transaction.remark,
                promotionIds: promos,
                createdBy: req.user.utorid
            });
        }
    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const {name, createdBy, suspicious: sus, promotionId, type, relatedId, amount, operator, page=1, limit=10} = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const conditions = {};
    
        if (name) {
            conditions.sender = {
                OR: [
                    {utorid: name},
                    {name: name}
                ]
            }
        }
    
        if (createdBy) {
            conditions.createdBy = {utorid: createdBy}
        }
    
        if (type) {
            const lowerType = type.toLowerCase();
            const types = ["purchase", "adjustment", "transfer", "redemption", "event"];
            if (!types.includes(lowerType)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.transactionType = {equals: lowerType};
        }
    
        if (sus || sus === false) {
            conditions.sus = sus === 'true';
        }
    
        if (promotionId) {
            const id = parseInt(promotionId, 10);
            if (isNaN(id)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.promotions = {some: {id}};
        }
    
        if (relatedId) {
            if (!type) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const id = parseInt(relatedId, 10);
            if (isNaN(id)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.relatedId = {equals: id};
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
        });
        const response = transactions.map(transaction => {
            const promotions = transaction.promotions.map(promo => promo.id);
            if (transaction.transactionType === "purchase") {
                return {
                    id: transaction.id,
                    utorid: transaction.sender.utorid,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    spent: transaction.amount,
                    promotionIds: promotions,
                    suspicious: transaction.sus,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
            else if (transaction.transactionType === "adjustment") {
                return {
                    id: transaction.id,
                    utorid: transaction.sender.utorid,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    relatedId: transaction.relatedId,
                    promotionIds: promotions,
                    suspicious: transaction.sus,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
            else if (transaction.transactionType === "redemption") {
                return {
                    id: transaction.id,
                    utorid: transaction.sender.utorid,
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
                    sender: transaction.sender.utorid,
                    recipient: transaction.receiver.utorid,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    suspicious: transaction.sus,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
            else {
                return {
                    id: transaction.id,
                    utorid: transaction.sender.utorid,
                    amount: transaction.points,
                    type: transaction.transactionType,
                    promotionIds: promotions,
                    suspicious: transaction.sus,
                    remark: transaction.remark,
                    createdBy: transaction.createdBy.utorid
                };
            }
        });
    
        return res.status(200).json({
            count: total,
            results: response
        });
    } catch(error) {
        console.error("Error", error);
    }
});

router.patch('/:transactionId/suspicious', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const id = parseInt(req.params.transactionId, 10);
        if (isNaN(id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const {suspicious: sus} = req.body;
        if (typeof sus !== "boolean") {
            return res.status(400).json({"error": "Bad Request"});
        }

        const isSus = await prisma.transaction.findUnique({
            where: {id},
            include: {
                sender: {},
                receiver: {},
                processor: {},
                createdBy: {},
                promotions: {}
            }
        });
        if (!isSus) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (isSus.sus === sus) {
            return res.status(200).json({
                id: isSus.id,
                utorid: isSus.sender.utorid,
                amount: isSus.points,
                type: isSus.transactionType,
                promotionIds: isSus.promotions.map(promo => promo.id),
                suspicious: isSus.sus,
                remark: isSus.remark,
                createdBy: isSus.createdBy.utorid
            });
        }
        const result = await prisma.$transaction(async (prisma) => {
            const points = await prisma.transaction.findUnique({
                where: {id}
            });
            let awarded = 0;
            let witheld = 0;
            if (sus) {
                witheld += points.points;
            } else {
                awarded += points.pointsWitheld;
            }

            const transaction = await prisma.transaction.update({
                where: {id},
                data: {sus,
                    needVerify: sus,
                    verified: !sus,
                    points: awarded,
                    pointsWitheld: witheld
                },
                include: {
                    sender: {},
                    receiver: {},
                    processor: {},
                    createdBy: {},
                    promotions: {}
                }
            });

            const updateUser = await prisma.user.update({
                where: {utorid: transaction.sender.utorid},
                data: {
                    points: sus ? transaction.sender.points - transaction.pointsWitheld : transaction.sender.points + transaction.points
                }
            });
            return {transaction, updateUser};
        });
    
        if (result.transaction.transactionType === "purchase") {
            return res.status(200).json({
                id: result.transaction.id,
                utorid: result.transaction.sender.utorid,
                amount: result.transaction.points,
                type: result.transaction.transactionType,
                spent: result.transaction.amount,
                promotionIds: result.transaction.promotions.map(promo => promo.id),
                suspicious: result.transaction.sus,
                remark: result.transaction.remark,
                createdBy: result.transaction.createdBy.utorid
            });
        }
        else {
            return res.status(200).json({
                id: result.transaction.id,
                utorid: result.transaction.sender.utorid,
                amount: result.transaction.points,
                type: result.transaction.transactionType,
                promotionIds: result.transaction.promotions.map(promo => promo.id),
                suspicious: result.transaction.sus,
                remark: result.transaction.remark,
                createdBy: result.transaction.createdBy.utorid
            });
        }
    } catch(error) {
        console.error("Error", error);
    }
});

router.get('/:transactionId', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const id = parseInt(req.params.transactionId, 10);
        if (isNaN(id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
    
        const transaction = await prisma.transaction.findUnique({
            where: {id},
            include: {
                sender: {},
                receiver: {},
                createdBy: {},
                promotions: {}
            },
        });
        if (!transaction) {
            return res.status(404).json({"error": "Not Found"});
        }
        const promotions = transaction.promotions.map(promo => promo.id);
        if (transaction.transactionType === "purchase") {
            return res.status(200).json({
                id: transaction.id,
                utorid: transaction.sender.utorid,
                amount: transaction.sus ? transaction.pointsWitheld : transaction.points,
                type: transaction.transactionType,
                spent: transaction.amount,
                promotionIds: promotions,
                suspicious: transaction.sus,
                remark: transaction.remark,
                createdBy: transaction.createdBy.utorid
            });
        }
        else if (transaction.transactionType === "adjustment") {
            return res.status(200).json({
                id: transaction.id,
                utorid: transaction.sender.utorid,
                amount: transaction.points,
                type: transaction.transactionType,
                relatedId: transaction.relatedId,
                promotionIds: promotions,
                suspicious: transaction.sus,
                remark: transaction.remark,
                createdBy: transaction.createdBy.utorid
            });
        }
        else if (transaction.transactionType === "redemption") {
            return res.status(200).json({
                id: transaction.id,
                utorid: transaction.sender.utorid,
                amount: transaction.points,
                type: transaction.transactionType,
                relatedId: transaction.relatedId,
                promotionIds: promotions,
                redeemed: transaction.points,
                remark: transaction.remark,
                createdBy: transaction.createdBy.utorid
            });
        }
        else if (transaction.transactionType === "transfer") {
            return res.status(200).json({
                id: transaction.id,
                sender: transaction.sender.utorid,
                recipient: transaction.receiver.utorid,
                amount: transaction.points,
                type: transaction.transactionType,
                suspicious: transaction.sus,
                remark: transaction.remark,
                createdBy: transaction.createdBy.utorid
            });
        }
        return res.status(200).json({
            id: transaction.id,
            utorid: transaction.sender.utorid,
            amount: transaction.points,
            type: transaction.transactionType,
            promotionIds: promotions,
            suspicious: transaction.sus,
            remark: transaction.remark,
            createdBy: transaction.createdBy.utorid
        });
    } catch(error) {
        console.error("Error", error);
    }
});

router.patch('/:transactionId/processed', auth.login, auth.checkRole('cashier'), async (req, res) => {
    try {
        const id = parseInt(req.params.transactionId, 10);
        if (isNaN(id)) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const {processed} = req.body;
        if (processed !== true) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const transaction = await prisma.transaction.findUnique({
            where: {id},
            include: {
                sender: {}
            }
        });

        if (!transaction) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (transaction.transactionType !== "redemption" || transaction.processorId !== null) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const result = await prisma.$transaction(async (prisma) => {
            const updatedTransaction = await prisma.transaction.update({
                where: {id},
                data: {
                    processor: {
                        connect: {id: req.user.id}
                    }
                },
                include: {
                    sender: {},
                    processor: {},
                    createdBy: {}
                }
            });
            const user = await prisma.user.update({
                where: {id: updatedTransaction.senderId},
                data: {
                    points: {decrement: updatedTransaction.points}
                }
            });
            return {updatedTransaction, user}
        });
        
        return res.status(200).json({
            id: result.updatedTransaction.id,
            utorid: result.user.utorid,
            type: result.updatedTransaction.transactionType,
            processedBy: result.updatedTransaction.processor.utorid,
            redeemed: result.updatedTransaction.points,
            remark: result.updatedTransaction.remark || "",
            createdBy: result.updatedTransaction.createdBy.utorid
        });
    } catch (error) {
        console.error("Error", error);
    }
});

module.exports = router;