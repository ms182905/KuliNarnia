import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { RecipeComment } from '../models/comment';

export default class CommentStore {
    userCommentsTable: RecipeComment[] = [];
    userCommentsNumber = 0;
    loadingComments = false;
    userCommentsLoaded = false;
    username = '';

    constructor() {
        makeAutoObservable(this);
    }

    get userComments() {
        return this.userCommentsTable;
    }

    loadUserComments = async (username: string) => {
        this.setLoadingComments(true);
        try {
            const userComments = await agent.Comments.getLast(username);
            runInAction(() => {
                this.userCommentsNumber = userComments.count;
                this.userCommentsTable = userComments.comments;
                this.loadingComments = false;
                this.username = username;
                this.userCommentsLoaded = true;
            });
        } catch (error) {
            console.log(error);
            this.setUserCommentsLoaded(true);
            this.setLoadingComments(false);
        }
    };

    setLoadingComments = (state: boolean) => {
        this.loadingComments = state;
    };

    setUserCommentsLoaded = (state: boolean) => {
        this.userCommentsLoaded = state;
    };

    setUsername = (username: string) => {
        this.username = username;
    };
}
