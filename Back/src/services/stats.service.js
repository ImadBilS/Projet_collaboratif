const { prisma } = require("../db/prisma");

const popularCategories = await prisma.resource.groupBy({
  by: ['category'],       // même si category est un String
  _count: { category: true },
  orderBy: {
    _count: { category: 'desc' }
  }
});
