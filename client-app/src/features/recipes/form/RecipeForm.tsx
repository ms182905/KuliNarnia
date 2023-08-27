import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function RecipeForm() {
    
    const {recipeStore} = useStore();
    const {selectedRecipe, closeForm, createRecipe, updateRecipe, loading} = recipeStore;

    const initialState = selectedRecipe ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: ''
    }

    const [recipe, setRecipe] = useState(initialState);

    function handleSubmit() {
        recipe.id? updateRecipe(recipe) : createRecipe(recipe);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setRecipe({...recipe, [name]: value})
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={recipe.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' value={recipe.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={recipe.category} name='category' onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' value={recipe.date} name='date' onChange={handleInputChange}/>
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})