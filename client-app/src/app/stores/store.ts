import { createContext, useContext } from "react";
import RecipeStore from "./recipeStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import CategoryStore from "./categoryStore";

interface Store {
    recipeStore: RecipeStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    categoryStore: CategoryStore;
}

export const store: Store = {
    recipeStore: new RecipeStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    categoryStore: new CategoryStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}