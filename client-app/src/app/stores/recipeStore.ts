import { makeAutoObservable, runInAction } from 'mobx';
import { Recipe } from '../models/recipe';
import agent from '../api/agent';
import { RecipeComment } from '../models/comment';
import { Dashboard } from '../common/options/dashboards';

export default class RecipeStore {
    recipeRegistry = new Map<string, Recipe>();
    favouriteRecipeRegistry = new Map<string, Recipe>();
    userRecipeRegistry = new Map<string, Recipe>();
    selectedRecipe: Recipe | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    favouriteRecipesLoaded = false;
    userRecipesLoaded = false;
    recipesNumber = 0;
    favouriteRecipesNumber = 0;
    userRecipesNumber = 0;
    pageCapacity = 8;
    recipeDashboardPageNumber = 0;

    //TODO: separate logic for favouriteRecipesStore, userRecipesStore

    constructor() {
        makeAutoObservable(this);
    }

    get recipes() {
        return Array.from(this.recipeRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    get favouriteRecipes() {
        return Array.from(this.favouriteRecipeRegistry.values());
    }

    get userRecipes() {
        return Array.from(this.userRecipeRegistry.values());
    }

    get groupedRecipes() {
        return Object.entries(
            this.recipes.reduce((_recipes, recipe) => {
                const date = recipe.date;
                _recipes[date] = _recipes[date] ? [..._recipes[date], recipe] : [recipe];
                return _recipes;
            }, {} as { [key: string]: Recipe[] })
        );
    }

    isInFavourites = (recipeId: string) => {
        return this.favouriteRecipeRegistry.has(recipeId);
    };

    loadRecipes = async (pageNumber: number) => {
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.Recipes.list(
                pageNumber * this.pageCapacity, 
                pageNumber * this.pageCapacity + this.pageCapacity - 1);
            recipes.recipes.forEach((recipe) => {
                this.setRecipe(recipe);
            });
            this.setRecipesNumber(recipes.count);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    loadUserRecipes = async () => {
        this.setUserRecipesLoaded(false);
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.Recipes.listByUser();
            recipes.recipes.forEach((recipe) => {
                this.setUserRecipe(recipe);
            });
            this.setUserRecipesNumber(recipes.count);
            this.setUserRecipesLoaded(true);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setUserRecipesLoaded(true);
            this.setLoadingInitial(false);
        }
    };

    loadFavouriteRecipes = async () => {
        this.setFavouriteRecipesLoaded(false);
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.FavouriteRecipes.list();
            recipes.recipes.forEach((recipe) => {
                this.setFavouriteRecipe(recipe);
            });
            this.setFavouriteRecipesNumber(recipes.count);
            this.setFavouriteRecipesLoaded(true);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setFavouriteRecipesLoaded(true);
            this.setLoadingInitial(false);
        }
    };

    handlePageChange = async (dashboardType: Dashboard, pageNumber: number) => {
        switch (dashboardType) {
            case Dashboard.RecipeDashboard: {
                this.recipeRegistry.clear();
                this.recipeDashboardPageNumber = pageNumber;
                break;
            }
            case Dashboard.FavouriteRecipesDashboard: {
                this.favouriteRecipeRegistry.clear();
                this.setFavouriteRecipesLoaded(false);
                break;
            }
            case Dashboard.UserRecipesDashboard: {
                this.userRecipeRegistry.clear();
                this.setUserRecipesLoaded(false);
                break;
            }
        }
    }

    loadRecipe = async (id: string) => {
        this.setLoadingInitial(true);
        try {
            var recipe = await agent.Recipes.details(id);
            const tagIds: string[] = [];
            this.setRecipe(recipe);
            runInAction(() => {
                if (recipe !== undefined) {
                    recipe!.tags.forEach((tag) => {
                        tagIds.push(tag.id);
                    });
                }

                recipe!.tagIds = tagIds;
                this.selectedRecipe = recipe;
            });
            console.log('------------' + recipe);
            this.setLoadingInitial(false);
            return recipe;
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    addRecipeComment = async (recipeComment: RecipeComment) => {
        try {
            runInAction(() => {
                this.selectedRecipe?.comments?.push(recipeComment);
            });
            await agent.Comments.create(recipeComment);
        } catch (error) {
            console.log(error);
        }
    };

    deleteRecipeComment = async (recipeCommentId: string) => {
        try {
            runInAction(() => {
                if (this.selectedRecipe?.comments === undefined) return;
                var filteredComments = this.selectedRecipe?.comments?.filter((r) => r.id !== recipeCommentId);
                this.selectedRecipe.comments = filteredComments;
            });
            await agent.Comments.delete(recipeCommentId);
        } catch (error) {
            console.log(error);
        }
    };

    private setRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.recipeRegistry.set(recipe.id, recipe);
    };

    private setFavouriteRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.favouriteRecipeRegistry.set(recipe.id, recipe);
    };

    private setUserRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.userRecipeRegistry.set(recipe.id, recipe);
    };

    private getRecipe = (id: string) => {
        return this.recipeRegistry.get(id);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };

    setFavouriteRecipesLoaded = (state: boolean) => {
        this.favouriteRecipesLoaded = state;
    };

    setUserRecipesLoaded = (state: boolean) => {
        this.userRecipesLoaded = state;
    };

    setRecipesNumber = (recipesNumber: number) => {
        this.recipesNumber = recipesNumber;
    };

    setFavouriteRecipesNumber = (recipesNumber: number) => {
        this.favouriteRecipesNumber = recipesNumber;
    };

    setUserRecipesNumber = (recipesNumber: number) => {
        this.userRecipesNumber = recipesNumber;
    };

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
            this.setRecipesNumber(this.recipesNumber + 1);
            this.loading = false;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.editMode = false;
                this.loading = false;
            });
        }
    };

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
    };

    deleteRecipe = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Recipes.delete(id);
            runInAction(() => {
                this.recipeRegistry.delete(id);
                this.loading = false;
            });
            this.setRecipesNumber(this.recipesNumber - 1);
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    removeRecipeFromFavourites = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.FavouriteRecipes.removeFromFavourites(id);
            runInAction(() => {
                this.selectedRecipe!.inFavourites = false;
                this.loading = false;
            });
            this.resetFavouriteRecipesRegistry();
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    addRecipeToFavourites = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.FavouriteRecipes.addToFavourites(id);
            runInAction(() => {
                this.selectedRecipe!.inFavourites = true;
                this.setLoading(false);
            });
            this.resetFavouriteRecipesRegistry();
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    };

    reset = () => {
        this.recipeRegistry.clear();
        this.favouriteRecipeRegistry.clear();
        this.userRecipeRegistry.clear();
        this.favouriteRecipesLoaded = false;
        this.userRecipesLoaded = false;
    }

    resetFavouritesAndUserRecipesRegistry = () => {
        this.favouriteRecipeRegistry.clear();
        this.userRecipeRegistry.clear();
        this.setFavouriteRecipesLoaded(false);
        this.setUserRecipesLoaded(false);
    }

    resetUserRecipesRegistry = () => {
        this.userRecipeRegistry.clear();
        this.setUserRecipesLoaded(false);
    }

    resetFavouriteRecipesRegistry = () => {
        this.favouriteRecipeRegistry.clear();
        this.setFavouriteRecipesLoaded(false);
    }

}
