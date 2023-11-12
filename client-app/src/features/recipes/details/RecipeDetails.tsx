import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import RecipeDetailedHeader from './components/RecipeDetailedHeader';
import RecipeDetailedInfo from './components/RecipeDetailedInfo';
import RecipeDetailedComments from './components/RecipeDetailedComments';
import RecipeDetailedIngredients from './components/RecipeDetailedIngredients';
import RecipeDetailedInstructions from './components/RecipeDetailedInstructions';

export default observer(function RecipeDetails() {
    const { recipeStore } = useStore();
    const { selectedRecipe: recipe, loadRecipe, loadingInitial } = recipeStore;
    const { id, byUser } = useParams();

    useEffect(() => {
        if (id) loadRecipe(id);
    }, [id, loadRecipe]);

    if (loadingInitial || !recipe) return <LoadingComponent content="Loading recipe..." />;

    return (
        <Grid>
            <Grid.Column width={16}>
                <RecipeDetailedHeader recipe={recipe} editable={byUser !== undefined} />
                <RecipeDetailedInfo recipe={recipe} />
                <RecipeDetailedIngredients recipe={recipe} />
                <RecipeDetailedInstructions recipe={recipe} />
                <RecipeDetailedComments recipe={recipe} />
            </Grid.Column>
        </Grid>
    );
});
