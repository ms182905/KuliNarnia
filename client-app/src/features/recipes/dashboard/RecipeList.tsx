import { useStore } from '../../../app/stores/store';
import RecipeListItem from './RecipeListItem';
import { Fragment } from 'react';

export default function RecipeList() {
    const { recipeStore } = useStore();
    const { recipes } = recipeStore;

    return (
        <>
            {recipes.map((recipe, index) => (
                <RecipeListItem key={index} recipe={recipe} index={index} />
            ))}
        </>
    );
}
