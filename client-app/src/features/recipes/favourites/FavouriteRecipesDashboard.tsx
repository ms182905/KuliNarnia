import { useEffect, useState } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import FavouriteRecipesList from './FavouriteRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Dashboard } from '../../../app/common/options/dashboards';

export default observer(function FavouriteRecipesDashboard() {
    const { recipeStore } = useStore();
    const {
        loadFavouriteRecipes,
        favouriteRecipeRegistry,
        favouriteRecipesLoaded,
        favouriteRecipesNumber,
        handlePageChange,
        resetFavouriteRecipesRegistry
    } = recipeStore;

    if (recipeStore.userRecipeRegistry.size > 0) {
        recipeStore.resetUserRecipesRegistry();
    }

    const [pageNumber, setPageNumber] = useState(1);

    //TODO: handling last favourite recipe from page deletion

    // useEffect(() => {
    //     if (favouriteRecipesNumber <= pageNumber * 7 && pageNumber > 1) {
    //         setPageNumber(pageNumber - 1);
    //         loadFavouriteRecipes(pageNumber - 1);
    //     }
    // }, [pageNumber, favouriteRecipesNumber]);

    useEffect(() => {
        if (favouriteRecipeRegistry.size < 1 && !favouriteRecipesLoaded) {
            console.log(favouriteRecipeRegistry.size);
            loadFavouriteRecipes(pageNumber - 1);
        }
    }, [loadFavouriteRecipes, favouriteRecipeRegistry.size, favouriteRecipesLoaded, pageNumber]);

    if (!favouriteRecipesLoaded) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading favourite recipes..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <FavouriteRecipesList />
                </Grid.Column>
            </Grid>

            {favouriteRecipesNumber > 0 && (
                <Pagination
                    defaultActivePage={pageNumber}
                    pointing
                    secondary
                    totalPages={Math.ceil(favouriteRecipesNumber / 7)}
                    size="huge"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '2em',
                        paddingBottom: '1em',
                    }}
                    onPageChange={(event, data) => {
                        handlePageChange(Dashboard.FavouriteRecipesDashboard, Number(data.activePage) - 1);
                        setPageNumber(Number(data.activePage));
                        window.scrollTo(0, 0);
                    }}
                />
            )}
        </>
    );
});
