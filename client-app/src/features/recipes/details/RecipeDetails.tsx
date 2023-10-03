import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import RecipeDetailedHeader from './RecipeDetailedHeader';
import RecipeDetailedInfo from './RecipeDetailedInfo';
import RecipeDetailedComments from './RecipeDetailedComments';

export default observer (function RecipeDetails() {
  
  const {recipeStore} = useStore();
  const {selectedRecipe: recipe, loadRecipe, loadingInitial} = recipeStore;
  const {id} = useParams();

  useEffect(() => {
    if (id) loadRecipe(id).then(x => console.log(x));
  }, [id, loadRecipe])
  
  if (loadingInitial || !recipe) return <LoadingComponent/>;
  
  return (
    <Grid>
      <Grid.Column width={16}>
        <RecipeDetailedHeader recipe={recipe}/>
        <RecipeDetailedInfo recipe={recipe}/>
        <RecipeDetailedComments recipe={recipe}/>
      </Grid.Column>
    </Grid>
  )
})
