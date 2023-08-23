import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';
import RecipeList from './RecipeList';
import RecipeDetails from '../details/RecipeDetails';
import RecipeForm from '../form/RecipeForm';

interface Props {
    recipes: Recipe[];
}

export default function RecipeDashboard({recipes}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList recipes={recipes}/>
            </Grid.Column>
            <Grid.Column width='6'>
                {recipes[0] && 
                <RecipeDetails recipe={recipes[0]} />}
                <RecipeForm/>
            </Grid.Column>
        </Grid>
    );
}
