import { makeAutoObservable, runInAction } from 'mobx';
import { User, UserFormValues } from '../models/user';
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';

export default class UserStore {
    user: User | null = null;
    photoUploading = false;
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            console.log('User role: ');
            console.log(user.role);
            store.commonStore.setToken(user.token);
            runInAction(() => (this.user = user));
            if (user.role === 'Administrator') {
                store.recipeStore.reset();
                store.recipeStore.resetFilters();
                store.recipeStore.resetSearchQuerry();
                store.favouriteRecipesStore.reset();
                store.userRecipesStore.reset();
                router.navigate('/lastActivity');
            } else {
                router.navigate('/recipes');
            }
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => (this.user = user));
            router.navigate('/recipes');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    logout = () => {
        store.commonStore.setToken(null);
        store.recipeStore.reset();
        store.recipeStore.resetFilters();
        store.recipeStore.resetSearchQuerry();
        store.favouriteRecipesStore.reset();
        store.userRecipesStore.reset();
        this.user = null;
        router.navigate('/');
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => (this.user = user));
        } catch (error) {
            console.log(error);
        }
    };

    deleteUserAccount = async (userName: string) => {
        this.setLoading(true);
        try {
            await agent.Account.delete(userName);
            this.setLoading(false);
            router.navigate('/lastActivity');
        } catch (error) {
            this.setLoading(false);
            console.log(error);
        }
    };

    uploadPhoto = async (file: Blob) => {
        this.photoUploading = true;
        try {
            if (!this.user) return;
            const responce = await agent.Account.uploadProfilePhoto(file);
            const photo = responce.data;
            this.changeUserProfilePhotoUrl(photo.url);
            runInAction(() => {
                this.photoUploading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => (this.photoUploading = false));
        }
    };

    changeUserProfilePhotoUrl = (photoUrl: string) => {
        if (this.user) {
            console.log(photoUrl);
            this.user.photoUrl = photoUrl;
            store.userRecipesStore.setAnotherUserProfilePhotoUrl(photoUrl);
        }
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };
}
