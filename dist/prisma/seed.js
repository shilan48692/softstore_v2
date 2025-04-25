"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function generateSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}
async function main() {
    console.log('Start seeding categories...');
    const categoriesToSeed = [
        { name: 'Phần mềm bản quyền' },
        { name: 'Game Key & Nạp Game' },
        { name: 'VPN & Bảo mật' },
    ];
    for (const catData of categoriesToSeed) {
        const slug = generateSlug(catData.name);
        await prisma.category.upsert({
            where: { slug: slug },
            update: { name: catData.name },
            create: {
                name: catData.name,
                slug: slug,
            },
        });
        console.log(`Upserted category: ${catData.name} (slug: ${slug})`);
    }
    console.log('Seeding categories finished.');
    console.log('Start seeding products...');
    const products = [
        {
            name: 'Windows 11 Pro',
            slug: 'windows-11-pro',
            description: 'Windows 11 Pro - Phiên bản chuyên nghiệp với nhiều tính năng nâng cao',
            shortDescription: 'Hệ điều hành Windows 11 Pro chính hãng từ Microsoft',
            importPrice: 1000000,
            originalPrice: 1500000,
            quantity: 100,
            gameCode: 'WIN11PRO',
            analyticsCode: 'WIN11PRO_ANALYTICS',
            tags: ['windows', 'operating-system', 'microsoft'],
            secondaryKeywords: ['win11', 'windows 11', 'os'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
        {
            name: 'Microsoft Office 2021',
            slug: 'microsoft-office-2021',
            description: 'Bộ ứng dụng văn phòng Microsoft Office 2021 đầy đủ',
            shortDescription: 'Office 2021 với Word, Excel, PowerPoint và nhiều ứng dụng khác',
            importPrice: 800000,
            originalPrice: 1200000,
            quantity: 50,
            gameCode: 'OFFICE2021',
            analyticsCode: 'OFFICE2021_ANALYTICS',
            tags: ['office', 'microsoft', 'productivity'],
            secondaryKeywords: ['ms office', 'word', 'excel'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
        {
            name: 'Adobe Photoshop 2024',
            slug: 'adobe-photoshop-2024',
            description: 'Phần mềm chỉnh sửa ảnh chuyên nghiệp Adobe Photoshop 2024',
            shortDescription: 'Photoshop 2024 với các công cụ AI mới nhất',
            importPrice: 2000000,
            originalPrice: 3000000,
            quantity: 30,
            gameCode: 'PS2024',
            analyticsCode: 'PS2024_ANALYTICS',
            tags: ['adobe', 'photoshop', 'design'],
            secondaryKeywords: ['photo editor', 'design software'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
        {
            name: 'Visual Studio 2022',
            slug: 'visual-studio-2022',
            description: 'Môi trường phát triển tích hợp Visual Studio 2022',
            shortDescription: 'IDE chuyên nghiệp cho lập trình viên',
            importPrice: 1500000,
            originalPrice: 2000000,
            quantity: 40,
            gameCode: 'VS2022',
            analyticsCode: 'VS2022_ANALYTICS',
            tags: ['development', 'ide', 'microsoft'],
            secondaryKeywords: ['visual studio', 'programming'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
        {
            name: 'Steam Wallet Code',
            slug: 'steam-wallet-code',
            description: 'Thẻ nạp tiền Steam chính hãng',
            shortDescription: 'Nạp tiền vào tài khoản Steam',
            importPrice: 200000,
            originalPrice: 250000,
            quantity: 200,
            gameCode: 'STEAM50',
            analyticsCode: 'STEAM50_ANALYTICS',
            tags: ['steam', 'gaming', 'wallet'],
            secondaryKeywords: ['steam card', 'steam credit'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'game-key-nap-game' } }))?.id || null,
        },
        {
            name: 'Netflix Premium',
            slug: 'netflix-premium',
            description: 'Tài khoản Netflix Premium 4K',
            shortDescription: 'Xem phim chất lượng 4K không giới hạn',
            importPrice: 300000,
            originalPrice: 400000,
            quantity: 100,
            gameCode: 'NETFLIX4K',
            analyticsCode: 'NETFLIX4K_ANALYTICS',
            tags: ['netflix', 'streaming', 'entertainment'],
            secondaryKeywords: ['netflix account', 'streaming service'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
        {
            name: 'Spotify Premium',
            slug: 'spotify-premium',
            description: 'Tài khoản Spotify Premium không quảng cáo',
            shortDescription: 'Nghe nhạc không giới hạn và không quảng cáo',
            importPrice: 250000,
            originalPrice: 350000,
            quantity: 150,
            gameCode: 'SPOTIFY',
            analyticsCode: 'SPOTIFY_ANALYTICS',
            tags: ['spotify', 'music', 'streaming'],
            secondaryKeywords: ['spotify account', 'music service'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
        {
            name: 'NordVPN Premium',
            slug: 'nordvpn-premium',
            description: 'Tài khoản NordVPN Premium bảo mật cao',
            shortDescription: 'VPN tốc độ cao với nhiều server',
            importPrice: 200000,
            originalPrice: 300000,
            quantity: 80,
            gameCode: 'NORDVPN',
            analyticsCode: 'NORDVPN_ANALYTICS',
            tags: ['vpn', 'security', 'privacy'],
            secondaryKeywords: ['nord vpn', 'virtual private network'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'vpn-bao-mat' } }))?.id || null,
        },
        {
            name: 'Adobe Creative Cloud',
            slug: 'adobe-creative-cloud',
            description: 'Gói Adobe Creative Cloud đầy đủ',
            shortDescription: 'Tất cả ứng dụng Adobe với Creative Cloud',
            importPrice: 3000000,
            originalPrice: 4000000,
            quantity: 20,
            gameCode: 'ADOBECC',
            analyticsCode: 'ADOBECC_ANALYTICS',
            tags: ['adobe', 'creative', 'design'],
            secondaryKeywords: ['creative cloud', 'adobe suite'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
        {
            name: 'Windows Server 2022',
            slug: 'windows-server-2022',
            description: 'Windows Server 2022 Datacenter Edition',
            shortDescription: 'Hệ điều hành server mới nhất từ Microsoft',
            importPrice: 5000000,
            originalPrice: 6000000,
            quantity: 10,
            gameCode: 'WIN2022SERVER',
            analyticsCode: 'WIN2022SERVER_ANALYTICS',
            tags: ['server', 'windows', 'enterprise'],
            secondaryKeywords: ['windows server', 'datacenter'],
            categoryId: (await prisma.category.findUnique({ where: { slug: 'phan-mem-ban-quyen' } }))?.id || null,
        },
    ];
    for (const productData of products) {
        const categoryId = productData.categoryId;
        await prisma.product.upsert({
            where: { gameCode: productData.gameCode },
            update: { ...productData, categoryId },
            create: { ...productData, categoryId },
        });
        console.log(`Upserted product: ${productData.name}`);
    }
    console.log('Seeding products finished.');
    console.log('Start seeding import sources...');
    const importSourcesToSeed = [];
    const numberOfSources = 20;
    for (let i = 1; i <= numberOfSources; i++) {
        importSourcesToSeed.push({
            name: `Nguồn nhập ${String(i).padStart(2, '0')}`,
        });
    }
    for (const sourceData of importSourcesToSeed) {
        await prisma.importSource.upsert({
            where: { name: sourceData.name },
            update: {},
            create: {
                name: sourceData.name,
                contactLink: sourceData.contactLink
            },
        });
        console.log(`Upserted import source: ${sourceData.name}`);
    }
    console.log(`Seeding import sources finished. Total: ${numberOfSources}`);
    console.log('Start seeding related products for Windows Server 2022...');
    try {
        const serverProduct = await prisma.product.findUnique({
            where: { gameCode: 'WIN2022SERVER' },
            select: { id: true }
        });
        const win11Product = await prisma.product.findUnique({
            where: { gameCode: 'WIN11PRO' },
            select: { id: true }
        });
        const vs2022Product = await prisma.product.findUnique({
            where: { gameCode: 'VS2022' },
            select: { id: true }
        });
        if (serverProduct && win11Product && vs2022Product) {
            await prisma.product.update({
                where: { id: serverProduct.id },
                data: {
                    Product_A: {
                        connect: [
                            { id: win11Product.id },
                            { id: vs2022Product.id },
                        ],
                    },
                },
            });
            console.log('Successfully linked WIN11PRO and VS2022 as related products to WIN2022SERVER.');
        }
        else {
            console.warn('Could not find all necessary products (WIN2022SERVER, WIN11PRO, VS2022) to seed related products.');
        }
    }
    catch (error) {
        console.error('Error seeding related products:', error);
    }
    console.log('Seeding related products finished.');
    console.log('Start seeding keys...');
    try {
        const win11Pro = await prisma.product.findUnique({ where: { gameCode: 'WIN11PRO' } });
        const office2021 = await prisma.product.findUnique({ where: { gameCode: 'OFFICE2021' } });
        const vs2022 = await prisma.product.findUnique({ where: { gameCode: 'VS2022' } });
        const winServer2022 = await prisma.product.findUnique({ where: { gameCode: 'WIN2022SERVER' } });
        if (!win11Pro || !office2021 || !vs2022 || !winServer2022) {
            console.error('One or more target products for key seeding not found. Skipping key seeding.');
        }
        else {
            const productsForKeySeed = [win11Pro, office2021, vs2022, winServer2022];
            const totalKeysToSeed = 30;
            let seededKeysCount = 0;
            for (let i = 1; i <= totalKeysToSeed; i++) {
                const productIndex = (i - 1) % productsForKeySeed.length;
                const product = productsForKeySeed[productIndex];
                const activationCode = `SEED-KEY-${product.gameCode}-${String(i).padStart(3, '0')}`;
                const existingKey = await prisma.key.findFirst({
                    where: { activationCode: activationCode }
                });
                if (!existingKey) {
                    await prisma.key.create({
                        data: {
                            activationCode: activationCode,
                            productId: product.id,
                            status: 'AVAILABLE',
                            cost: product.importPrice ? Math.round(product.importPrice * 0.8) : 0,
                            note: 'Seeded Key',
                        },
                    });
                    seededKeysCount++;
                }
                else {
                }
            }
            console.log(`Seeded ${seededKeysCount} new keys successfully.`);
        }
    }
    catch (error) {
        console.error('Error seeding keys:', error);
    }
    console.log('Seeding keys finished.');
    console.log('Start seeding admins...');
    await prisma.admin.upsert({
        where: { email: 'tienlm@divine.vn' },
        update: {},
        create: {
            email: 'tienlm@divine.vn',
            name: 'Tien LM',
            role: client_1.AdminRole.SUPER_ADMIN,
        },
    });
    await prisma.admin.upsert({
        where: { email: 'shilan4869@gmail.com' },
        update: {},
        create: {
            email: 'shilan4869@gmail.com',
            name: 'Shilan',
            role: client_1.AdminRole.SUPER_ADMIN,
        },
    });
    console.log('Seeding admins finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map