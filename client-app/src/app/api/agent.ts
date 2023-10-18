import axios, { AxiosError, AxiosResponse } from 'axios';
import { Recipe } from '../models/recipe';
import { Recipes as RecipesWithCounter } from '../models/recipes';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { Category } from '../models/category';
import { Tag } from '../models/tag';
import { RecipeComment } from '../models/comment';
import { UserSelection as UserSelectionDTO } from '../models/userSelection';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(
    async (response) => {
        return response;
    },
    (error: AxiosError) => {
        const { data, status, config } = error.response as AxiosResponse;

        switch (status) {
            case 400:
                if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                    router.navigate('/not-found');
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }

                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                if (window.location.pathname !== '/') {
                    toast.error('unauthorized');
                }
                break;
            case 403:
                toast.error('forbidden');
                break;
            case 404:
                router.navigate('/not-found');
                break;
            case 500:
                store.commonStore.setServerError(data);
                router.navigate('/server-error');
                break;
        }

        return Promise.reject(error);
    }
);

const responseBody = <T>(responce: AxiosResponse<T>) => responce.data;

axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Recipes = {
    list: (from: number, to: number) => requests.get<RecipesWithCounter>(`/recipes?from=${from}&to=${to}`),
    listByUser: () => requests.get<RecipesWithCounter>('/recipes/byUser'),
    details: (id: string) => requests.get<Recipe>(`/recipes/${id}`),
    create: (recipe: Recipe) => axios.post<void>('/recipes', recipe),
    update: (recipe: Recipe) => axios.put<void>(`/recipes/${recipe.id}`, recipe),
    delete: (id: string) => axios.delete<void>(`/recipes/${id}`),
};

const FavouriteRecipes = {
    list: (from: number, to: number) => requests.get<RecipesWithCounter>(`/favouriteRecipes?from=${from}&to=${to}`),
    removeFromFavourites: (id: string) => axios.delete<void>(`/favouriteRecipes/${id}`),
    addToFavourites: (id: string) => requests.put<void>(`/favouriteRecipes/${id}`, {}),
};

const UserRecipes = {
    list: (from: number, to: number) => requests.get<RecipesWithCounter>(`/recipes/userRecipes?from=${from}&to=${to}`),
};

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
};

const Categories = {
    list: () => requests.get<Category[]>('/categories'),
};

const Tags = {
    list: () => requests.get<Tag[]>('/tags'),
};
const Comments = {
    create: (comment: RecipeComment) => axios.post<void>('/comments', comment),
    delete: (id: string) => axios.delete<void>(`/comments/${id}`),
};

const UserSelection = {
    post: (userSelection: UserSelectionDTO) => axios.post<void>('/userSelection', userSelection),
};

const agent = {
    Recipes,
    FavouriteRecipes,
    UserRecipes,
    Account,
    Categories,
    Tags,
    Comments,
    UserSelection,
};

export default agent;
