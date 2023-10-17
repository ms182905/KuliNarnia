import { useEffect, useState } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import UserRecipesList from './UserRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function UserRecipesDashboard() {
    const { userRecipesStore } = useStore();
    const { loadUserRecipes, userRecipeRegistry, userRecipesLoaded, userRecipesNumber } = userRecipesStore;

    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (userRecipeRegistry.size < 1 && !userRecipesLoaded) {
            console.log(userRecipesNumber);
            if (pageNumber > 1 && (pageNumber - 1) * 7 + 1 > userRecipesNumber) {
                loadUserRecipes(pageNumber - 2);
                setPageNumber(pageNumber - 1);
                return;
            }
            loadUserRecipes(pageNumber - 1);
        }
    }, [loadUserRecipes, userRecipeRegistry.size, userRecipesLoaded, pageNumber, userRecipesNumber]);

    if (!userRecipesLoaded) {
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
            {userRecipesNumber > 0 && (
                <Pagination
                    defaultActivePage={1}
                    pointing
                    secondary
                    totalPages={Math.ceil(userRecipesNumber / 8)}
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
