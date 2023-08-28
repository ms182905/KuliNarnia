import React, { useEffect } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';

export default observer (function RecipeDetails() {
  
  const {recipeStore} = useStore();
  const {selectedRecipe: recipe, loadRecipe, loadingInitial} = recipeStore;
  const {id} = useParams();

  useEffect(() => {
    if (id) loadRecipe(id);
  }, [id, loadRecipe])

  if (loadingInitial || !recipe) return <LoadingComponent/>;
  
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
            <Button as={Link} to={`/manage/${recipe.id}`} basic color='blue' content='Edit' />
            <Button as={Link} to='/recipes' basic color='grey' content='Cancel' />
          </Button.Group>
        </Card.Content>
      </Card>
    )
})
