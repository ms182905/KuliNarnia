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
    changingAnotherUserRecipes = false;
    loadingAnotherUserRecipes = false;
    anotherUserUsername = '';
    loggedUserRecipesNumber = 0;
    anotherUserRecipesNumber = 0;
    pageCapacity = 6;
    recipeDashboardPageNumber = 0;
    anotherUserRecipeDashboardPageNumber = 0;
    anotherUserProfilePhotoUrl = '';

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

    loadAnotherUserRecipes = async (username: string, pageNumber: number) => {
        if (username !== this.anotherUserUsername) {
            runInAction(() => {
                this.anotherUserProfilePhotoUrl = '';
            });
        }
        this.setAnotherUserUsername(username);
        if (pageNumber === 0 && username !== this.anotherUserUsername) {
            this.setLoadingAnotherUserRecipes(true);
        }
        this.setChangingAnotherUserRecipes(true);
        try {
            const recipes = await agent.UserRecipes.list(
                username,
                pageNumber * this.pageCapacity,
                pageNumber * this.pageCapacity + this.pageCapacity
            );
            runInAction(() => {
                this.anotherUserRecipeRegistry.clear();
            });
            recipes.recipes.forEach((recipe) => {
                this.setAnotherUserRecipe(recipe);
            });
            this.setAnotherUserRecipesNumber(recipes.count);
            const anotherUserProfilePhotoUrl = await agent.Account.getUserProfilePhotoUrl(username);
            runInAction(() => {
                this.anotherUserProfilePhotoUrl = anotherUserProfilePhotoUrl;
                this.anotherUserRecipeDashboardPageNumber = pageNumber;
            });
            this.setChangingAnotherUserRecipes(false);
            this.setLoadingAnotherUserRecipes(false);
        } catch (error) {
            console.log(error);
            this.setChangingAnotherUserRecipes(false);
            this.setLoadingAnotherUserRecipes(false);
        }
    };

    handlePageChange = async (pageNumber: number) => {
        this.loggedUserRecipeRegistry.clear();
        this.recipeDashboardPageNumber = pageNumber;
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

    handleAnotherUserPageChange = async (pageNumber: number) => {
        this.anotherUserRecipeRegistry.clear();
        await this.loadAnotherUserRecipes(this.anotherUserUsername, pageNumber);
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

    setChangingAnotherUserRecipes = (state: boolean) => {
        this.changingAnotherUserRecipes = state;
    };

    setLoadingAnotherUserRecipes = (state: boolean) => {
        this.loadingAnotherUserRecipes = state;
    };

    setAnotherUserUsername = (username: string) => {
        this.anotherUserUsername = username;
    };

    setAnotherUserProfilePhotoUrl = (url: string) => {
        this.anotherUserProfilePhotoUrl = url;
    };

    setUserRecipesNumber = (recipesNumber: number) => {
        this.loggedUserRecipesNumber = recipesNumber;
    };

    setAnotherUserRecipesNumber = (recipesNumber: number) => {
        this.anotherUserRecipesNumber = recipesNumber;
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
        this.anotherUserRecipeRegistry.clear();
        this.loggedUserRecipesLoaded = false;
        this.recipeDashboardPageNumber = 0;
        this.anotherUserRecipeDashboardPageNumber = 0;
        this.anotherUserUsername = '';
    };

    resetUserRecipesRegistry = () => {
        runInAction(() => {
            this.loggedUserRecipeRegistry.clear();
            this.anotherUserRecipeRegistry.clear();
            this.recipeDashboardPageNumber = 0;
            this.anotherUserRecipeDashboardPageNumber = 0;
            this.anotherUserUsername = '';
        });
        this.setLoggedUserRecipesLoaded(false);
    };
}
