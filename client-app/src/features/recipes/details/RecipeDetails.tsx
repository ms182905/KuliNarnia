import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
    cancelSelectRecipe: () => void;
}

export default function RecipeDetails({recipe, cancelSelectRecipe}: Props) {
    return (
        <Card fluid>
        <Image src={`/assets/categoryImages/${recipe.category}.jpg`} />
        <Card.Content>
          <Card.Header>{recipe.title}</Card.Header>
          <Card.Meta>
            <span>{recipe.date}</span>
          </Card.Meta>
          <Card.Description>
            {recipe.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button.Group widths='2'>
            <Button basic color='blue' content='Edit' />
            <Button onClick={cancelSelectRecipe} basic color='grey' content='Cancel' />
          </Button.Group>
        </Card.Content>
      </Card>
    )
}
