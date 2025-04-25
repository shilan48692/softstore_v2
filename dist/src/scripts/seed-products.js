"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Bắt đầu thêm sản phẩm...');
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../temp-product.json'), 'utf-8'));
    try {
        const createdProduct = await prisma.product.create({
            data: {
                name: productsData.name,
                slug: productsData.name.toLowerCase().replace(/\s+/g, '-'),
                description: productsData.description,
                gameCode: productsData.gameCode,
                importPrice: productsData.importPrice,
                originalPrice: productsData.originalPrice,
                quantity: productsData.quantity,
                analyticsCode: productsData.analyticsCode,
                tags: productsData.tags,
                shortDescription: productsData.shortDescription,
                minPerOrder: productsData.minPerOrder,
                maxPerOrder: productsData.maxPerOrder,
            },
        });
        console.log(`Đã thêm sản phẩm: ${createdProduct.name}`);
    }
    catch (error) {
        console.error(`Lỗi khi thêm sản phẩm ${productsData.name}:`, error);
    }
    console.log('Hoàn thành thêm sản phẩm!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-products.js.map