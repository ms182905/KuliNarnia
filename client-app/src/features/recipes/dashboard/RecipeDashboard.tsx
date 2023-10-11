import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeFilters from './RecipeFilters';

export default observer(function RecipeDashboard() {
    const {recipeStore} = useStore();
    const {loadRecipes, recipeRegistry} = recipeStore;
    
    useEffect(() => {
      if (recipeRegistry.size <= 1) loadRecipes();
    }, [loadRecipes, recipeRegistry.size])
  
    if (recipeStore.loadingInitial) return <LoadingComponent content='Loading recipes...'/>
  
    return (
        <Grid>
            <Grid.Column width='16'>
            {/* </Grid.Column>
            <Grid.Column width='6'> */}
            <RecipeFilters />
            <RecipeList />
            </Grid.Column>
        </Grid>
    );
})
