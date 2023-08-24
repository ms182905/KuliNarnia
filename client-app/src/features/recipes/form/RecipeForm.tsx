import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from "semantic-ui-react";
import { Recipe } from '../../../app/models/recipe';

interface Props{
    recipe: Recipe | undefined;
    closeForm: () => void;
    createOrEdit: (recipe: Recipe) => void;
}

export default function RecipeForm({recipe: selectedRecipe, closeForm, createOrEdit}: Props) {
    
    const initialState = selectedRecipe ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: ''
    }

    const [recipe, setRecipe] = useState(initialState);

    function handleSubmit() {
        createOrEdit(recipe);
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
                <Form.Input placeholder='Date' value={recipe.date} name='date' onChange={handleInputChange}/>
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}