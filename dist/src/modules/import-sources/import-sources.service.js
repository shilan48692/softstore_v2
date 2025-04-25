"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportSourcesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ImportSourcesService = class ImportSourcesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createImportSourceDto) {
        try {
            return await this.prisma.importSource.create({
                data: createImportSourceDto,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.NotFoundException('Import source with this name already exists.');
            }
            throw error;
        }
    }
    async findAll() {
        return this.prisma.importSource.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findOne(id) {
        const source = await this.prisma.importSource.findUnique({
            where: { id },
        });
        if (!source) {
            throw new common_1.NotFoundException(`Import source with ID ${id} not found`);
        }
        return source;
    }
    async update(id, updateImportSourceDto) {
        try {
            return await this.prisma.importSource.update({
                where: { id },
                data: updateImportSourceDto,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Import source with ID ${id} not found`);
                }
                else if (error.code === 'P2002') {
                    throw new common_1.NotFoundException('Import source with this name already exists.');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        const keysCount = await this.prisma.key.count({
            where: { importSourceId: id },
        });
        if (keysCount > 0) {
            throw new common_1.NotFoundException(`Cannot delete import source with ID ${id} because it is associated with ${keysCount} key(s).`);
        }
        try {
            await this.prisma.importSource.delete({
                where: { id },
            });
            return { message: `Import source with ID ${id} deleted successfully.` };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException(`Import source with ID ${id} not found`);
            }
            throw error;
        }
    }
    async search(findImportSourcesDto) {
        const { name, page = 1, limit = 10, } = findImportSourcesDto;
        const pageInt = parseInt(String(page), 10) || 1;
        const limitInt = parseInt(String(limit), 10) || 10;
        const take = limitInt > 0 ? limitInt : 10;
        const skip = (pageInt > 0 ? pageInt - 1 : 0) * take;
        const whereClause = {};
        if (name) {
            whereClause.name = {
                contains: name,
                mode: 'insensitive',
            };
        }
        const [sources, total] = await Promise.all([
            this.prisma.importSource.findMany({
                where: whereClause,
                skip: skip,
                take: take,
                orderBy: {
                    name: 'asc',
                },
            }),
            this.prisma.importSource.count({ where: whereClause }),
        ]);
        return {
            data: sources,
            meta: {
                total,
                page: pageInt,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }
};
exports.ImportSourcesService = ImportSourcesService;
exports.ImportSourcesService = ImportSourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportSourcesService);
//# sourceMappingURL=import-sources.service.js.map