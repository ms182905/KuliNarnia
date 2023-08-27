import { makeAutoObservable, runInAction } from "mobx";
import { Recipe } from "../models/recipe";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';

export default class RecipeStore {
    recipes: Recipe[] = [];
    selectedRecipe: Recipe | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    loadRecipes = async () => {
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.Recipes.list();
            recipes.forEach( recipe => {
                recipe.date = recipe.date.split('T')[0];
                this.recipes.push(recipe);
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
        this.selectedRecipe = this.recipes.find(r => r.id === id);
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
                this.recipes.push(recipe);
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
                this.recipes = [...this.recipes.filter(r => r.id !== recipe.id), recipe];
                this.selectedRecipe = recipe;
                this.editMode = false;
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
}