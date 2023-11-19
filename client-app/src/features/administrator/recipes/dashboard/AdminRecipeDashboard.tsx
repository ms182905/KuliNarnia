import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import AdminRecipeList from './AdminRecipeList';
import { useStore } from '../../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../../app/layout/LoadingComponent';
import { useLocation } from 'react-router-dom';
import { router } from '../../../../app/router/Routes';

export default observer(function AdminRecipeDashboard() {
    const { recipeStore, userStore } = useStore();
    const {
        loadRecipes,
        recipeRegistry,
        recipesNumber,
        handlePageChange,
        pageCapacity,
        recipeDashboardPageNumber,
        searchQuery,
        selectedCategory,
        selectedTags,
    } = recipeStore;

    console.log(useLocation().pathname);

    if (userStore.user?.role !== 'Administrator') {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (recipeRegistry.size < 1) {
            loadRecipes(recipeDashboardPageNumber);
        }
    }, [loadRecipes, recipeRegistry.size, recipeDashboardPageNumber, searchQuery, selectedCategory, selectedTags]);

    if (recipeStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading recipes..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <AdminRecipeList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={recipeDashboardPageNumber}
                pointing
                secondary
                totalPages={Math.ceil(recipesNumber / pageCapacity)}
                size="huge"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2em',
                    paddingBottom: '1em',
                }}
                onPageChange={(_event, data) => {
                    handlePageChange(Number(data.activePage));
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
