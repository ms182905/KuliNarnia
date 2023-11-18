import { observer } from 'mobx-react-lite';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Recipe } from '../../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

export default observer(function AdminRecipeListItem({ recipe }: Props) {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src={recipe.photos?.at(0)?.url || '/assets/placeholder.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/adminRecipes/${recipe.id}`}>
                                {recipe.title}
                            </Item.Header>
                            <Item.Description>
                                Created by <Link to={`/userPage/${recipe.creatorName}`}>{recipe.creatorName}</Link>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {recipe.date}
                </span>
            </Segment>
            <Segment clearing>
                {recipe.description}
                <Button as={Link} to={`/adminRecipes/${recipe.id}`} color="teal" floated="right" content="View" />
            </Segment>
        </Segment.Group>
    );
});
