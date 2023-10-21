import { createContext, useContext } from 'react';
import RecipeStore from './recipeStore';
import CommonStore from './commonStore';
import UserStore from './userStore';
import ModalStore from './modalStore';
import CategoryStore from './categoryStore';
import TagStore from './tagStore';
import FavouriteRecipesStore from './favouriteRecipesStore';
import UserRecipesStore from './userRecipesStore';
import RecommendedRecipesStore from './recommendedRecipesStore';

interface Store {
    recipeStore: RecipeStore;
    favouriteRecipesStore: FavouriteRecipesStore;
    userRecipesStore: UserRecipesStore;
    recommendedRecipesStore: RecommendedRecipesStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    categoryStore: CategoryStore;
    tagStore: TagStore;
}

export const store: Store = {
    recipeStore: new RecipeStore(),
    favouriteRecipesStore: new FavouriteRecipesStore(),
    userRecipesStore: new UserRecipesStore(),
    recommendedRecipesStore: new RecommendedRecipesStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    categoryStore: new CategoryStore(),
    tagStore: new TagStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
