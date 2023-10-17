import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Category } from '../models/category';

export default class CategoryStore {
    categoriesTable: Category[] = [];
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get categories() {
        return this.categoriesTable;
    }

    loadCategories = async () => {
        this.setLoadingInitial(true);
        try {
            const categories = await agent.Categories.list();
            runInAction(() => {
                this.categoriesTable = categories;
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };
}
