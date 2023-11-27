import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import RecipeDetailedHeader from './components/RecipeDetailedHeader';
import RecipeDetailedComments from './components/RecipeDetailedComments';
import RecipeDetailedInstructionsAndIngredients from './components/RecipeDetailedInstructionsAndIngredients';

export default observer(function RecipeDetails() {
    const { recipeStore } = useStore();
    const { selectedRecipe: recipe, loadRecipe, loadingInitial } = recipeStore;
    const { recipeId, byUser } = useParams();

    useEffect(() => {
        if (recipeId) loadRecipe(recipeId);
    }, [recipeId, loadRecipe]);

    if (loadingInitial || !recipe) return <LoadingComponent content="Ładowanie przepisu..." />;

    return (
        <Grid>
            <Grid.Column width={16}>
                <RecipeDetailedHeader recipe={recipe} editable={byUser !== undefined} />
                <RecipeDetailedInstructionsAndIngredients recipe={recipe} />
                <RecipeDetailedComments recipe={recipe} />
            </Grid.Column>
        </Grid>
    );
});
