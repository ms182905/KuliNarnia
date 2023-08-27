import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';
import RecipeList from './RecipeList';
import RecipeDetails from '../details/RecipeDetails';
import RecipeForm from '../form/RecipeForm';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

interface Props {
    recipes: Recipe[];
    createOrEdit: (recipe: Recipe) => void;
    deleteRecipe: (id: string) => void;
    submitting: boolean;
}

export default observer(function RecipeDashboard({recipes, createOrEdit, deleteRecipe, submitting}: Props) {
    
    const {recipeStore} = useStore();
    const {selectedRecipe, editMode} = recipeStore;
    
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList 
                    recipes={recipes}
                    deleteRecipe={deleteRecipe}
                    submitting={submitting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedRecipe && !editMode &&
                <RecipeDetails />}
                {editMode &&
                <RecipeForm
                    createOrEdit={createOrEdit}
                    submitting={submitting}
                />}
            </Grid.Column>
        </Grid>
    );
})
