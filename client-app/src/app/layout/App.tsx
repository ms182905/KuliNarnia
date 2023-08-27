import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react'; 
import { Recipe } from '../models/recipe';
import NavBar from './NavBar';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {recipeStore} = useStore();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
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

  if (recipeStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <RecipeDashboard 
          recipes={recipeStore.recipes}
          deleteRecipe={deleteRecipe}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default observer(App);
