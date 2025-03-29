const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = {
    async login(req, res, next) {
        try {
            const authHeader = req.header('Authorization');
            if (!authHeader) {
                return res.status(401).json({"error": "Unauthorized"});
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({"error": "Unauthorized"});
            }
            const decoded = jwt.verify(token, 'your-secret-key');
            const user = await prisma.user.findUnique({
                where: { id: parseInt(decoded.id, 10)},
            });

            if (!user) {
                return res.status(404).json({"error": "Not Found"});
            }
            req.user = user;

            req.role = user.role;

            next();
        } catch (error) {
            return res.status(401).json({"error": "Unauthorized"});
        }
    },
    checkRole(role) {
        return async (req, res, next) => {
            const authHeader = req.header('Authorization');
            if (!authHeader) {
                return res.status(401).json({"error": "Unauthorized"});
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'your-secret-key');
            const user = await prisma.user.findUnique({
                where: { id: parseInt(decoded.id, 10)},
            });

            if (!user) {
                return res.status(404).json({"error": "Not Found"});
            }

            if (decoded.role !== user.role) {
                return res.status(400).json({"error": "Bad Request"});
            }

            const lowerRole = role.toLowerCase();
            const roles = ["regular", "cashier", "manager", "superuser"];
            if (!roles.includes(lowerRole)) {
                return res.status(400).json({"error": "Bad Request"});
            }
    
            if (roles.indexOf(lowerRole) > roles.indexOf(user.role)) {
                return res.status(403).json({"error": "Forbidden"});
            }
    
            next();
        }
    }
};

module.exports = auth;