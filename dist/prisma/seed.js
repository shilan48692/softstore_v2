"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
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
            categoryId: null,
        },
    ];
    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }
    await prisma.admin.upsert({
        where: { email: 'tienlm@divine.vn' },
        update: {},
        create: {
            email: 'tienlm@divine.vn',
            role: client_1.AdminRole.SUPER_ADMIN,
            name: 'Tien LM'
        }
    });
    await prisma.admin.upsert({
        where: { email: 'shilan4869@gmail.com' },
        update: {},
        create: {
            email: 'shilan4869@gmail.com',
            role: client_1.AdminRole.SUPER_ADMIN,
            name: 'Shilan'
        }
    });
    console.log('Đã thêm 10 sản phẩm mẫu thành công!');
    console.log('Added admin users successfully');
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