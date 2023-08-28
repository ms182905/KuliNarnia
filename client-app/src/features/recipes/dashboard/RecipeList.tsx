import React, { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

export default observer(function RecipeList() {
    const {recipeStore} = useStore();
    const {deleteRecipe, recipes, loading} = recipeStore;
    
    const [target, setTarget] = useState('');

    function handleRecipeDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteRecipe(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {recipes.map((recipe) => (
                    <Item key={recipe.id}>
                        <Item.Content>
                            <Item.Header as="a">{recipe.title}</Item.Header>
                            <Item.Meta>{recipe.date}</Item.Meta>
                            <Item.Description>
                                <div>{recipe.description}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    as={Link}
                                    to={`/recipes/${recipe.id}`}
                                    floated="right"
                                    content="View"
                                    color="blue"
                                />
                                <Button
                                    name={recipe.id}
                                    loading={loading && target === recipe.id}
                                    onClick={(e) => handleRecipeDelete(e, recipe.id)}
                                    floated="right"
                                    content="Delete"
                                    color="red"
                                />
                                <Label basic content={recipe.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
})
