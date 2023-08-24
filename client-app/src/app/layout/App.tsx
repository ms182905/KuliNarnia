import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react'; 
import { Recipe } from '../models/recipe';
import NavBar from './NavBar';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Recipe[]>('http://localhost:5000/api/recipes')
      .then(response => {
        setRecipes(response.data);
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
