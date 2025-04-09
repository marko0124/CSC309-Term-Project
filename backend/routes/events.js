#!/usr/bin/env node
'use strict';

const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.post('/', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const {name, description, location, startTime, endTime, capacity, points} = req.body;
        if (!name || !description || !location || !startTime || !endTime || !points) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (typeof startTime !== "string" || typeof endTime !== "string") {
            return res.status(400).json({"error": "Bad Request"});
        }
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (start >= end) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const pts = parseInt(points, 10);
        if (isNaN(pts) || pts < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        let cap = null;
        if (capacity) {
            cap = parseInt(capacity, 10);
            if (isNaN(cap) || cap < 0) {
                return res.status(400).json({"error": "Bad Request"});
            }
        }
        const event = await prisma.event.create({
            data: {
                name,
                description,
                location,
                start,
                end,
                capacity: cap,
                points: pts,
                pointsRemain: pts,
                creatorId: req.user.id
            }
        });
        
        return res.status(201).json({
            id: event.id,
            name: event.name,
            description: event.description,
            location: event.location,
            startTime: event.start.toISOString(),
            endTime: event.end.toISOString(),
            capacity: event.capacity,
            pointsRemain: event.pointsRemain,
            pointsAwarded: 0,
            published: false,
            organizers: [],
            guests: []
        });

    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/', auth.login, async (req, res) => {
    try {
        const {name, location, started, ended, showFull, published, page=1, limit=10, orderBy="asc"} = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const conditions = {};

        if (name) {
            if (typeof name !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.name = name;
        }
        if (location) {
            if (typeof location !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.location = location;
        }
        const now = new Date();
        if (started) {
            if ((started !== "true" && started !== "false") || ended) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const start = started === "true";
            if (start) {
                conditions.start = {lte: now};
            } else {
                conditions.start = {gt: now};
            }
        }
        if (ended) {
            if ((ended !== "true" && ended !== "false") || started) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const end = ended === "true";
            if (end) {
                conditions.end = {lt: now};
            } else {
                conditions.end = {gte: now};
            }
        }
        if (showFull) {
            if (showFull !== "true" && showFull !== "false") {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (showFull !== "true") {
                conditions.full = false;
            }
        }
        if (req.user.role !== 'manager' && req.user.role !== 'superuser') {
            conditions.OR = [
                {published: true},
                {organizers: {some: {
                    id: req.user.id
                }}}
            ];
        } else if (published) {
            if (published !== "true" && published !== "false") {
                return res.status(400).json({"error": "Bad Request"});
            }
            conditions.published = published === 'true';
        }

        const total = await prisma.event.count({
            where: conditions
        });

        const events = await prisma.event.findMany({
            where: conditions,
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            include: {
                guests: {}
            },
            orderBy: {
                id: orderBy
            }
        });

        const response = events.map(event => {
            if (req.user.role === 'manager' || req.user.role === 'superuser') {
                return {
                    id: event.id,
                    name: event.name,
                    location: event.location,
                    startTime: event.start.toISOString(),
                    endTime: event.end.toISOString(),
                    capacity: event.capacity,
                    pointsRemain: event.pointsRemain,
                    pointsAwarded: event.pointsAwarded,
                    published: event.published,
                    numGuests: event.guests.length
                };
            } else {
                return {
                    id: event.id,
                    name: event.name,
                    location: event.location,
                    startTime: event.start.toISOString(),
                    endTime: event.end.toISOString(),
                    capacity: event.capacity,
                    numGuests: event.guests.length
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

router.post('/:eventId/guests/me', auth.login, async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (!event.published) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (new Date() > event.end) {
            return res.status(410).json({"error": "Gone"});
        }
        if (event.full) {
            return res.status(410).json({"error": "Gone"});
        }
        if (event.guests.some(g => g.id === req.user.id) || event.organizers.some(o => o.id === req.user.id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        let full = false;
        if (event.capacity !== null && event.capacity - 1 === event.guests.length) {
            full = true;
        }
        const updated = await prisma.event.update({
            where: {id},
            data: {
                guests: {
                    connect: {id: req.user.id}
                },
                full
            }
        });

        return res.status(201).json({
            id: updated.id,
            name: updated.name,
            location: updated.location,
            guestAdded: {id: req.user.id, utorid: req.user.utorid, name: req.user.name},
            numGuests: event.guests.length + 1
        });

    } catch (error) {
        console.error("Error", error);
    }
});

router.delete('/:eventId/guests/me', auth.login, async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (new Date() > event.end) {
            return res.status(410).json({"error": "Gone"});
        }
        if (!event.guests.some(g => g.id === req.user.id)) {
            return res.status(404).json({"error": "Not Found"});
        }
        const del = await prisma.event.update({
            where: {id},
            data: {
                guests: {
                    disconnect: {id: req.user.id}
                },
                full: false
            }
        });
        return res.status(204).json({event: del.id + " had a guest removed."});

    } catch (error) {
        console.error("Error", error);
    }
});

router.post('/:eventId/guests', auth.login, async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        const {utorid} = req.body;
        if (!utorid || typeof utorid !== "string") {
            return res.status(400).json({"error": "Bad Request"});
        }
        const user = await prisma.user.findUnique({
            where: {utorid}
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (event.full) {
            return res.status(410).json({"error": "Gone"});
        }

        const hasPerms = req.user.role === "manager" || req.user.role === "superuser";
        const isOrg = event.organizers.some(o => o.id === req.user.id);

        if (!hasPerms && !isOrg) {
            return res.status(403).json({"error": "Forbidden"});
        }
        if (!event.published && !hasPerms) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (new Date() > event.end) {
            return res.status(410).json({"error": "Gone"});
        }
        if (event.guests.some(g => g.id === user.id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (event.organizers.some(o => o.id === user.id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        let full = false;
        if (event.capacity !== null && event.capacity - 1 === event.guests.length) {
            full = true;
        }
        const updated = await prisma.event.update({
            where: {id},
            data: {
                guests: {
                    connect: {id: user.id}
                },
                full
            }
        });

        return res.status(201).json({
            id: updated.id,
            name: updated.name,
            location: updated.location,
            guestAdded: {id: user.id, utorid: user.utorid, name: user.name},
            numGuests: event.guests.length + 1
        });

    } catch (error) {
        console.error("Error", error);
    }
});

router.delete('/:eventId/guests/:userId', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId, 10);
        if (isNaN(eventId) || eventId < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id: eventId},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId) || userId < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const user = await prisma.user.findUnique({
            where: {id: userId},
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (!event.guests.some(g => g.id === user.id)) {
            return res.status(404).json({"error": "Not Found"});
        }
        const del = await prisma.event.update({
            where: {id: eventId},
            data: {
                guests: {
                    disconnect: {id: user.id}
                },
                full: false
            }
        });
        return res.status(204).json({event: del.id + " had a guest removed."});

    } catch (error) {
        console.error("Error", error);
    }
});

router.post('/:eventId/organizers', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const {utorid} = req.body;
        if (!utorid || typeof utorid !== "string") {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (new Date() > event.end) {
            return res.status(410).json({"error": "Gone"});
        }
        const user = await prisma.user.findUnique({
            where: {utorid}
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }

        if (event.organizers.some(o => o.utorid === utorid)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (event.guests.some(g => g.utorid === utorid)) {
            return res.status(400).json({"error": "Bad Request"});
        }

        const updated = await prisma.event.update({
            where: {id},
            data: {
                organizers: {
                    connect: {id: user.id}
                }
            },
            include: {
                organizers: {}
            }
        });
        const organizers = updated.organizers.map(o => ({
            id: o.id,
            utorid: o.utorid,
            name: o.name
        }));
        return res.status(201).json({
            id: updated.id,
            name: updated.name,
            location: updated.location,
            organizers: organizers
        });

    } catch (error) {
        console.error("Error", error);
    }
});

router.delete('/:eventId/organizers/:userId', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId, 10);
        if (isNaN(eventId) || eventId < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id: eventId},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId) || userId < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const user = await prisma.user.findUnique({
            where: {id: userId}
        });
        if (!user) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (!event.organizers.some(o => o.id === user.id)) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const del = await prisma.event.update({
            where: {id: eventId},
            data: {
                organizers: {
                    disconnect: {id: user.id}
                }
            }
        });
        return res.status(204).json({deleted: del.id + " has been deleted."});

    } catch (error) {
        console.error("Error", error);
    }
});

router.post('/:eventId/transactions', auth.login, async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (req.user.role !== "manager" && req.user.role !== "superuser" && !event.organizers.some(o => o.id === req.user.id)) {
            return res.status(403).json({"error": "Forbidden"});
        }
        const {type, utorid, amount} = req.body;
        if (!type || typeof type !== "string" || type !== "event") {
            return res.status(400).json({"error": "Bad Request"});
        }
        let points = parseInt(amount, 10);
        if (!amount || isNaN(points) || points < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (points > event.pointsRemain) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (utorid) {
            if (typeof utorid !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            const user = await prisma.user.findUnique({
                where: {utorid}
            });
            if (!user) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (!event.guests.some(g => g.id === user.id)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const result = await prisma.$transaction(async (prisma) => {
                const transaction = await prisma.transaction.create({
                    data: {
                        transactionType: "event",
                        points,
                        remark: "",
                        relatedId: event.id,
                        sender: {
                            connect: {id: user.id}
                        },
                        createdBy: {
                            connect: {id: req.user.id}
                        },
                        event: {
                            connect: {id: event.id}
                        }
                    }
                });
                const updateUser = await prisma.user.update({
                    where: {id: user.id},
                    data: {
                        points: {increment: points}
                    }
                });
                const updateEvent = await prisma.event.update({
                    where: {id},
                    data: {
                        pointsAwarded: {increment: points},
                        pointsRemain: {decrement: points}
                    }
                });
                return {transaction, updateUser, updateEvent};
            });

            return res.status(201).json({
                id: result.transaction.id,
                recipient: result.updateUser.utorid,
                awarded: result.transaction.points,
                type: "event",
                relatedId: result.transaction.relatedId,
                remark: result.transaction.remark,
                createdBy: req.user.utorid
            });
        } else {
            if (event.guests.length === 0) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const neededPoints = points * event.guests.length;
            if (neededPoints > event.pointsRemain) {
                return res.status(400).json({"error": "Bad Request"});
            }
            const result = await prisma.$transaction(async (prisma) => {
                const transactions = [];
                for (const guest of event.guests) {
                    const transaction = await prisma.transaction.create({
                        data: {
                            transactionType: "event",
                            points,
                            remark: "",
                            relatedId: event.id,
                            sender: {
                                connect: {id: guest.id}
                            },
                            createdBy: {
                                connect: {id: req.user.id}
                            },
                            event: {
                                connect: {id: event.id}
                            }
                        }
                    });
                    const updateUser = await prisma.user.update({
                        where: {id: guest.id},
                        data: {
                            points: {increment: points}
                        }
                    });
                    transactions.push({
                        id: transaction.id,
                        recipient: updateUser.utorid,
                        awarded: transaction.points,
                        type: "event",
                        relatedId: transaction.relatedId,
                        remark: transaction.remark,
                        createdBy: req.user.utorid
                    });
                }
                const updateEvent = await prisma.event.update({
                    where: {id},
                    data: {
                        pointsAwarded: {increment: neededPoints},
                        pointsRemain: {decrement: neededPoints}
                    }
                });

                return {transactions, updateEvent};
            });

            return res.status(201).json(result.transactions);
        }

    } catch (error) {
        console.error("Error", error);
    }
});

router.get('/:eventId', auth.login, async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }

        const organizers = event.organizers.map(o => ({
            id: o.id,
            utorid: o.utorid,
            name: o.name
        }));

        if (req.user.role !== "manager" && req.user.role !== "superuser" && !organizers.some(o => o.id === req.user.id) && !event.published) {
            return res.status(404).json({"error": "Not Found"});
        }

        const guests = event.guests.map(g => ({
            id: g.id,
            utorid: g.utorid,
            name: g.name
        }));

        if (req.user.role === "manager" || req.user.role === "superuser" || organizers.some(o => o.id === req.user.id)) {
            return res.status(200).json({
                id: event.id,
                name: event.name,
                description: event.description,
                location: event.location,
                startTime: event.start,
                endTime: event.end,
                capacity: event.capacity,
                pointsRemain: event.pointsRemain,
                pointsAwarded: event.pointsAwarded,
                published: event.published,
                organizers,
                guests
            });
        } else {
            return res.status(200).json({
                id: event.id,
                name: event.name,
                description: event.description,
                location: event.location,
                startTime: event.start,
                endTime: event.end,
                capacity: event.capacity,
                organizers,
                numGuests: guests.length
            });
        }

    } catch (error) {
        console.error("Error", error);
    }
});

router.patch('/:eventId', auth.login, async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                organizers: {},
                guests: {}
            }
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        const organizers = event.organizers.map(o => ({
            id: o.id,
            utorid: o.utorid,
            name: o.name
        }));

        const {name, description, location, startTime, endTime, capacity, points, published} = req.body;

        const hasPerms = req.user.role === "manager" || req.user.role === "superuser" || organizers.some(o => o.id === req.user.id);
        if (!hasPerms) {
            return res.status(403).json({"error": "Forbidden"});
        }
        const data = {};
        const now = new Date();
        const started = event.start <= now;
        const ended = event.end <= now;

        if (started) {
            if (name || description || location || startTime || capacity) {
                return res.status(400).json({"error": "Bad Request"});
            }
        }
        if (ended && endTime) {
            return res.status(400).json({"error": "Bad Request"});
        }
        if (name) {
            if (typeof name !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.name = name;
        }
        if (description) {
            if (typeof description !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.description = description;
        }
        if (location) {
            if (typeof location !== "string") {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.location = location;
        }
        if (startTime) {
            const start = new Date(startTime);
            if (isNaN(start.getTime()) || start <= now) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (endTime) {
                const end = new Date(endTime);
                if (isNaN(end.getTime()) || start >= end || end <= now) {
                    return res.status(400).json({"error": "Bad Request"});
                }
            } else {
                if (start && event.end && start >= event.end) {
                    return res.status(400).json({"error": "Bad Request"});
                }
            }
            data.start = start;
        }

        if (endTime) {

            const end = new Date(endTime);
            if (isNaN(end.getTime()) || end <= now) {
                return res.status(400).json({"error": "Bad Request"});
            }
            if (startTime) {
                const start = new Date(startTime);
                if (isNaN(start.getTime()) || start >= end || start <= now) {
                    return res.status(400).json({"error": "Bad Request"});
                }
            } else {
                if (end && event.start && event.start >= end) {
                    return res.status(400).json({"error": "Bad Request"});
                }
            }
            data.end = end;
        }

        if (capacity) {
            const cap = parseInt(capacity, 10);
            if (isNaN(cap) || cap < 0 || (event.guests && event.guests.length && cap < event.guests.length)) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.capacity = cap;
            if (event.guests.length === cap) {
                data.full = true;
            }
        }
        if (points) {
            if (req.user.role !== "manager" && req.user.role !== "superuser") {
                return res.status(403).json({"error": "Forbidden"});
            }
            const pts = parseInt(points, 10);
            if (isNaN(pts) || pts < 0 || pts < event.pointsAwarded) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.points = pts;
            data.pointsRemain = pts - event.pointsAwarded;
        }
        if (published || published === false) {
            if (req.user.role !== "manager" && req.user.role !== "superuser") {
                return res.status(403).json({"error": "Forbidden"});
            }
            if (typeof published !== "boolean" || published === false) {
                return res.status(400).json({"error": "Bad Request"});
            }
            data.published = published;
        }
        if (Object.keys(data).length === 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const updated = await prisma.event.update({
            where: {id},
            data: data
        });

        const response = {
            id: updated.id,
            name: updated.name,
            location: updated.location
        };
        if (description) {
            response.description = updated.description;
        }
        if (startTime) {
            response.startTime = updated.start.toISOString();
        }
        if (endTime) {
            response.endTime = updated.end.toISOString();
        }
        if (capacity) {
            response.capacity = updated.capacity;
        }
        if (points) {
            response.points = updated.points;
            response.pointsRemain = updated.pointsRemain;
        }
        if (published) {
            response.published = updated.published;
        }
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error", error);
    }
});

router.delete('/:eventId', auth.login, auth.checkRole('manager'), async (req, res) => {
    try {
        const id = parseInt(req.params.eventId, 10);
        if (isNaN(id) || id < 0) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const event = await prisma.event.findUnique({
            where: {id}
        });
        if (!event) {
            return res.status(404).json({"error": "Not Found"});
        }
        if (event.published) {
            return res.status(400).json({"error": "Bad Request"});
        }
        const del = await prisma.event.delete({
            where: {id}
        });
        return res.status(204).json({deleted: del.id + " has been deleted."});
    } catch (error) {
        console.error("Error", error);
    }
});

module.exports = router;