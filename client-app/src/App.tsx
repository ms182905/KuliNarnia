import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes')
      .then(response => {
        console.log(response);
        setRecipes(response.data);
      })
  }, [])

  return (
    <div>
      <Header as='h2' icon='users' content='KuliNarnia' />
        <List>
        {recipes.map((recipe: any) => (
          <List.Item key={recipe.id}>
            {recipe.title}
          </List.Item>
        ))}
        </List>
    </div>
  );
}

export default App;
