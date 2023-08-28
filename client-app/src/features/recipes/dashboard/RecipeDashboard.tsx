import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function RecipeDashboard() {
    const {recipeStore} = useStore();
    const {loadRecipes, recipeRegistry} = recipeStore;
    
    useEffect(() => {
      if (recipeRegistry.size <= 1) loadRecipes();
    }, [loadRecipes, recipeRegistry.size])
  
    if (recipeStore.loadingInitial) return <LoadingComponent content='Loading app'/>
  
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Recipe filters</h2>
            </Grid.Column>
        </Grid>
    );
})
