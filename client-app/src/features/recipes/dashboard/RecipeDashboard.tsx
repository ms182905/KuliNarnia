import { useEffect, useState } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeFilters from './RecipeFilters';
import { Dashboard } from '../../../app/common/options/dashboards';

export default observer(function RecipeDashboard() {
    const { recipeStore } = useStore();
    const { loadRecipes, recipeRegistry, recipesNumber, handlePageChange } = recipeStore;

    if (recipeStore.favouriteRecipeRegistry.size > 0 || recipeStore.userRecipeRegistry.size > 0) {
        recipeStore.resetFavouritesAndUserRecipesRegistry();
    }

    const [pageNumber, setPageNumber] = useState(recipeStore.recipeDashboardPageNumber + 1);

    useEffect(() => {
        if (recipeRegistry.size < 1) loadRecipes(pageNumber - 1);
    }, [loadRecipes, recipeRegistry.size, pageNumber]);

    if (recipeStore.loadingInitial) return <LoadingComponent content="Loading recipes..." />;

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    {/* </Grid.Column>
            <Grid.Column width='6'> */}
                    <RecipeFilters />
                    <RecipeList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={pageNumber}
                pointing
                secondary
                totalPages={Math.ceil(recipesNumber / 7)}
                size="huge"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2em',
                    paddingBottom: '1em',
                }}
                onPageChange={(event, data) => {
                    handlePageChange(Dashboard.RecipeDashboard, Number(data.activePage) - 1);
                    setPageNumber(Number(data.activePage));
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
