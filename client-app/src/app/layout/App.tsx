import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';
import { Recipe } from '../models/recipe';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axios.get<Recipe[]>('http://localhost:5000/api/recipes')
      .then(response => {
        setRecipes(response.data);
      })
  }, [])

  return (
    <div>
      <Header as='h2' icon='users' content='KuliNarnia' />
        <List>
        {recipes.map(recipe => (
          <List.Item key={recipe.id}>
            {recipe.title}
          </List.Item>
        ))}
        </List>
    </div>
  );
}

export default App;
