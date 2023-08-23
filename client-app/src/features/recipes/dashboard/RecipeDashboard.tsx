import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipes: Recipe[];
}

export default function RecipeDashboard({recipes}: Props) {
    return (
        <Grid>
            <Grid.Column width="10">
                <List>
                    {recipes.map((recipe) => (
                        <List.Item key={recipe.id}>{recipe.title}</List.Item>
                    ))}
                </List>
            </Grid.Column>
        </Grid>
    );
}
