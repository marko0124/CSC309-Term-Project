'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSU() {
    if (process.argv.length !== 5) {
        console.error("Expected utorid, email, and password.");
        process.exit(1);
    }

    const utorid = process.argv[2];
    const email = process.argv[3];
    const password = process.argv[4];

    if (!utorid || !email || !password) {
        console.error("All fields required.");
        process.exit(1);
    }

    const user = await prisma.user.create({
        data: {
            utorid,
            email,
            name: "Clive Su",
            password,
            verified: true,
            role: "superuser"
        }
    });

    return user;
}

createSU();