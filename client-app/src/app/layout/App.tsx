import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react'; 
import { Recipe } from '../models/recipe';
import NavBar from './NavBar';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Recipes.list()
      .then(response => {
        let recipes: Recipe[] = [];
        response.forEach( recipe => {
          recipe.date = recipe.date.split('T')[0];
          recipes.push(recipe);
        });
        setRecipes(recipes);
        setLoading(false);
      })
  }, [])

  function handleSelectRecipe(id: string) {
    setSelectedRecipe(recipes.find(x => x.id === id));
  }

  function handleCancelSelectRecipe() {
    setSelectedRecipe(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectRecipe(id) : handleCancelSelectRecipe();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function deleteRecipe(id: string) {
    setRecipes([...recipes.filter(x => x.id !== id)])
  }

  function handleCreateOrEditRecipe(recipe: Recipe) {
    recipe.id 
      ? setRecipes([...recipes.filter(x => x.id !== recipe.id), recipe])
      : setRecipes([...recipes, {...recipe, id: uuid()}]);
    
    setEditMode(false);
    setSelectedRecipe(recipe);
  }

  if (loading) return <LoadingComponent content='Loading app'/>

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <RecipeDashboard 
          recipes={recipes}
          selectedRecipe={selectedRecipe}
          selectRecipe={handleSelectRecipe}
          cancelSelectRecipe={handleCancelSelectRecipe}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditRecipe}
          deleteRecipe={deleteRecipe}
        />
      </Container>
    </>
  );
}

export default App;
