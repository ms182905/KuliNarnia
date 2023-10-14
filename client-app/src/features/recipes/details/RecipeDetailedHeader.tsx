import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';
import { Link } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import { toast } from 'react-toastify';
import RemoveRecipeFromFavourites from '../favourites/RemoveRecipeFromFavourites';

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
}

export default observer(function RecipeDetailedHeader({ recipe }: Props) {
    const { recipeStore, modalStore } = useStore();
    const { loading, addRecipeToFavourites } = recipeStore;

    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: '0' }}>
                <Image src={`/assets/categoryImages/${recipe.categoryName}.jpg`} fluid style={recipeImageStyle} />
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
                        onClick={() => modalStore.openModal(<RemoveRecipeFromFavourites recipeId={recipe.id} />)}
                    />
                ) : (
                    <Button
                        color="green"
                        content="Add to favourites"
                        loading={loading}
                        onClick={() => {
                            addRecipeToFavourites(recipe.id);
                            toast.success('Recipe added to favourites!');
                        }}
                    />
                )}
                <Button as={Link} to={`/manage/${recipe.id}`} color="orange" floated="right">
                    Manage Recipe
                </Button>
            </Segment>
        </Segment.Group>
    );
});
