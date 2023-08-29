import { Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import RecipeListItem from './RecipeListItem';

export default observer(function RecipeList() {
    const { recipeStore } = useStore();
    const { recipes } = recipeStore;

    return (
        <Segment>
            <Item.Group divided>
                {recipes.map((recipe) => (
                    <RecipeListItem key={recipe.id} recipe={recipe} />
                ))}
            </Item.Group>
        </Segment>
    );
});
