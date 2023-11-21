import { Recipe } from '../../../app/models/recipe';
import { useStore } from '../../../app/stores/store';
import RecipeListItem from './RecipeListItem';
import { Fragment } from 'react';

export default function RecipeList() {
    const { recipeStore } = useStore();
    const { recipes } = recipeStore;

    return (
        <>
            {recipes
                .slice()
                .sort((a: Recipe, b: Recipe) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((recipe, index) => (
                    <RecipeListItem key={index} recipe={recipe} index={index} />
                ))}
        </>
    );
}
