const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.siteSettings.findFirst()
    .then(console.log)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
