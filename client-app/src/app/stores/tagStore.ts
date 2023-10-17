import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Tag } from '../models/tag';

export default class TagStore {
    tagsTable: Tag[] = [];
    loadingInitial = false;

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

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };
}
