import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Item, Segment } from 'semantic-ui-react';
import { Recipe } from '../../../../app/models/recipe';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../app/stores/store';
import { toast } from 'react-toastify';
import RemoveRecipeFromFavourites from '../../../../app/common/modals/RemoveRecipeFromFavourites';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const recipeImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white',
};

interface Props {
    recipe: Recipe;
    editable: boolean;
}

export default observer(function RecipeDetailedHeader({ recipe, editable }: Props) {
    const { modalStore, favouriteRecipesStore, userStore } = useStore();
    const { loading, addRecipeToFavourites } = favouriteRecipesStore;

    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: '0' }}>
                <Slide>
                    {recipe.photos?.length ? (
                        recipe.photos.map((photo, index) => (
                            <div key={index} className="each-slide-effect">
                                <div style={{ backgroundImage: `url(${photo.url})` }}></div>
                            </div>
                        ))
                    ) : (
                        <div className="each-slide-effect">
                            <div style={{ backgroundImage: `url('/assets/placeholder.png')` }}>
                                <span>No photos available</span>
                            </div>
                        </div>
                    )}
                </Slide>
                {/* <Image src="/assets/placeholder.png" fluid style={recipeImageStyle} /> */}
                <Segment style={recipeImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header size="huge" content={recipe.title} style={{ color: 'white' }} />
                                <p>{recipe.date}</p>
                                <p>
                                    Created by <strong>{recipe.creatorName}</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached="bottom">
                {recipe.inFavourites ? (
                    <Button
                        content="Remove from favourites"
                        color="red"
                        loading={loading}
                        onClick={() => modalStore.openModal(<RemoveRecipeFromFavourites recipe={recipe} />)}
                    />
                ) : (
                    <Button
                        color="green"
                        content="Add to favourites"
                        loading={loading}
                        onClick={() => {
                            addRecipeToFavourites(recipe);
                            toast.success('Recipe added to favourites!');
                        }}
                    />
                )}
                {editable && userStore.user?.displayName === recipe.creatorName ? (
                    <Button as={Link} to={`/manage/${recipe.id}`} color="orange" floated="right">
                        Manage Recipe
                    </Button>
                ) : (
                    <></>
                )}
            </Segment>
        </Segment.Group>
    );
});
