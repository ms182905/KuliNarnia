import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import RecipeDetailedHeader from './RecipeDetailedHeader';
import RecipeDetailedInfo from './RecipeDetailedInfo';
import RecipeDetailedComments from './RecipeDetailedComments';
import RecipeDetailedIngredients from './RecipeDetailedIngredients';

export default observer(function RecipeDetails() {
    const { recipeStore } = useStore();
    const { selectedRecipe: recipe, loadRecipe, loadingInitial } = recipeStore;
    const { id, byUser } = useParams();

    console.log('byUser ' + byUser);
    //TODO: Deleting recipe if byUser === true

    useEffect(() => {
        if (id) loadRecipe(id);
    }, [id, loadRecipe]);

    if (loadingInitial || !recipe) return <LoadingComponent content="Loading recipe..." />;

    return (
        <Grid>
            <Grid.Column width={16}>
                <RecipeDetailedHeader recipe={recipe} />
                <RecipeDetailedInfo recipe={recipe} />
                <RecipeDetailedIngredients recipe={recipe} />
                <RecipeDetailedComments recipe={recipe} />
            </Grid.Column>
        </Grid>
    );
});
