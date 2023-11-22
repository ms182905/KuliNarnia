export interface RecipeComment {
    id: string;
    text: string;
    date: string;
    appUserDisplayName: string;
    appUserPhotoUrl?: string;
    recipeId: string;
}
