import { useEffect, useState } from 'react';
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
        loggedUserRecipesLoaded,
        loggedUserRecipesNumber,
        pageCapacity,
    } = userRecipesStore;

    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (loggedUserRecipeRegistry.size < 1 && !loggedUserRecipesLoaded) {
            console.log(loggedUserRecipesNumber);
            if (pageNumber > 1 && (pageNumber - 1) * pageCapacity + 1 > loggedUserRecipesNumber) {
                loadLoggedUserRecipes(pageNumber - 2);
                setPageNumber(pageNumber - 1);
                return;
            }
            loadLoggedUserRecipes(pageNumber - 1);
        }
    }, [loadLoggedUserRecipes, loggedUserRecipeRegistry.size, loggedUserRecipesLoaded, pageNumber, loggedUserRecipesNumber, pageCapacity]);

    if (!loggedUserRecipesLoaded) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading user recipes..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <UserRecipesList />
                </Grid.Column>
            </Grid>
            {loggedUserRecipesNumber > pageCapacity && (
                <Pagination
                    defaultActivePage={1}
                    pointing
                    secondary
                    totalPages={Math.ceil(loggedUserRecipesNumber / pageCapacity)}
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
