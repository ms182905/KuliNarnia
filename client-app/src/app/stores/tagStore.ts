import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Tag } from '../models/tag';

export default class TagStore {
    tagsTable: Tag[] = [];
    loadingInitial = false;
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get tags() {
        return this.tagsTable;
    }

    loadTags = async () => {
        this.setLoadingInitial(true);
        try {
            const tags = await agent.Tags.list();
            runInAction(() => {
                this.tagsTable = tags;
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    createTag = async (tag: Tag) => {
        this.setLoading(true);
        try {
            await agent.Tags.create(tag);
            runInAction(() => {
                this.tagsTable.push(tag);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateTag = async (tag: Tag) => {
        this.setLoading(true);
        try {
            await agent.Tags.update(tag);
            runInAction(() => {
                this.tagsTable = this.tagsTable.filter((t) => t.id !== tag.id);
                this.tagsTable.push(tag);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    deleteTag = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Tags.delete(id);
            runInAction(() => {
                this.tagsTable = this.tagsTable.filter((t) => t.id !== id);
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
