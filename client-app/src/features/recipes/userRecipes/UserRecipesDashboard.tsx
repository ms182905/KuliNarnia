import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import UserRecipesList from './UserRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { router } from '../../../app/router/Routes';

export default observer(function UserRecipesDashboard() {
    const { userRecipesStore, userStore } = useStore();
    const {
        loadLoggedUserRecipes,
        loggedUserRecipeRegistry,
        loggedUserRecipesNumber,
        loggedUserRecipesLoaded,
        handlePageChange,
        pageCapacity,
        recipeDashboardPageNumber,
    } = userRecipesStore;

    useEffect(() => {
        if (!userStore.user) {
            router.navigate('/');
        }
    }, [userStore.user]);

    useEffect(() => {
        if (loggedUserRecipeRegistry.size < 1 || !loggedUserRecipesLoaded) {
            loadLoggedUserRecipes(recipeDashboardPageNumber);
        }
    }, [loadLoggedUserRecipes, loggedUserRecipeRegistry.size, loggedUserRecipeRegistry, loggedUserRecipesLoaded, recipeDashboardPageNumber]);

    if (userRecipesStore.loadingInitial || userRecipesStore.loading) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return <LoadingComponent content="Loading recipes..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <UserRecipesList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={recipeDashboardPageNumber + 1}
                totalPages={Math.ceil(loggedUserRecipesNumber / pageCapacity)}
                size="huge"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '0.5em',
                    fontFamily: 'Andale Mono, monospace',
                    borderRadius: '1em',
                }}
                onPageChange={(_event, data) => {
                    handlePageChange(Number(data.activePage) - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
        </>
    );
});
