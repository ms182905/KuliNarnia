import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react';
import { Recipe } from '../../../../app/models/recipe';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../app/stores/store';
import { toast } from 'react-toastify';
import RemoveRecipeFromFavourites from '../../favouriteRecipes/RemoveRecipeFromFavourites';

const recipeImageStyle = {
    filter: 'brightness(30%)',
};

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
                <Image src="/assets/placeholder.png" fluid style={recipeImageStyle} />
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
