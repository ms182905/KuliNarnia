import axios, { AxiosError, AxiosResponse } from 'axios';
import { Recipe } from '../models/recipe';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }

                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorized')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            router.navigate('/not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;
    }

    return Promise.reject(error);
})

const responseBody = <T> (responce: AxiosResponse<T>) => responce.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Recipes = {
    list: () => requests.get<Recipe[]>('/recipes'),
    details: (id: string) => requests.get<Recipe>(`/recipes/${id}`),
    create: (recipe: Recipe) => axios.post<void>('/recipes', recipe),
    update: (recipe: Recipe) => axios.put<void>(`/recipes/${recipe.id}`, recipe),
    delete: (id: string) => axios.delete<void>(`/recipes/${id}`)


}

const agent = {
    Recipes
}

export default agent;