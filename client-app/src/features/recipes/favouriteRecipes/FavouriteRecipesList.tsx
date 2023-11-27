import { useStore } from '../../../app/stores/store';
import { useState } from 'react';
import RecipeListItem from '../dashboard/RecipeListItem';

export default function FavouriteRecipesList() {
    const { favouriteRecipesStore } = useStore();
    const { favouriteRecipes, favouriteRecipeRegistry } = favouriteRecipesStore;

    useState(favouriteRecipeRegistry.size);

    return (
        <>
            <div
                style={{ gridTemplateAreas: "'text'", textAlign: 'center', gridTemplateColumns: '1fr' }}
                className="card__content"
            >
                <h2 style={{ padding: '0.5em' }}>
                    {favouriteRecipes.length > 0 ? 'Twoje ulubione przepisy' : 'Brak ulubionych przepisów!'}
                </h2>
            </div>
            {favouriteRecipes.map((recipe, index) => (
                <RecipeListItem index={index} recipe={recipe} key={index} />
            ))}
        </>
    );
}
