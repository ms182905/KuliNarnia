import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import UserRecipesList from './UserRecipesList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function UserRecipesDashboard() {
    const { recipeStore } = useStore();
    const { loadUserRecipes, userRecipeRegistry, userRecipesLoaded } = recipeStore;

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
                <Grid.Column width="13">
                    <UserRecipesList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={1}
                pointing
                secondary
                totalPages={20}
                size="big"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            />
        </>
    );
});
