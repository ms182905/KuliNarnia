import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

export default observer(function ({ recipe }: Props) {
    const { recipeStore } = useStore();
    const { deleteRecipe, loading } = recipeStore;

    const [target, setTarget] = useState('');

    function handleRecipeDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteRecipe(id);
    }

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src="/assets/user.png" />
                        <Item.Content>
                            <Item.Header as={Link} to={`/recipes/${recipe.id}`}>
                                {recipe.title}
                            </Item.Header>
                            <Item.Description>Created by {recipe.creatorName}</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {recipe.date}
                </span>
            </Segment>
            {/* <Segment secondary>
                {recipe.description}
            </Segment> */}
            <Segment clearing>
                {recipe.description}
                <Button as={Link} to={`/recipes/${recipe.id}`} color="teal" floated="right" content="View" />
                <Button
                    name={recipe.id}
                    loading={loading && target === recipe.id}
                    onClick={(e) => handleRecipeDelete(e, recipe.id)}
                    floated="right"
                    content="Delete"
                    color="red"
                />
            </Segment>
        </Segment.Group>
    );
});
