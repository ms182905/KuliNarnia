import { makeAutoObservable, runInAction } from 'mobx';
import { Recipe } from '../models/recipe';
import agent from '../api/agent';
import { store } from './store';

export default class UserRecipesStore {
    userRecipeRegistry = new Map<string, Recipe>();
    loading = false;
    loadingInitial = false;
    userRecipesLoaded = false;
    userRecipesNumber = 0;
    pageCapacity = 7;
    recipeDashboardPageNumber = 0;

    constructor() {
        makeAutoObservable(this);
    }

    get userRecipes() {
        return Array.from(this.userRecipeRegistry.values());
    }

    loadUserRecipes = async (pageNumber: number) => {
        this.setUserRecipesLoaded(false);
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.UserRecipes.list(
                pageNumber * this.pageCapacity,
                pageNumber * this.pageCapacity + this.pageCapacity
            );
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

    handlePageChange = async () => {
        this.userRecipeRegistry.clear();
        this.setUserRecipesLoaded(false);
    };

    private setUserRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.userRecipeRegistry.set(recipe.id, recipe);
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setUserRecipesLoaded = (state: boolean) => {
        this.userRecipesLoaded = state;
    };

    setUserRecipesNumber = (recipesNumber: number) => {
        this.userRecipesNumber = recipesNumber;
    };

    deleteRecipe = async (id: string) => {
        this.setLoading(true);
        this.setUserRecipesNumber(this.userRecipesNumber - 1);
        try {
            await agent.Recipes.delete(id);
            this.resetUserRecipesRegistry();
            store.favouriteRecipesStore.reset();
            store.recipeStore.reset();
            this.setLoading(false);
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    };

    reset = () => {
        this.userRecipeRegistry.clear();
        this.userRecipesLoaded = false;
    };

    resetUserRecipesRegistry = () => {
        runInAction(() => {
            this.userRecipeRegistry.clear();
        });
        this.setUserRecipesLoaded(false);
    };
}
