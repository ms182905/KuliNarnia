import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import FavouriteRecipesList from './FavouriteRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function FavouriteRecipesDashboard() {
    const { recipeStore } = useStore();
    const { loadFavouriteRecipes, favouriteRecipeRegistry, favouriteRecipesLoaded } = recipeStore;

    useEffect(() => {
        if (favouriteRecipeRegistry.size < 1 && !favouriteRecipesLoaded) {
            console.log(favouriteRecipeRegistry.size);
            loadFavouriteRecipes();
        }
    }, [loadFavouriteRecipes, favouriteRecipeRegistry.size, favouriteRecipesLoaded]);

    if (!favouriteRecipesLoaded) return <LoadingComponent content="Loading favourite recipes..." />;

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <FavouriteRecipesList />
                </Grid.Column>
            </Grid>

            <Pagination
                defaultActivePage={1}
                pointing
                secondary
                totalPages={20}
                size="big"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            />
        </>
    );
});
