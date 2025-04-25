import { ImportSourcesService } from './import-sources.service';
import { CreateImportSourceDto } from './dto/create-import-source.dto';
import { UpdateImportSourceDto } from './dto/update-import-source.dto';
import { FindImportSourcesDto } from './dto/find-import-sources.dto';
export declare class ImportSourcesController {
    private readonly importSourcesService;
    constructor(importSourcesService: ImportSourcesService);
    create(createImportSourceDto: CreateImportSourceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        contactLink: string | null;
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
}
