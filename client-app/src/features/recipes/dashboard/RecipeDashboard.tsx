import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';
import RecipeList from './RecipeList';
import RecipeDetails from '../details/RecipeDetails';
import RecipeForm from '../form/RecipeForm';

interface Props {
    recipes: Recipe[];
    selectedRecipe: Recipe | undefined;
    selectRecipe: (id: string) => void;
    cancelSelectRecipe: () => void;
}

export default function RecipeDashboard({recipes, selectedRecipe, selectRecipe, cancelSelectRecipe}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList 
                    recipes={recipes}
                    selectRecipe={selectRecipe}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedRecipe && 
                <RecipeDetails 
                    recipe={selectedRecipe}
                    cancelSelectRecipe={cancelSelectRecipe}
                />}
                <RecipeForm/>
            </Grid.Column>
        </Grid>
    );
}
