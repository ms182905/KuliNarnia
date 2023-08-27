import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default function RecipeDetails() {
  
  const {recipeStore} = useStore();
  const {selectedRecipe: recipe, openForm, cancelSelectRecipe} = recipeStore;

  if (!recipe) return <LoadingComponent/>;
  
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
            <Button onClick={() => openForm(recipe.id)} basic color='blue' content='Edit' />
            <Button onClick={cancelSelectRecipe} basic color='grey' content='Cancel' />
          </Button.Group>
        </Card.Content>
      </Card>
    )
}
