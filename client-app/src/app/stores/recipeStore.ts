import { makeAutoObservable, runInAction } from 'mobx';
import { Recipe } from '../models/recipe';
import agent from '../api/agent';
import { RecipeComment } from '../models/comment';
import { UserSelection } from '../models/userSelection';
import { store } from './store';
import { Ingredient } from '../models/ingredient';
import { Instruction } from '../models/instruction';

export default class RecipeStore {
    recipeRegistry = new Map<string, Recipe>();
    selectedRecipe: Recipe | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    recipesNumber = 0;
    pageCapacity = 7;
    recipeDashboardPageNumber = 1;
    selectedCategory = '';
    selectedTags: string[] = [];
    searchQuery = '';

    constructor() {
        makeAutoObservable(this);
    }

    get recipes() {
        return Array.from(this.recipeRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
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

    loadRecipes = async (pageNumber: number) => {
        this.setLoadingInitial(true);
        try {
            console.log(this.selectedCategory);
            const recipes = await agent.Recipes.list(
                (pageNumber - 1) * this.pageCapacity,
                (pageNumber - 1) * this.pageCapacity + this.pageCapacity,
                this.selectedCategory,
                encodeURIComponent(this.selectedTags.join(' ')),
                encodeURIComponent(this.searchQuery)
            );
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

    handlePageChange = async (pageNumber: number) => {
        this.recipeRegistry.clear();
        this.recipeDashboardPageNumber = pageNumber;
    };

    loadRecipe = async (id: string) => {
        this.setLoadingInitial(true);
        try {
            var recipe = await agent.Recipes.details(id);
            const tagIds: string[] = [];
            recipe.instructions.sort((a, b) => a.position - b.position);
            this.setRecipe(recipe);
            runInAction(async () => {
                if (recipe !== undefined) {
                    recipe!.tags.forEach((tag) => {
                        tagIds.push(tag.id);
                    });
                }

                store.recommendedRecipesStore.resetRecommendedRecipesRegistry();

                recipe!.tagIds = tagIds;
                this.selectedRecipe = recipe;
                if (recipe.creatorName && recipe.creatorName !== store.userStore.user?.displayName) {
                    const userSelection: UserSelection = { categoryId: recipe.categoryId, tagIds: recipe.tagIds };
                    await agent.UserSelection.post(userSelection);
                }
            });

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

    addRecipeIngredient = (recipeIngredient: Ingredient) => {
        this.selectedRecipe?.ingredients?.push(recipeIngredient);
    };

    addRecipeInstruction = (recipeInstruction: Instruction) => {
        this.selectedRecipe?.instructions?.push(recipeInstruction);
    };

    updateRecipeData = (recipe: Recipe) => {
        if (this.selectedRecipe) {
            this.selectedRecipe.tagIds = recipe.tagIds;
            this.selectedRecipe.categoryId = recipe.categoryId;
            this.selectedRecipe.title = recipe.title;
            this.selectedRecipe.description = recipe.description;
        } else {
            this.selectedRecipe = recipe;
        }
    };

    resetSelectedRecipe = () => {
        this.selectedRecipe = undefined;
    }

    deleteRecipeIngredient = (id: string) => {
        if (this.selectedRecipe && this.selectedRecipe.ingredients) {
            this.selectedRecipe.ingredients = this.selectedRecipe.ingredients.filter(
                (ingredient) => ingredient.id !== id
            );
        }
    };

    deleteRecipeInstruction = (id: string) => {
        if (this.selectedRecipe && this.selectedRecipe.instructions) {
            this.selectedRecipe.instructions = this.selectedRecipe.instructions.filter(
                (instruction) => instruction.id !== id
            );
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

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };

    setRecipesNumber = (recipesNumber: number) => {
        this.recipesNumber = recipesNumber;
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

    setFilters = (category: string, tags: string[]) => {
        this.selectedCategory = category;
        this.selectedTags = tags;
    };

    resetFilters = () => {
        this.selectedCategory = '';
        this.selectedTags = [];
    };

    setSearchQuerry = (querry: string) => {
        runInAction(() => {
            this.searchQuery = querry;
        });
    };

    resetSearchQuerry = () => {
        runInAction(() => {
            this.searchQuery = '';
        });
    };

    reset = () => {
        runInAction(() => {
            this.recipeDashboardPageNumber = 1;
            this.recipeRegistry.clear();
            this.recipesNumber = 0;
        });
    };
}
