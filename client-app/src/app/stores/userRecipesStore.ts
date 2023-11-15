import { makeAutoObservable, runInAction } from 'mobx';
import { Recipe } from '../models/recipe';
import agent from '../api/agent';
import { store } from './store';

export default class UserRecipesStore {
    loggedUserRecipeRegistry = new Map<string, Recipe>();
    anotherUserRecipeRegistry = new Map<string, Recipe>();
    loading = false;
    loadingInitial = false;
    loggedUserRecipesLoaded = false;
    loadingAnotherUserRecipes = false;
    anotherUserUsername = '';
    loggedUserRecipesNumber = 0;
    pageCapacity = 7;
    recipeDashboardPageNumber = 0;

    constructor() {
        makeAutoObservable(this);
    }

    get userRecipes() {
        return Array.from(this.loggedUserRecipeRegistry.values());
    }

    get anotherUserRecipes() {
        return Array.from(this.anotherUserRecipeRegistry.values());
    }

    loadLoggedUserRecipes = async (pageNumber: number) => {
        if (!store.userStore.user?.username) {
            this.setLoggedUserRecipesLoaded(true);
            return;
        }
        this.setLoggedUserRecipesLoaded(false);
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.UserRecipes.list(
                store.userStore.user?.username,
                pageNumber * this.pageCapacity,
                pageNumber * this.pageCapacity + this.pageCapacity
            );
            recipes.recipes.forEach((recipe) => {
                this.setUserRecipe(recipe);
            });
            this.setUserRecipesNumber(recipes.count);
            this.setLoggedUserRecipesLoaded(true);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoggedUserRecipesLoaded(true);
            this.setLoadingInitial(false);
        }
    };

    loadAnotherUserRecipes = async (username: string) => {
        this.setAnotherUserUsername(username);
        this.setLoadingAnotherUserRecipes(true);
        try {
            const recipes = await agent.UserRecipes.list(username, 0, 7);
            runInAction(() => {
                this.anotherUserRecipeRegistry.clear();
            });
            recipes.recipes.forEach((recipe) => {
                this.setAnotherUserRecipe(recipe);
            });
            this.setLoadingAnotherUserRecipes(false);
        } catch (error) {
            console.log(error);
            this.setLoadingAnotherUserRecipes(false);
        }
    };

    handlePageChange = async () => {
        this.loggedUserRecipeRegistry.clear();
        this.setLoggedUserRecipesLoaded(false);
    };

    private setUserRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.loggedUserRecipeRegistry.set(recipe.id, recipe);
    };

    private setAnotherUserRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.anotherUserRecipeRegistry.set(recipe.id, recipe);
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setLoggedUserRecipesLoaded = (state: boolean) => {
        this.loggedUserRecipesLoaded = state;
    };

    setLoadingAnotherUserRecipes = (state: boolean) => {
        this.loadingAnotherUserRecipes = state;
    };

    setAnotherUserUsername = (username: string) => {
        this.anotherUserUsername = username;
    };

    setUserRecipesNumber = (recipesNumber: number) => {
        this.loggedUserRecipesNumber = recipesNumber;
    };

    deleteRecipe = async (id: string) => {
        this.setLoading(true);
        this.setUserRecipesNumber(this.loggedUserRecipesNumber - 1);
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
        this.loggedUserRecipeRegistry.clear();
        this.loggedUserRecipesLoaded = false;
    };

    resetUserRecipesRegistry = () => {
        runInAction(() => {
            this.loggedUserRecipeRegistry.clear();
        });
        this.setLoggedUserRecipesLoaded(false);
    };
}
