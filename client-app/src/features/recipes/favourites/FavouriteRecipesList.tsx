import { useStore } from '../../../app/stores/store';
import FavouriteRecipesListItem from './FavouriteRecipesListItem';

export default function FavouriteRecipesList() {
    const { recipeStore } = useStore();
    const { favouriteRecipes } = recipeStore;

    console.log(favouriteRecipes);

    return (
        <>
            {favouriteRecipes.map((recipe) => (
                <FavouriteRecipesListItem key={recipe.id} recipe={recipe} />
            ))}
        </>
    );
}
