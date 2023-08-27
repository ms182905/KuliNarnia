import { makeAutoObservable, runInAction } from "mobx";
import { Recipe } from "../models/recipe";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';

export default class RecipeStore {
    recipeRegistry = new Map<string, Recipe>();
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

    loadRecipes = async () => {
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.Recipes.list();
            recipes.forEach( recipe => {
                recipe.date = recipe.date.split('T')[0];
                this.recipeRegistry.set(recipe.id, recipe);
                });
                this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectRecipe = (id: string) => {
        this.selectedRecipe = this.recipeRegistry.get(id);
    }

    cancelSelectRecipe = () => {
        this.selectedRecipe = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectRecipe(id) : this.cancelSelectRecipe();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createRecipe = async (recipe: Recipe) => {
        this.loading = true;
        recipe.id = uuid();

        try {
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
        this.loading = true;

        try {
            await agent.Recipes.update(recipe);
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

    deleteRecipe = async (id: string) => {
        this.loading = true;

        try {
            await agent.Recipes.delete(id);
            runInAction(() => {
                this.recipeRegistry.delete(id);
                if (this.selectedRecipe?.id === id) this.cancelSelectRecipe();
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            if (this.selectedRecipe?.id === id) this.cancelSelectRecipe();
            this.loading = false;
        }
    }
}