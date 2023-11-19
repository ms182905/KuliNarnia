import { observer } from 'mobx-react-lite';
import { Grid, Icon, Item, Image, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
    index: number;
}

const IMAGE_HEIGHT = 400;

export default observer(function RecipeListItem({ recipe, index }: Props) {
    console.log(index);
    return (
        <Segment clearing attached="bottom" className={index % 2 === 0 ? 'even' : 'odd'}>
            <Grid>
                {index % 2 === 0 && (
                    <Grid.Column width={11} className="recipe-column">
                        {recipe.photos?.length ? (
                            <Image
                                src={recipe.photos[0].url}
                                fluid
                                style={{ height: `${IMAGE_HEIGHT}px` }}
                            />
                        ) : (
                            <Image
                                src={'/assets/placeholder.png'}
                                fluid
                                style={{ height: `${IMAGE_HEIGHT}px` }}
                            />
                        )}
                    </Grid.Column>
                )}

                <Grid.Column width={5} className="recipe-info-column">
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Item.Header as={Link} to={`/recipes/${recipe.id}`}>
                                    {recipe.title}
                                </Item.Header>
                                <Item.Description>
                                    Created by{' '}
                                    <Link to={`/userPage/${recipe.creatorName}`}>{recipe.creatorName}</Link>
                                </Item.Description>
                            </Item.Content>
                        </Item>
                    </Item.Group>

                    <span>
                        <Icon name="clock" /> {recipe.date}
                    </span>

                    <div className="recipe-description">{recipe.description}</div>
                </Grid.Column>

                {index % 2 !== 0 && (
                    <Grid.Column width={11} className="recipe-column">
                        {recipe.photos?.length ? (
                            <Image
                                src={recipe.photos[0].url}
                                fluid
                                style={{ height: `${IMAGE_HEIGHT}px` }}
                            />
                        ) : (
                            <Image
                                src={'/assets/placeholder.png'}
                                fluid
                                style={{ height: `${IMAGE_HEIGHT}px` }}
                            />
                        )}
                    </Grid.Column>
                )}
            </Grid>
        </Segment>
    );
});
