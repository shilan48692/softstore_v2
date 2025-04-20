import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admins = await Promise.all([
    prisma.admin.create({
      data: {
        email: 'shilan4869@gmail.com',
        password: hashedPassword,
        name: 'Shilan Admin',
      },
    }),
    prisma.admin.create({
      data: {
        email: 'tienlm@divine.vn',
        password: hashedPassword,
        name: 'Tien Admin',
      },
    }),
  ]);

  console.log('Created admins:', admins);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 