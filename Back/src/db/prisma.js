// Client Prisma partagé pour toute l'application.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Pool de connexions PostgreSQL basé sur DATABASE_URL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Adaptateur Prisma pour PostgreSQL.
const adapter = new PrismaPg(pool);

// Instance Prisma unique.
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
