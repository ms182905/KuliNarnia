import { observer } from 'mobx-react-lite';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';
import { SyntheticEvent, useState } from 'react';
import RemoveUserRecipe from './RemoveUserRecipe';
import { useStore } from '../../../app/stores/store';

interface Props {
    recipe: Recipe;
}

export default observer(function UserRecipesListItem({ recipe }: Props) {
    const { modalStore, userRecipesStore } = useStore();
    const { loading } = userRecipesStore;
    const [target, setTarget] = useState('');

    function handleRecipeDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        modalStore.openModal(<RemoveUserRecipe recipeId={id} />);
    }

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src="/assets/placeholder.png" />
                        <Item.Content>
                            <Item.Header as={Link} to={`/recipes/${recipe.id}`}>
                                {recipe.title}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {recipe.date}
                </span>
            </Segment>
            {/* <Segment secondary>
                {recipe.description}
            </Segment> */}
            <Segment clearing>
                {recipe.description}
                <Button as={Link} to={`/recipes/${recipe.id}/true`} color="teal" floated="right" content="View" />
                <Button
                    name={recipe.id}
                    loading={loading && target === recipe.id}
                    onClick={(e) => handleRecipeDelete(e, recipe.id)}
                    floated="right"
                    content="Delete recipe"
                    color="red"
                />
            </Segment>
        </Segment.Group>
    );
});
