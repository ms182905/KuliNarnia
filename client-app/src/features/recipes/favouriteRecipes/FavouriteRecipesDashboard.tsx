import { useEffect, useState } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import FavouriteRecipesList from './FavouriteRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { router } from '../../../app/router/Routes';

export default observer(function FavouriteRecipesDashboard() {
    const { favouriteRecipesStore, pageOptionButtonStore, userStore } = useStore();
    const {
        loadFavouriteRecipes,
        favouriteRecipeRegistry,
        favouriteRecipesLoaded,
        favouriteRecipesNumber,
        handlePageChange,
        pageCapacity,
    } = favouriteRecipesStore;

    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (!userStore.user) {
            router.navigate('/');
        }
    }, [userStore.user]);

    useEffect(() => {
        if (favouriteRecipeRegistry.size < 1 && !favouriteRecipesLoaded) {
            if (pageNumber > 1 && (pageNumber - 1) * pageCapacity + 1 > favouriteRecipesNumber) {
                loadFavouriteRecipes(pageNumber - 2);
                setPageNumber(pageNumber - 1);
                return;
            }
            loadFavouriteRecipes(pageNumber - 1);
        }
    }, [loadFavouriteRecipes, favouriteRecipeRegistry.size, favouriteRecipesLoaded, pageNumber, favouriteRecipesNumber, pageCapacity]);

    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

    if (!favouriteRecipesLoaded) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return <LoadingComponent content="Ładowanie ulubionych przepisów..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <FavouriteRecipesList />
                </Grid.Column>
            </Grid>

            {favouriteRecipesNumber > pageCapacity && (
                <Pagination
                    defaultActivePage={pageNumber}
                    totalPages={Math.ceil(favouriteRecipesNumber / pageCapacity)}
                    size="huge"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '0.5em',
                        fontFamily: 'Andale Mono, monospace',
                        borderRadius: '1em',
                    }}
                    onPageChange={(_, data) => {
                        handlePageChange();
                        setPageNumber(Number(data.activePage));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}
        </>
    );
});
