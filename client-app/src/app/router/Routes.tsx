import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import RecipeDashboard from "../../features/recipes/dashboard/RecipeDashboard";
import RecipeForm from "../../features/recipes/form/RecipeForm";
import RecipeDetails from "../../features/recipes/details/RecipeDetails";
import TestErrors from "../../features/errors/TestErrors";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <HomePage />},
            {path: 'recipes', element: <RecipeDashboard />},
            {path: 'recipes/:id', element: <RecipeDetails />},
            {path: 'createRecipe', element: <RecipeForm key='create' />},
            {path: 'manage/:id', element: <RecipeForm key='manage' />},
            {path: 'errors', element: <TestErrors/>},
        ]
    }
]

export const router = createBrowserRouter(routes);