import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react'; 
import { Recipe } from '../models/recipe';
import NavBar from './NavBar';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {recipeStore} = useStore();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    recipeStore.loadRecipes();
  }, [recipeStore])

  function deleteRecipe(id: string) {
    setSubmitting(true);
    agent.Recipes.delete(id).then(() => {
      setRecipes([...recipes.filter(x => x.id !== id)]);
      setSubmitting(false);
    });
  }

  function handleCreateOrEditRecipe(recipe: Recipe) {
    setSubmitting(true);
    if (recipe.id) {
      agent.Recipes.update(recipe).then(() => {
        setRecipes([...recipes.filter(x => x.id !== recipe.id), recipe]);
        setSelectedRecipe(recipe);
        setEditMode(false)
        setSubmitting(false);
      });
    } else {
      recipe.id = uuid();
      agent.Recipes.create(recipe).then(() => {
        setRecipes([...recipes, recipe]);
        setSelectedRecipe(recipe);
        setEditMode(false)
        setSubmitting(false);
      })
    }
  }

  if (recipeStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <RecipeDashboard 
          recipes={recipeStore.recipes}
          createOrEdit={handleCreateOrEditRecipe}
          deleteRecipe={deleteRecipe}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default observer(App);
