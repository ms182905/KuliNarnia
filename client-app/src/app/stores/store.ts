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
import MeasurementStore from './measurementStore';
import CommentStore from './commentStore';
import ActivityStore from './activityStore';
import MenuHideStore from './menuHideStore';
import PageOptionButtonStore from './pageOptionButtonStore';
import ListenButtonStore from './ListenButtonStore';

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
    measurementStore: MeasurementStore;
    activityStore: ActivityStore;
    commentStore: CommentStore;
    menuHideStore: MenuHideStore;
    pageOptionButtonStore: PageOptionButtonStore;
    listenButtonStore: ListenButtonStore;
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
    measurementStore: new MeasurementStore(),
    activityStore: new ActivityStore(),
    commentStore: new CommentStore(),
    menuHideStore: new MenuHideStore(),
    pageOptionButtonStore: new PageOptionButtonStore(),
    listenButtonStore: new ListenButtonStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
