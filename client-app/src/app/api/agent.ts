import axios, { AxiosError, AxiosResponse } from 'axios';
import { Recipe } from '../models/recipe';
import { Recipes as RecipesDTO } from '../models/recipes';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { Category } from '../models/category';
import { Tag } from '../models/tag';
import { RecipeComment } from '../models/comment';
import { UserSelection as UserSelectionDTO } from '../models/userSelection';
import { Measurement } from '../models/measurement';
import { Photo } from '../models/photo';

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
    list: (from: number, to: number, category: string, tags: string, querry: string) =>
        requests.get<RecipesDTO>(
            `/recipes?from=${from}&to=${to}`.concat(
                category.length ? `&category=${category}` : '',
                tags.length ? `&tags=${tags}` : '',
                querry.length ? `&querry=${querry}` : ''
            )
        ),
    listByUser: () => requests.get<RecipesDTO>('/recipes/byUser'),
    details: (id: string) => requests.get<Recipe>(`/recipes/${id}`),
    create: (recipe: Recipe) => axios.post<void>('/recipes', recipe),
    update: (recipe: Recipe) => axios.put<void>(`/recipes/${recipe.id}`, recipe),
    delete: (id: string) => axios.delete<void>(`/recipes/${id}`),
    uploadPhoto: (id: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>(`photos/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deletePhoto: (id: string) => axios.delete<void>(`/photos/${id}`),
};

const FavouriteRecipes = {
    list: (from: number, to: number) => requests.get<RecipesDTO>(`/favouriteRecipes?from=${from}&to=${to}`),
    removeFromFavourites: (id: string) => axios.delete<void>(`/favouriteRecipes/${id}`),
    addToFavourites: (id: string) => requests.put<void>(`/favouriteRecipes/${id}`, {}),
};

const UserRecipes = {
    list: (username: string, from: number, to: number) => requests.get<RecipesDTO>(`/recipes/userRecipes?username=${username}&from=${from}&to=${to}`),
};

const RecommendedRecipes = {
    list: () => requests.get<RecipesDTO>(`/recipes/recommendedRecipes`),
};

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    getUserProfilePhotoUrl: (username: string) => requests.get<string>(`/account/profilePhoto/${username}`),
    uploadProfilePhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('/photos/changeUserProfilePhoto', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

const Categories = {
    list: () => requests.get<Category[]>('/categories'),
    create: (category: Category) => axios.post<void>('/categories', category),
    update: (category: Category) => axios.put<void>(`/categories/${category.id}`, category),
    delete: (id: string) => axios.delete<void>(`/categories/${id}`),
};

const Tags = {
    list: () => requests.get<Tag[]>('/tags'),
    create: (tag: Tag) => axios.post<void>('/tags', tag),
    update: (tag: Tag) => axios.put<void>(`/tags/${tag.id}`, tag),
    delete: (id: string) => axios.delete<void>(`/tags/${id}`),
};

const Measurements = {
    list: () => requests.get<Measurement[]>(`/measurements`),
    create: (measurement: Measurement) => axios.post<void>('/measurements', measurement),
    update: (measurement: Measurement) => axios.put<void>(`/measurements/${measurement.id}`, measurement),
    delete: (id: string) => axios.delete<void>(`/measurements/${id}`),
};

const Comments = {
    create: (comment: RecipeComment) => axios.post<void>('/comments', comment),
    delete: (id: string) => axios.delete<void>(`/comments/${id}`),
    getLast: (username: string) => requests.get<RecipeComment[]>(`/comments/userComments/${username}`),
};

const UserSelection = {
    post: (userSelection: UserSelectionDTO) => axios.post<void>('/userSelection', userSelection),
};

const agent = {
    Recipes,
    FavouriteRecipes,
    UserRecipes,
    RecommendedRecipes,
    Account,
    Categories,
    Tags,
    Measurements,
    Comments,
    UserSelection,
};

export default agent;
