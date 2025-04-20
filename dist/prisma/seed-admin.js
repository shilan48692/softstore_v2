"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=seed-admin.js.map