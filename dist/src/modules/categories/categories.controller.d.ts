import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAllForAdmin(): Promise<{
        id: string;
        name: string;
    }[]>;
}
