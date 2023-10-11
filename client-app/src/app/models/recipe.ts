import { RecipeComment } from './comment';
import { Ingredient } from './ingredient';
import { Instruction } from './instruction';
import { Tag } from './tag';

export interface Recipe {
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
    tagIds?: string[];
    comments: RecipeComment[];
    instructions: Instruction[];
}
