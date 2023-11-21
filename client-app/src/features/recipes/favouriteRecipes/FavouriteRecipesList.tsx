import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import FavouriteRecipesListItem from './FavouriteRecipesListItem';
import { useState } from 'react';
import RecipeListItem from '../dashboard/RecipeListItem';

export default function FavouriteRecipesList() {
    const { favouriteRecipesStore } = useStore();
    const { favouriteRecipes, favouriteRecipeRegistry } = favouriteRecipesStore;

    const [registrySize] = useState(favouriteRecipeRegistry.size);

    if (registrySize < 1) {
        return (
            <Header as="h3" textAlign="center" attached="bottom" style={{ border: '10px' }}>
                No favourite recipes yet!
            </Header>
        );
    }

    return (
        <>
            <div
                id="index"
                style={{ gridTemplateAreas: "'text'", textAlign: 'center', gridTemplateColumns: '1fr' }}
                className="card__content"
            >
                <h2 style={{ padding: '0.5em' }}>
                    {favouriteRecipes.length > 0 ? 'Your favourite recipes' : 'No favourite recipes yet!'}
                </h2>
            </div>
            {favouriteRecipes.map((recipe, index) => (
                <RecipeListItem index={index} recipe={recipe} />
            ))}
        </>
    );
}
