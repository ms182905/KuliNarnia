import axios, { AxiosResponse } from 'axios';
import { Recipe } from '../models/recipe';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (responce: AxiosResponse<T>) => responce.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Recipes = {
    list: () => requests.get<Recipe[]>('/recipes')

}

const agent = {
    Recipes
}

export default agent;