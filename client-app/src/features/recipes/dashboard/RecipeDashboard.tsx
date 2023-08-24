import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';
import RecipeList from './RecipeList';
import RecipeDetails from '../details/RecipeDetails';
import RecipeForm from '../form/RecipeForm';

interface Props {
    recipes: Recipe[];
    selectedRecipe: Recipe | undefined;
    selectRecipe: (id: string) => void;
    cancelSelectRecipe: () => void;
    editMode: boolean;
    openForm: (id: string | undefined) => void;
    closeForm: () => void;
    createOrEdit: (recipe: Recipe) => void;
    deleteRecipe: (id: string) => void;
}

export default function RecipeDashboard({recipes, selectedRecipe, selectRecipe, cancelSelectRecipe,
        editMode, openForm, closeForm, createOrEdit, deleteRecipe}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList 
                    recipes={recipes}
                    selectRecipe={selectRecipe}
                    deleteRecipe={deleteRecipe}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedRecipe && !editMode &&
                <RecipeDetails 
                    recipe={selectedRecipe}
                    cancelSelectRecipe={cancelSelectRecipe}
                    openForm={openForm}
                />}
                {editMode &&
                <RecipeForm
                    recipe={selectedRecipe}
                    closeForm={closeForm}
                    createOrEdit={createOrEdit}
                />}
            </Grid.Column>
        </Grid>
    );
}
