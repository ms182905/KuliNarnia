import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import FavouriteRecipesListItem from './FavouriteRecipesListItem';
import { useState } from 'react';

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
            {favouriteRecipes.map((recipe) => (
                <FavouriteRecipesListItem key={recipe.id} recipe={recipe} />
            ))}
        </>
    );
}
