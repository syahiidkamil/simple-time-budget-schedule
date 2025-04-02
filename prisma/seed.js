const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create initial access code if none exists
  const existingCode = await prisma.accessCode.findFirst();
  
  if (!existingCode) {
    await prisma.accessCode.create({
      data: {
        code: "INITIAL" // This will be concatenated with the env variable
      }
    });
    console.log('Created initial access code');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });