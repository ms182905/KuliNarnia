import React from 'react';
import { Grid } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import RecipeDetails from '../details/RecipeDetails';
import RecipeForm from '../form/RecipeForm';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function RecipeDashboard() {
    
    const {recipeStore} = useStore();
    const {selectedRecipe, editMode} = recipeStore;
    
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedRecipe && !editMode &&
                <RecipeDetails />}
                {editMode &&
                <RecipeForm />}
            </Grid.Column>
        </Grid>
    );
})
