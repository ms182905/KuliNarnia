import { Ingredient } from './ingredient';
import { Instruction } from './instruction';
import { Tag } from './tag';

export interface Recipe {
    // id: string;
    // title: string;
    // date: string;
    // description: string;
    // category: string;

    id: string;
    title: string;
    date: string;
    categoryName?: string;
    categoryId: string;
    description: string;
    creatorName?: string;
    creatorId: string;
    ingredients: Ingredient[];
    tags: Tag[];
    comments?: Comment[];
    instructions: Instruction[];
}
