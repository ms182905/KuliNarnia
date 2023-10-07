import { makeAutoObservable, runInAction } from "mobx";
import { Recipe } from "../models/recipe";
import agent from "../api/agent";
import { RecipeComment } from "../models/comment";

export default class RecipeStore {
    recipeRegistry = new Map<string, Recipe>();
    favouriteRecipeRegistry = new Map<string, Recipe>();
    selectedRecipe: Recipe | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get recipes() {
        return Array.from(this.recipeRegistry.values()).sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    get favouriteRecipes() {
        return Array.from(this.favouriteRecipeRegistry.values());
    }

    get groupedRecipes() {
        return Object.entries(
            this.recipes.reduce((_recipes, recipe) => {
                const date = recipe.date;
                _recipes[date] = _recipes[date] ? [..._recipes[date], recipe] : [recipe];
                return _recipes;
            }, {} as {[key: string]: Recipe[]})
        )
    }

    loadRecipes = async () => {
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.Recipes.list();
            recipes.forEach( recipe => {
                this.setRecipe(recipe);
                });
                this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadFavouriteRecipes = async () => {
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.FavouriteRecipes.list();
            recipes.forEach( recipe => {
                this.setFavouriteRecipe(recipe);
                });
                this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadRecipe = async (id: string) => {
        this.setLoadingInitial(true);
        try {
            var recipe = await agent.Recipes.details(id);
            const tagIds: string[] = [];
            this.setRecipe(recipe);
            runInAction(() => {
                
                if (recipe !== undefined)
                {
                    recipe!.tags.forEach(tag => {
                        tagIds.push(tag.id);
                    });
                }
                    
                recipe!.tagIds = tagIds;
                this.selectedRecipe = recipe;
            });
            console.log("------------" + recipe)
            this.setLoadingInitial(false);
            return recipe;
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    addRecipeComment = async (recipeComment: RecipeComment) => {
        try {
            runInAction(() => {
                this.selectedRecipe?.comments?.push(recipeComment);
            });
            await agent.Comments.create(recipeComment);
        } catch (error) {
            console.log(error);
        }
    }

    deleteRecipeComment = async (recipeCommentId: string) => {
        try {
            runInAction(() => {
                if (this.selectedRecipe?.comments === undefined) return;
                var filteredComments = this.selectedRecipe?.comments?.filter(r => r.id !== recipeCommentId);
                this.selectedRecipe.comments = filteredComments;
            });
            await agent.Comments.delete(recipeCommentId);
        } catch (error) {
            console.log(error);
        }
    }

    private setRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.recipeRegistry.set(recipe.id, recipe);
    }

    private setFavouriteRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.favouriteRecipeRegistry.set(recipe.id, recipe);
    }

    private getRecipe = (id: string) => {
        return this.recipeRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    setLoading = (state: boolean) => {
        this.loading = state;
    }

    createRecipe = async (recipe: Recipe) => {
        this.setLoading(true);

        try {
            const date = new Date();
            recipe.date = date.toISOString().split('T')[0];
            await agent.Recipes.create(recipe);
            runInAction(() => {
                this.recipeRegistry.set(recipe.id, recipe);
                this.selectedRecipe = recipe;
                this.editMode = false;
                this.loading = false;
            });
            this.loading = false;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.editMode = false;
                this.loading = false;
            });
        }
    }

    updateRecipe = async (recipe: Recipe) => {
        this.setLoading(true);

        try {
            await agent.Recipes.update(recipe);
            runInAction(() => {
                this.recipeRegistry.set(recipe.id, recipe);
                this.selectedRecipe = recipe;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.editMode = false;
                this.loading = false;
            });
        }
    }

    deleteRecipe = async (id: string) => {
        this.setLoading(true);

        try {
            await agent.Recipes.delete(id);
            runInAction(() => {
                this.recipeRegistry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    removeRecipeFromFavourites = async (id: string) => {
        this.setLoading(true);
        try {
            runInAction(() => {
                this.favouriteRecipeRegistry.delete(id);
                this.loading = false;
            });
            await agent.FavouriteRecipes.removeFromFavourites(id);
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}