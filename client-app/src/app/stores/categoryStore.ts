import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Category } from '../models/category';

export default class CategoryStore {
    categoriesTable: Category[] = [];
    loadingInitial = false;
    loading = false;
    categoriesLoaded = false;

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
                this.categoriesLoaded = true;
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            this.categoriesLoaded = true;
            this.setLoadingInitial(false);
        }
    };

    createCategory = async (category: Category) => {
        this.setLoading(true);
        try {
            await agent.Categories.create(category);
            runInAction(() => {
                this.categoriesTable.push(category);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateCategory = async (category: Category) => {
        this.setLoading(true);
        try {
            await agent.Categories.update(category);
            runInAction(() => {
                this.categoriesTable = this.categoriesTable.filter((c) => c.id !== category.id);
                this.categoriesTable.push(category);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    deleteCategory = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Categories.delete(id);
            runInAction(() => {
                this.categoriesTable = this.categoriesTable.filter((c) => c.id !== id);
            });
            this.setLoading(false);
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };
}
