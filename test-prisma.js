
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.split('://')[0] : 'undefined');


async function test() {
  console.log('Testing Prisma Client instantiation...');
  try {
    const prisma = new PrismaClient({
      log: ['info'],
    });
    console.log('Client instantiated successfully.');
    await prisma.$connect();
    console.log('Connected successfully.');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Instantiation failed:', e);
    console.log('Error name:', e.name);
    console.log('Error message:', e.message);
  }
}

test();
