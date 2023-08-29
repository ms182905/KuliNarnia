import { Header, Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import RecipeListItem from './RecipeListItem';
import { Fragment } from 'react';

export default function RecipeList() {
    const { recipeStore } = useStore();
    const { groupedRecipes } = recipeStore;

    return (
        <>
            {groupedRecipes.map(([group, recipes]) => (
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>
                    <Segment>
                        <Item.Group divided>
                            {recipes.map(recipe => (
                                <RecipeListItem key={recipe.id} recipe={recipe} />
                            ))}
                        </Item.Group>
                    </Segment>
                    
                </Fragment>
            ))}
        </>
    )
}
