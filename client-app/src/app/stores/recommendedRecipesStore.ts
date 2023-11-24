import { makeAutoObservable, runInAction } from 'mobx';
import { Recipe } from '../models/recipe';
import agent from '../api/agent';

export default class RecommendedRecipesStore {
    recommendedRecipeRegistry = new Map<string, Recipe>();
    loading = false;
    loadingInitial = false;
    recommendedRecipesLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    get recommendedRecipes() {
        return Array.from(this.recommendedRecipeRegistry.values());
    }

    loadRecommendedRecipes = async () => {
        this.setRecommendedRecipesLoaded(false);
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.RecommendedRecipes.list();
            recipes.recipes.forEach((recipe) => {
                this.setRecommendedRecipe(recipe);
            });
            this.setRecommendedRecipesLoaded(true);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setRecommendedRecipesLoaded(true);
            this.setLoadingInitial(false);
        }
    };

    private setRecommendedRecipe = (recipe: Recipe) => {
        recipe.date = recipe.date.split('T')[0];
        this.recommendedRecipeRegistry.set(recipe.id, recipe);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };

    setRecommendedRecipesLoaded = (state: boolean) => {
        this.recommendedRecipesLoaded = state;
    };

    reset = () => {
        this.recommendedRecipeRegistry.clear();
        this.recommendedRecipesLoaded = false;
    };

    resetRecommendedRecipesRegistry = () => {
        runInAction(() => {
            this.recommendedRecipeRegistry.clear();
        });
        this.setRecommendedRecipesLoaded(false);
    };
}
