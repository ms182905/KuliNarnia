import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import App from '../layout/App';
import HomePage from '../../features/home/HomePage';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';
import RecipeForm from '../../features/recipes/form/RecipeForm';
import RecipeDetails from '../../features/recipes/details/RecipeDetails';
import TestErrors from '../../features/errors/TestErrors';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/users/LoginForm';
import FavouriteRecipesDashboard from '../../features/recipes/favouriteRecipes/FavouriteRecipesDashboard';
import UserRecipesDashboard from '../../features/recipes/userRecipes/UserRecipesDashboard';
import RecommendedRecipesDashboard from '../../features/recipes/recommendedRecipes/RecommendedRecipesDashboard';
import UserPage from '../../features/users/UserPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'recipes', element: <RecipeDashboard /> },
            { path: 'userPage/:userName', element: <UserPage /> },
            { path: 'recipes/:recipeId/:byUser?', element: <RecipeDetails /> },
            { path: 'favouriteRecipes', element: <FavouriteRecipesDashboard /> },
            { path: 'userRecipes', element: <UserRecipesDashboard /> },
            { path: 'recommendations', element: <RecommendedRecipesDashboard /> },
            { path: 'createRecipe', element: <RecipeForm key="create" /> },
            { path: 'manage/:id', element: <RecipeForm key="manage" /> },
            { path: 'login', element: <LoginForm key="manage" /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: '*', element: <Navigate replace to="/not-found" /> },
        ],
    },
];

export const router = createBrowserRouter(routes);
