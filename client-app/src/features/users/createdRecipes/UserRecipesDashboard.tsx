import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import UserRecipesList from './UserRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function UserRecipesDashboard() {
    const { recipeStore } = useStore();
    const { loadUserRecipes, userRecipeRegistry, userRecipesLoaded, userRecipesNumber } = recipeStore;

    useEffect(() => {
        if (userRecipeRegistry.size < 1 && !userRecipesLoaded) {
            loadUserRecipes();
            console.log(userRecipeRegistry.size);
        }
    }, [loadUserRecipes, userRecipeRegistry.size, userRecipesLoaded]);

    if (!userRecipesLoaded) return <LoadingComponent content="Loading user recipes..." />;

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
