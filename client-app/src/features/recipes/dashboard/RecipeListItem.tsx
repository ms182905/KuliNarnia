import { observer } from 'mobx-react-lite';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

export default observer(function ({ recipe }: Props) {
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
            </Segment>
        </Segment.Group>
    );
});
