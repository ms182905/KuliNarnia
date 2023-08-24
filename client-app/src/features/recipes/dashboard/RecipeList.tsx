import React from 'react';
import { Recipe } from '../../../app/models/recipe';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface Props {
    recipes: Recipe[];
    selectRecipe: (id: string) => void;
}

export default function RecipeList({recipes, selectRecipe}: Props) {
    return (
        <Segment>
            <Item.Group divided>
                {recipes.map(recipe => (
                    <Item key={recipe.id}>
                        <Item.Content>
                            <Item.Header as='a'>{recipe.title}</Item.Header>
                            <Item.Meta>{recipe.date}</Item.Meta>
                            <Item.Description>
                                <div>{recipe.description}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={()=>selectRecipe(recipe.id)} floated='right' content='View' color='blue'/>
                                <Label basic content={recipe.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}