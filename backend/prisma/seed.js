'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database.");
  try {
    const users = await createUsers();
    const events = await createEvents();
    const promos = await createPromos();
    const transactions = await createTransactions();
    console.log("Done.");
    return { users, events, promos, transactions };
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function createUsers() {
    const users = [
        {
            utorid: "clive123",
            email: "clive.su@mail.utoronto.ca",
            name: "Clive Su",
            password: "!Clive123",
            verified: true,
            role: "superuser",
            birthday: new Date(2003, 1, 12),
            points: 2000,
            lastLogin: new Date()
        },
        {
            utorid: "johnd123",
            email: "john.doe@mail.utoronto.ca",
            name: "John Doe",
            password: "!John123",
            verified: true,
            role: "manager",
            birthday: new Date(2000, 7, 14),
            points: 1000,
            lastLogin: new Date()
        },
        {
            utorid: "janed123",
            email: "jane.doe@mail.utoronto.ca",
            name: "Jane Doe",
            password: "!Jane123",
            verified: true,
            role: "cashier",
            birthday: new Date(2004, 11, 13),
            points: 700,
            lastLogin: new Date()
        },
        {
            utorid: "sasuk123",
            email: "sasuke.uchiha@mail.utoronto.ca",
            name: "Sasuke Uchiha",
            password: "!Sasuke123",
            verified: true,
            role: "cashier",
            birthday: new Date(2000, 11, 10),
            points: 900,
            sus: true,
            lastLogin: new Date()
        },
        {
            utorid: "conan123",
            email: "conan.edogawa@mail.utoronto.ca",
            name: "Conan Edogawa",
            password: "!Conan123",
            verified: true,
            role: "regular",
            birthday: new Date(1990, 2, 4),
            points: 3000,
            lastLogin: new Date()
        },
        {
            utorid: "sungj123",
            email: "sung.jinwoo@mail.utoronto.ca",
            name: "Sung Jinwoo",
            password: "!Sung123",
            verified: true,
            role: "regular",
            birthday: new Date(2002, 7, 14),
            points: 500,
            lastLogin: new Date()
        },
        {
            utorid: "yujii123",
            email: "yuji.itadori@mail.utoronto.ca",
            name: "Yuji Itadori",
            password: "!Yuji123",
            verified: true,
            role: "regular",
            birthday: new Date(2001, 9, 26),
            points: 1300,
            lastLogin: new Date()
        },
        {
            utorid: "nezuk123",
            email: "nezuko.kamado@mail.utoronto.ca",
            name: "Nezuko Kamado",
            password: "!Nezuko123",
            verified: true,
            role: "regular",
            birthday: new Date(2006, 10, 12),
            points: 900
        },
        {
            utorid: "kenta123",
            email: "ken.takakura@mail.utoronto.ca",
            name: "Ken Takakura",
            password: "!KenT123",
            verified: false,
            role: "regular",
            birthday: new Date(2002, 7, 14),
            points: 1500
        },
        {
            utorid: "killua12",
            email: "killua.zoldyck@mail.utoronto.ca",
            name: "Killua Zoldyck",
            password: "!Killua123",
            verified: false,
            role: "regular",
            birthday: new Date(2006, 8, 20),
            points: 500
        },
    ];
    const created = [];
    for (const user of users) {
      created.push(await prisma.user.upsert({
        where: { email: user.email }, 
        update: { ...user }, 
        create: { ...user },
      }));
    }
    console.log("Seeded users");
    return created;
  }

async function createEvents() {
    const events = [
        {
            name: "Event 1",
            description: "Description",
            location: "Place",
            start: new Date(2025, 4, 30, 12, 0),
            end: new Date(2025, 4, 30, 22, 0),
            points: 5000,
            pointsRemain: 5000,
            pointsAwarded: 0,
            published: true,
            creatorId: 1
        },
        {
            name: "Event 2",
            description: "Description",
            location: "Place",
            start: new Date(2025, 4, 30, 12, 0),
            end: new Date(2025, 4, 30, 22, 0),
            points: 500,
            capacity: 100,
            pointsRemain: 400,
            pointsAwarded: 100,
            published: true,
            creatorId: 2
        },
        {
            name: "Event 3",
            description: "Description",
            location: "Place",
            start: new Date(2025, 4, 30, 12, 0),
            end: new Date(2025, 4, 30, 22, 0),
            points: 2000,
            pointsRemain: 2000,
            pointsAwarded: 0,
            published: false,
            creatorId: 1
        },
        {
            name: "Event 4",
            description: "Description",
            location: "Place",
            start: new Date(2025, 4, 30, 12, 0),
            end: new Date(2025, 4, 30, 22, 0),
            capacity: 5,
            points: 250,
            pointsRemain: 0,
            pointsAwarded: 250,
            full: true,
            published: true,
            creatorId: 1
        },
        {
            name: "Event 5",
            description: "Description",
            location: "Place",
            start: new Date(2025, 4, 30, 12, 0),
            end: new Date(2025, 4, 30, 22, 0),
            points: 2500,
            pointsRemain: 2500,
            pointsAwarded: 0,
            published: false,
            creatorId: 2
        }
    ];
    const created = [];
    const user1 = await prisma.user.findUnique({
        where: {utorid: "sungj123"}
    });
    const user2 = await prisma.user.findUnique({
        where: {utorid: "yujii123"}
    });
    const user3 = await prisma.user.findUnique({
        where: {utorid: "nezuk123"}
    });
    const user4 = await prisma.user.findUnique({
        where: {utorid: "janed123"}
    })
    const user5 = await prisma.user.findUnique({
        where: {utorid: "sasuk123"}
    });
    for (let i = 0; i < events.length; i++) {
        const existingEvent = await prisma.event.findFirst({ where: { name: events[i].name } });
        if (!existingEvent) {
          if (i === 0) {
            created.push(await prisma.event.create({
              data: {
                ...events[i],
                organizers: { connect: { id: user1.id } }
              }
            }));
          } else if (i === 1) {
            created.push(await prisma.event.create({
              data: {
                ...events[i],
                organizers: { connect: { id: user1.id } },
                guests: { connect: { id: user2.id } }
              }
            }));
          } else if (i === 3) {
            created.push(await prisma.event.create({
              data: {
                ...events[i],
                guests: {
                  connect: [
                    { id: user1.id }, { id: user2.id }, { id: user3.id },
                    { id: user4.id }, { id: user5.id }
                  ]
                }
              }
            }));
          } else {
            created.push(await prisma.event.create({
              data: events[i]
            }));
          }
        }
      }
      console.log("Seeded events");
      return created;
    }

    async function createPromos() {
        const promos = [
            {
                name: "Promo 1",
                description: "Automatic extra rate",
                type: "automatic",
                rate: 1.25,
                start: new Date(2025, 3, 30),
                end: new Date(2025, 4, 30),
                minSpend: 1.00
            },
            {
                name: "Promo 2",
                description: "Automatic extra points",
                type: "automatic",
                points: 25,
                start: new Date(2025, 3, 30),
                end: new Date(2025, 4, 30),
                minSpend: 5.00
            },
            {
                name: "Promo 3",
                description: "One-Time extra rate",
                type: "one-time",
                rate: 1.5,
                start: new Date(2025, 3, 30),
                end: new Date(2025, 4, 30),
                minSpend: 3.00
            },
            {
                name: "Promo 4",
                description: "One-Time extra points",
                type: "one-time",
                points: 50,
                start: new Date(2025, 3, 30),
                end: new Date(2025, 4, 30),
                minSpend: 10.00
            },
            {
                name: "Promo 5",
                description: "Extra points no min spend",
                type: "automatic",
                points: 25,
                start: new Date(2025, 0, 27),
                end: new Date(2025, 4, 30)
            },
            {
                name: "Promo 6",
                description: "Regular User Viewable",
                type: "automatic",
                points: 25,
                start: new Date(2025, 0, 27),
                end: new Date(2025, 4, 30)
            },
            {
                name: "Promo 7",
                description: "For Pagination",
                type: "automatic",
                points: 25,
                start: new Date(2025, 0, 30),
                end: new Date(2025, 4, 30)
            },
            {
                name: "Promo 8",
                description: "Extra points no min spend",
                type: "automatic",
                points: 25,
                start: new Date(2024, 0, 30),
                end: new Date(2024, 11, 30)
            }
        ];

    const created = [];
    const user = await prisma.user.findUnique({ where: { utorid: "conan123" } });
    for (let i = 0; i < promos.length; i++) {
      const existingPromo = await prisma.promotion.findFirst({ where: { name: promos[i].name } });
      if (!existingPromo) {
        if (i === 2 || i === 3) {
          created.push(await prisma.promotion.create({
            data: {
              ...promos[i],
              users: { connect: { id: user.id } }
            }
          }));
        } else {
          created.push(await prisma.promotion.create({
            data: promos[i]
          }));
        }
      }
    }
    console.log("Seeded promos");
    return created;
  }

async function createTransactions() {
    const superuser = await prisma.user.findUnique({
        where: {utorid: "clive123"}
    });
    const manager = await prisma.user.findUnique({
        where: {utorid: "johnd123"}
    });
    const cashier = await prisma.user.findUnique({
        where: {utorid: "janed123"}
    });
    const sus = await prisma.user.findUnique({
        where: {utorid: "sasuk123"}
    });
    const sender = await prisma.user.findUnique({
        where: {utorid: "conan123"}
    });
    const sender2 = await prisma.user.findUnique({
        where: {utorid: "yujii123"}
    });
    const sender3 = await prisma.user.findUnique({
        where: {utorid: "nezuk123"}
    });
    const receiver = await prisma.user.findUnique({
        where: {utorid: "sungj123"}
    });
    const promo1 = await prisma.promotion.findFirst({
        where: {name: "Promo 1"}
    });
    const promo2 = await prisma.promotion.findFirst({
        where: {name: "Promo 2"}
    });
    const promo3 = await prisma.promotion.findFirst({
        where: {name: "Promo 3"}
    });
    const promo4 = await prisma.promotion.findFirst({
        where: {name: "Promo 4"}
    });
    const promo5 = await prisma.promotion.findFirst({
        where: {name: "Promo 5"}
    });
    const event2 = await prisma.event.findFirst({
        where: {name: "Event 2"}
    });
    const event4 = await prisma.event.findFirst({
        where: {name: "Event 4"}
    });
    const transactions = [
        {
            transactionType: "purchase",
            amount: 1.50,
            points: 6,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: cashier.id}}
        },
        {
            transactionType: "purchase",
            amount: 5.00,
            points: 20,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: manager.id}}
        },
        {
            transactionType: "purchase",
            amount: 20.00,
            points: 80,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: superuser.id}}
        },
        {
            transactionType: "purchase", // to be adjusted
            amount: 5.00,
            points: 20,
            sender: {connect: {id: sender3.id}},
            createdBy: {connect: {id: cashier.id}}
        },
        {
            transactionType: "purchase", // to be adjusted
            amount: 5.00,
            points: 20,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: cashier.id}}
        },
        {
            transactionType: "purchase", // to be adjusted
            amount: 5.00,
            points: 20,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: cashier.id}}
        },
        {
            transactionType: "purchase",
            amount: 30.00,
            points: 0,
            pointsWitheld: 120,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: sus.id}},
            sus: true,
            needVerify: true,
            verified: false
        },
        {
            transactionType: "purchase",
            amount: 20.00,
            points: 0,
            pointsWitheld: 80,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: sus.id}},
            sus: true,
            needVerify: true,
            verified: false
        },
        {
            transactionType: "purchase", // Promo 1
            amount: 20.00,
            points: 2580,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: superuser.id}},
            promotions: {connect: {id: promo1.id}}
        },
        {
            transactionType: "purchase", // Promo 2
            amount: 20.00,
            points: 105,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: superuser.id}},
            promotions: {connect: {id: promo2.id}}
        },
        {
            transactionType: "purchase", // Promo 3
            amount: 3.00,
            points: 462,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: superuser.id}},
            promotions: {connect: {id: promo3.id}}
        },
        {
            transactionType: "purchase", // Promo 4
            amount: 10.00,
            points: 90,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: superuser.id}},
            promotions: {connect: {id: promo4.id}}
        },
        {
            transactionType: "purchase", // Promo 5
            amount: 10.00,
            points: 65,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: superuser.id}},
            promotions: {connect: {id: promo5.id}}
        },
        {
            transactionType: "transfer",
            points: -10,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: sender.id}},
            receiver: {connect: {id: receiver.id}},
            relatedId: receiver.id
        },
        {
            transactionType: "transfer",
            points: 10,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: sender.id}},
            receiver: {connect: {id: receiver.id}},
            relatedId: sender.id
        },
        {
            transactionType: "transfer",
            points: -30,
            sender: {connect: {id: manager.id}},
            createdBy: {connect: {id: manager.id}},
            receiver: {connect: {id: cashier.id}},
            relatedId: cashier.id
        },
        {
            transactionType: "transfer",
            points: 30,
            sender: {connect: {id: manager.id}},
            createdBy: {connect: {id: manager.id}},
            receiver: {connect: {id: cashier.id}},
            relatedId: manager.id
        },
        {
            transactionType: "redemption",
            points: 100,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: sender.id}},
            processor: {connect: {id: superuser.id}}
        },
        {
            transactionType: "redemption",
            points: 80,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: sender2.id}},
            processor: {connect: {id: manager.id}}
        },
        {
            transactionType: "redemption",
            points: 150,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: sender.id}}
        },
        {
            transactionType: "redemption",
            points: 125,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: sender2.id}}
        },
        {
            transactionType: "event",
            points: 50,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: superuser.id}},
            event: {connect: {id: event2.id}},
            relatedId: event2.id
        },
        {
            transactionType: "event",
            points: 50,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: receiver.id}},
            event: {connect: {id: event2.id}},
            relatedId: event2.id
        },
        {
            transactionType: "event",
            points: 50,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: manager.id}},
            event: {connect: {id: event4.id}},
            relatedId: event4.id
        },
        {
            transactionType: "event",
            points: 50,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: manager.id}},
            event: {connect: {id: event4.id}},
            relatedId: event4.id
        },
        {
            transactionType: "event",
            points: 50,
            sender: {connect: {id: sender3.id}},
            createdBy: {connect: {id: manager.id}},
            event: {connect: {id: event4.id}},
            relatedId: event4.id
        },
        {
            transactionType: "event",
            points: 50,
            sender: {connect: {id: cashier.id}},
            createdBy: {connect: {id: manager.id}},
            event: {connect: {id: event4.id}},
            relatedId: event4.id
        },
        {
            transactionType: "event",
            points: 50,
            sender: {connect: {id: sus.id}},
            createdBy: {connect: {id: manager.id}},
            event: {connect: {id: event4.id}},
            relatedId: event4.id
        },
    ];
    
    const created = [];
    for (const transaction of transactions) {
      const existing = await prisma.transaction.findFirst({
        where: {
          transactionType: transaction.transactionType,
          sender: { id: transaction.sender.connect.id },
          createdBy: { id: transaction.createdBy.connect.id },
          points: transaction.points
        }
      });
      if (!existing) {
        created.push(await prisma.transaction.create({ data: transaction }));
      }
    }

    const adjustments = [
        {
            transactionType: "adjustment",
            points: -10,
            relatedId: created[3].id,
            sender: {connect: {id: sender3.id}},
            createdBy: {connect: {id: superuser.id}}
        },
        {
            transactionType: "adjustment",
            points: -10,
            relatedId: created[4].id,
            sender: {connect: {id: sender.id}},
            createdBy: {connect: {id: manager.id}}
        },
        {
            transactionType: "adjustment",
            points: -10,
            relatedId: created[5].id,
            sender: {connect: {id: sender2.id}},
            createdBy: {connect: {id: superuser.id}}
        },
    ];

    for (const adjustment of adjustments) {
        if (adjustment.relatedId) { // Ensure relatedId exists
          const existing = await prisma.transaction.findFirst({
            where: { relatedId: adjustment.relatedId, transactionType: "adjustment" }
          });
          if (!existing) {
            created.push(await prisma.transaction.create({ data: adjustment }));
          }
        }
      }
      console.log("Seeded transactions");
      return created;
}
    
    seed();
