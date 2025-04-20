import { PrismaService } from '../../prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllForAdmin(): Promise<{
        id: string;
        name: string;
    }[]>;
}
