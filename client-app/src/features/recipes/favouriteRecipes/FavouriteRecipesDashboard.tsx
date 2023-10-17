import { useEffect, useState } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import FavouriteRecipesList from './FavouriteRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function FavouriteRecipesDashboard() {
    const { favouriteRecipesStore } = useStore();
    const {
        loadFavouriteRecipes,
        favouriteRecipeRegistry,
        favouriteRecipesLoaded,
        favouriteRecipesNumber,
        handlePageChange,
    } = favouriteRecipesStore;
    // const { resetUserRecipesRegistry, userRecipeRegistry } = userRecipesStore;

    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (favouriteRecipeRegistry.size < 1 && !favouriteRecipesLoaded) {
            console.log(favouriteRecipesNumber);
            if (pageNumber > 1 && (pageNumber - 1) * 7 + 1 > favouriteRecipesNumber) {
                loadFavouriteRecipes(pageNumber - 2);
                setPageNumber(pageNumber - 1);
                return;
            }
            loadFavouriteRecipes(pageNumber - 1);
        }
    }, [loadFavouriteRecipes, favouriteRecipeRegistry.size, favouriteRecipesLoaded, pageNumber, favouriteRecipesNumber]);

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
                        handlePageChange();
                        setPageNumber(Number(data.activePage));
                        window.scrollTo(0, 0);
                    }}
                />
            )}
        </>
    );
});
