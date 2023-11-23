import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import UserRecipesList from './UserRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function UserRecipesDashboard() {
    const { userRecipesStore } = useStore();
    const {
        loadLoggedUserRecipes,
        loggedUserRecipeRegistry,
        loggedUserRecipesNumber,
        handlePageChange,
        pageCapacity,
        recipeDashboardPageNumber,
    } = userRecipesStore;

    useEffect(() => {
        if (loggedUserRecipeRegistry.size < 1) {
            loadLoggedUserRecipes(recipeDashboardPageNumber);
        }
    }, [loadLoggedUserRecipes, loggedUserRecipeRegistry.size, recipeDashboardPageNumber]);

    if (userRecipesStore.loadingInitial) {
        window.scrollTo(0, 0);
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
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
