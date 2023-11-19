import { useEffect, useState } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useStore } from '../../../../app/stores/store';
import LoadingComponent from '../../../../app/layout/LoadingComponent';
import RecipeDetailedInfo from '../../../recipes/details/components/RecipeDetailedInfo';
import RecipeDetailedIngredients from '../../../recipes/details/components/RecipeDetailedIngredients';
import RecipeDetailedInstructions from '../../../recipes/details/components/RecipeDetailedInstructions';
import AdminRecipeDetailedComments from './components/AdminRecipeDetailedComments';
import RemoveUserRecipe from '../../../../app/common/modals/RemoveUserRecipe';
import AdminRecipeDetailedHeader from './components/AdminRecipeDetailedHeader';
import { router } from '../../../../app/router/Routes';

export default observer(function AdminRecipeDetails() {
    const { recipeStore, userRecipesStore, modalStore, userStore } = useStore();
    const { selectedRecipe: recipe, loadRecipe, loadingInitial } = recipeStore;
    const { recipeId } = useParams();

    const [buttonPressed, setButtonPressed] = useState(false);
    const [loadingActivated, setLoadingActivated] = useState(false);

    if (userStore.user?.role !== 'Administrator') {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (recipeId) loadRecipe(recipeId);
    }, [recipeId, loadRecipe]);

    useEffect(() => {
        if (buttonPressed && !loadingActivated && userRecipesStore.loading) {
            setLoadingActivated(true);
        }
        if (buttonPressed && loadingActivated && !userRecipesStore.loading) {
            router.navigate('/adminRecipes');
        }
    }, [buttonPressed, loadingActivated, userRecipesStore.loading]);

    if (loadingInitial || !recipe) return <LoadingComponent content="Loading recipe..." />;

    return (
        <Grid>
            <Grid.Column width={16}>
                <AdminRecipeDetailedHeader recipe={recipe} />
                <RecipeDetailedInfo recipe={recipe} />
                <Button
                    name={recipe.id}
                    loading={userRecipesStore.loading}
                    onClick={(e) => {
                        setButtonPressed(true);
                        modalStore.openModal(<RemoveUserRecipe recipeId={recipe.id} />);
                    }}
                    fluid
                    content="Delete recipe"
                    color="red"
                />
                <RecipeDetailedIngredients recipe={recipe} />
                <RecipeDetailedInstructions recipe={recipe} />
                <AdminRecipeDetailedComments recipe={recipe} />
            </Grid.Column>
        </Grid>
    );
});
