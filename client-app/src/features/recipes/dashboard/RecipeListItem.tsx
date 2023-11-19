import { observer } from 'mobx-react-lite';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';
import { Slide } from 'react-slideshow-image';

interface Props {
    recipe: Recipe;
}

export default observer(function RecipeListItem({ recipe }: Props) {
    return (
        <Segment.Group>
            <Segment>
                {recipe.photos?.length ? (
                    <Slide canSwipe={recipe.photos?.length > 1} arrows={recipe.photos?.length > 1} autoplay={recipe.photos?.length > 1} pauseOnHover={false}>
                        {recipe.photos.map((photo, index) => (
                            <div key={index} className="each-slide-effect">
                                <div style={{ backgroundImage: `url(${photo.url})` }}></div>
                            </div>
                        ))}
                    </Slide>
                ) : (
                    <Slide canSwipe={false} arrows={false} autoplay={false}>
                        <div className="each-slide-effect">
                            <div style={{ backgroundImage: `url('/assets/placeholder.png')` }}>
                                <span>No photos available</span>
                            </div>
                        </div>
                    </Slide>
                )}

                <Item.Group>
                    <Item>
                        {/* <Item.Image size="tiny" src={recipe.photos?.at(0)?.url || '/assets/placeholder.png'} /> */}
                        <Item.Content>
                            <Item.Header as={Link} to={`/recipes/${recipe.id}`}>
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
