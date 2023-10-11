import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import FavouriteRecipesList from './FavouriteRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function FavouriteRecipesDashboard() {
    const { recipeStore } = useStore();
    const { loadFavouriteRecipes, favouriteRecipeRegistry, favouriteRecipesLoaded, favouriteRecipesNumber } =
        recipeStore;

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

            {favouriteRecipesNumber > 0 && (
                <Pagination
                    defaultActivePage={1}
                    pointing
                    secondary
                    totalPages={Math.ceil(favouriteRecipesNumber / 8)}
                    size="huge"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '2em',
                        paddingBottom: '1em',
                    }}
                />
            )}
        </>
    );
});
