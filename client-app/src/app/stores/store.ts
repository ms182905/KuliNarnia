import { createContext, useContext } from "react";
import RecipeStore from "./recipeStore";

interface Store {
    recipeStore: RecipeStore
}

export const store: Store = {
    recipeStore: new RecipeStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}