import { makeAutoObservable } from "mobx";
import { Recipe } from "../models/recipe";
import agent from "../api/agent";

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
}