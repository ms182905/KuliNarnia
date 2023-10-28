import { makeAutoObservable, runInAction } from 'mobx';
import { Recipe } from '../models/recipe';
import agent from '../api/agent';
import { store } from './store';

export default class FavouriteRecipesStore {
    favouriteRecipeRegistry = new Map<string, Recipe>();
    loading = false;
    loadingInitial = false;
    favouriteRecipesLoaded = false;
    favouriteRecipesNumber = 0;
    pageCapacity = 7;

    constructor() {
        makeAutoObservable(this);
    }

    get favouriteRecipes() {
        return Array.from(this.favouriteRecipeRegistry.values());
    }

    loadFavouriteRecipes = async (pageNumber: number) => {
        this.setFavouriteRecipesLoaded(false);
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.FavouriteRecipes.list(
                pageNumber * this.pageCapacity,
                pageNumber * this.pageCapacity + this.pageCapacity
            );
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

    handlePageChange = async () => {
        this.favouriteRecipeRegistry.clear();
        this.setFavouriteRecipesLoaded(false);
    };

    private setFavouriteRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.favouriteRecipeRegistry.set(recipe.id, recipe);
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

    setFavouriteRecipesNumber = (recipesNumber: number) => {
        this.favouriteRecipesNumber = recipesNumber;
    };

    removeRecipeFromFavourites = async (recipe: Recipe) => {
        this.setLoading(true);
        this.setFavouriteRecipesNumber(this.favouriteRecipesNumber - 1);
        try {
            await agent.FavouriteRecipes.removeFromFavourites(recipe.id);
            runInAction(() => {
                if (recipe) {
                    recipe.inFavourites = false;
                }
                this.loading = false;
            });
            this.resetFavouriteRecipesRegistry();
            store.recommendedRecipesStore.resetRecommendedRecipesRegistry();
            store.recipeStore.reset();
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    };

    removeRecipeFromFavouritesById = async (recipeId: string) => {
        this.setLoading(true);
        this.setFavouriteRecipesNumber(this.favouriteRecipesNumber - 1);
        try {
            await agent.FavouriteRecipes.removeFromFavourites(recipeId);
            this.resetFavouriteRecipesRegistry();
            this.setLoading(false);
            store.recommendedRecipesStore.resetRecommendedRecipesRegistry();
            store.recipeStore.reset();
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    };

    addRecipeToFavourites = async (recipe: Recipe) => {
        this.setLoading(true);
        try {
            await agent.FavouriteRecipes.addToFavourites(recipe.id);
            runInAction(() => {
                recipe!.inFavourites = true;
                this.setLoading(false);
            });
            this.resetFavouriteRecipesRegistry();
            store.recommendedRecipesStore.resetRecommendedRecipesRegistry();
            store.recipeStore.reset();
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    };

    reset = () => {
        this.favouriteRecipeRegistry.clear();
        this.favouriteRecipesLoaded = false;
    };

    resetFavouriteRecipesRegistry = () => {
        runInAction(() => {
            this.favouriteRecipeRegistry.clear();
        });
        this.setFavouriteRecipesLoaded(false);
    };
}
