import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import { Recipe } from '../../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

function capitalizeFirstLetter(input?: string): string {
    if (!input) return '';
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export default observer(function RecipeDetailedInfo({ recipe }: Props) {
    return (
        <Segment.Group>
            <Segment attached="top">
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size="large" color="teal" name="info" />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{recipe.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign="middle">
                    <Grid.Column width={1}>
                        <Icon name="calendar" size="large" color="teal" />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>{recipe.date}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign="middle">
                    <Grid.Column width={1}>
                        <Icon name="food" size="large" color="teal" />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <span>{capitalizeFirstLetter(recipe.categoryName)}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign="middle">
                    <Grid.Column width={1}>
                        <Icon name="tags" size="large" color="teal" />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        {recipe.tags.map((tag, index) => (
                            <span key={index}>{tag.name} </span>
                        ))}
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    );
});
