import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react'; 
import NavBar from './NavBar';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {recipeStore} = useStore();

  useEffect(() => {
    recipeStore.loadRecipes();
  }, [recipeStore])

  if (recipeStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <RecipeDashboard />
      </Container>
    </>
  );
}

export default observer(App);
