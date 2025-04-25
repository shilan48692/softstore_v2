import { PrismaService } from '../../prisma/prisma.service';
import { CreateImportSourceDto } from './dto/create-import-source.dto';
import { UpdateImportSourceDto } from './dto/update-import-source.dto';
import { FindImportSourcesDto } from './dto/find-import-sources.dto';
export declare class ImportSourcesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createImportSourceDto: CreateImportSourceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        contactLink: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        contactLink: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        contactLink: string | null;
    }>;
    update(id: string, updateImportSourceDto: UpdateImportSourceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        contactLink: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    search(findImportSourcesDto: FindImportSourcesDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            contactLink: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
