import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Recipe } from '../models/recipe';
import NavBar from './NavBar';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axios.get<Recipe[]>('http://localhost:5000/api/recipes')
      .then(response => {
        setRecipes(response.data);
      })
  }, [])

  return (
    <>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        <RecipeDashboard recipes={recipes} />
      </Container>
    </>
  );
}

export default App;
