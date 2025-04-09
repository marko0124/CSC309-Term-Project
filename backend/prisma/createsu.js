'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSU() {
    const utorid = "clive123";
    const email = "clive123@mail.utoronto.ca";
    const password = "!Clive123";

    if (!utorid || !email || !password) {
        console.error("All fields required.");
        process.exit(1);
    }

    try {
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

    } catch (error) {
        // console.log(error);
        return;
    }

}

createSU();