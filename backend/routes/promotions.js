#!/usr/bin/env node
'use strict';

const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.post('/', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const {name, description, type, startTime, endTime, minSpending, rate, points} = req.body;
        if (!name || !description || !type || !startTime || !endTime || typeof name !== "string" || typeof description !== "string" || typeof type !== "string") {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (type !== "automatic" && type !== "one-time") {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (typeof startTime !== "string" || typeof endTime !== "string") {
            return res.status(400).json({"error": "Bad Request"});
        }
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start < now) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (start >= end) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const pts = parseInt(points, 10);
        if (isNaN(pts) || pts < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const data = {
            name,
            description,
            type,
            start,
            end
        }
        if (minSpending) {
            const minSpend = parseFloat(minSpending);
            if (isNaN(minSpend) || minSpend < 0) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.minSpend = minSpend;
        }
        if (rate) {
            const rateNum = parseFloat(rate);
            if (isNaN(rateNum) || rateNum < 0) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.rate = rateNum;
        }
        if (points) {
            const pts = parseInt(points, 10);
            if (isNaN(pts) || pts < 0) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.points = pts;
        }
        if (data.rate === undefined && data.points === undefined) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const promotion = await prisma.promotion.create({
            data: data
        });
        
        return res.status(201).json({
            id: promotion.id,
            name: promotion.name,
            description: promotion.description,
            type: promotion.type,
            startTime: promotion.start.toISOString(),
            endTime: promotion.end.toISOString(),
            minSpending: promotion.minSpend,
            rate: promotion.rate,
            points: promotion.points
        });
    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/', auth.login, async (req, res) => {
    try {
        const {name, type, started, ended, page=1, limit=10, orderBy="asc"} = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const conditions = {};
        const now = new Date();
        if (req.user.role !== "manager" && req.user.role !== "superuser") {
            conditions.start = {lte: now};
            conditions.end = {gt: now};
            conditions.OR = [
                {type: "automatic"},
                {
                    type: "one-time",
                    users: {
                        none: {
                            id: req.user.id
                        }
                    }
                }
            ];
        } else {
            if (started && ended) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (started) {
                const start = started === "true";
                if (start) {
                    conditions.start = {lte: now};
                } else {
                    conditions.start = {gt: now};
                }
            }
            if (ended) {
                const end = ended === "true";
                if (end) {
                    conditions.end = {lt: now};
                } else {
                    conditions.end = {gte: now};
                }
            }
        }
        if (name) {
            if (typeof name !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.name = name;
        }
        if (type) {
            if (typeof type !== "string" || (type !== "automatic" && type !== "one-time")) {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.type = type;
        }

        const total = await prisma.promotion.count({
            where: conditions
        });
        const promotions = await prisma.promotion.findMany({
            where: conditions,
            include: {users: {}},
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: {
                id: orderBy
            }
        });
        const promos = promotions.map(promo => {
            if (req.user.role === "manager" || req.user.role === "superuser") {
                return {
                    id: promo.id,
                    name: promo.name,
                    type: promo.type,
                    startTime: promo.start.toISOString(),
                    endTime: promo.end.toISOString(),
                    minSpending: promo.minSpend,
                    rate: promo.rate,
                    points: promo.points
                };
            } else {
                return {
                    id: promo.id,
                    name: promo.name,
                    type: promo.type,
                    endTime: promo.end.toISOString(),
                    minSpending: promo.minSpend,
                    rate: promo.rate,
                    points: promo.points
                };
            }
        });
        return res.status(200).json({
            count: total,
            results: promos
        });

    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/:promotionId', auth.login, async (req, res) => {
    try {
        const id = parseInt(req.params.promotionId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const promotion = await prisma.promotion.findUnique({
            where: {id},
            include: {
                users: {}
            }
        });
        if (!promotion) {
            return res.status(404).json({"error": "Not Found"});
        }
        const now = new Date();
        const users = promotion.users.map(u => ({
            id: u.id,
            utorid: u.utorid,
            name: u.name
        }));
        if (req.user.role !== "manager" && req.user.role !== "superuser") {
            if (!(promotion.start <= now && promotion.end > now)) {
                return res.status(404).json({"error": "Not Found"});
            }
        }
        if (req.user.role === "manager" || req.user.role === "superuser") {
            return res.status(200).json({
                id: promotion.id,
                name: promotion.name,
                type: promotion.type,
                description: promotion.description,
                startTime: promotion.start.toISOString(),
                endTime: promotion.end.toISOString(),
                minSpending: promotion.minSpend,
                rate: promotion.rate,
                points: promotion.points
            });
        } else {
            return res.status(200).json({
                id: promotion.id,
                name: promotion.name,
                type: promotion.type,
                description: promotion.description,
                endTime: promotion.end.toISOString(),
                minSpending: promotion.minSpend,
                rate: promotion.rate,
                points: promotion.points
            });
        }

    } catch (error) {
        console.error("Error", error);
    }
});

router.patch('/:promotionId', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const id = parseInt(req.params.promotionId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const promotion = await prisma.promotion.findUnique({
            where: {id}
        });
        if (!promotion) {
            return res.status(404).json({"error": "Not Found"});
        }
        const {name, description, type, startTime, endTime, minSpending, rate, points} = req.body;
        const now = new Date();
        const started = promotion.start <= now;
        const data = {};

        if (name) {
            if (started || typeof name !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.name = name;
        }
        if (description) {
            if (started || typeof description !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.description = description;
        }
        if (type) {
            if (started || typeof type !== "string" || (type !== "automatic" && type !== "one-time")) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.type = type;
        }
        if (startTime) {
            if (started || typeof startTime !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            const start = new Date(startTime);
            if (isNaN(start.getTime()) || start < now) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (endTime) {
                const end = new Date(endTime);
                if (isNaN(end.getTime()) || start >= end) {
                    return res.status(400).json({"error": "Bad Request"});
                }
            } else {
                if (start >= promotion.end) {
                    return res.status(400).json({"error": "Bad Request"});
                }
            }
            data.start = start;
        }
        if (endTime) {
            const end = new Date(endTime);
            if (isNaN(end.getTime()) || promotion.end <= now) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const start = startTime ? new Date(startTime) : promotion.start;
            if (start >= end) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.end = end;
        }
        if (minSpending || minSpending === null) {
            if (started) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (minSpending === null) {
                data.minSpend = null;
            } else {
                const minSpend = parseFloat(minSpending);
                if (isNaN(minSpend) || minSpend < 0) {
                    return res.status(400).json({"error": "Bad Request"});
                }
                data.minSpend = minSpend;
            }
        }
        if (rate || rate === null) {
            if (started) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (rate === null) {
                if (points === undefined && promotion.points === null) {
                    return res.status(400).json({"error": "Bad Request"});
                }
                data.rate = null;
            } else {
                const rateNum = parseFloat(rate);
                if (isNaN(rateNum) || rateNum < 0) {
                    return res.status(400).json({"error": "Bad Request"});
                }
                data.rate = rateNum;
            }
        }
        if (points || points === null) {
            if (started) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (points === null) {
                if (rate === undefined && promotion.rate === null) {
                    return res.status(400).json({"error": "Bad Request"});
                }
                data.points = null;
            } else {
                const pts = parseInt(points, 10);
                if (isNaN(pts) || pts < 0) {
                    return res.status(400).json({"error": "Bad Request"});
                }
                data.points = pts;
            }
        }
        if (Object.keys(data).length === 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const updated = await prisma.promotion.update({
            where: {id: promotion.id},
            data: data
        });

        const response = {
            id: updated.id,
            name: updated.name,
            type: updated.type
        }
        if (description) {
            response.description = updated.description;
        }
        if (startTime) {
            response.startTime = updated.start.toISOString();
        }
        if (endTime) {
            response.endTime = updated.end.toISOString();
        }
        if (minSpending || minSpending === null) {
            response.minSpending = updated.minSpend;
        }
        if (rate || rate === null) {
            response.rate = updated.rate;
        }
        if (points || points === null) {
            response.points = updated.points;
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error("Error", error);
    }
});

router.delete('/:promotionId', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const id = parseInt(req.params.promotionId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const promotion = await prisma.promotion.findUnique({
            where: {id}
        });
        if (!promotion) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (promotion.start <= new Date()) {
            return res.status(403).json({"error": "Forbidden"});
        }
        const del = await prisma.promotion.delete({
            where: {id}
        });
        return res.status(204).json({deleted: del.id + " has been deleted."});

    } catch (error) {
        console.error("Error", error);
    }
});

module.exports = router;