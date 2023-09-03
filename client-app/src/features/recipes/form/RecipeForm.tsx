import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from 'uuid';
import { Formik } from 'formik';

export default observer(function RecipeForm() {
    const { recipeStore } = useStore();
    const { createRecipe, updateRecipe, loading, loadRecipe, loadingInitial } = recipeStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState<Recipe>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
    });

    useEffect(() => {
        if (id) loadRecipe(id).then((recipe) => setRecipe(recipe!));
    }, [id, loadRecipe]);

    // function handleSubmit() {
    //     if (!recipe.id) {
    //         recipe.id = uuid();
    //         createRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
    //     } else {
    //         updateRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
    //     }
    // }

    // function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     const {name, value} = event.target;
    //     setRecipe({...recipe, [name]: value})
    // }

    if (loadingInitial) return <LoadingComponent content="Loading recipe..." />;

    return (
        <Segment clearing>
            <Formik enableReinitialize initialValues={recipe} onSubmit={(values) => console.log(values)}>
                {({ values: recipe, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <Form.Input
                            placeholder="Title"
                            value={recipe.title}
                            name="title"
                            onChange={handleChange}
                        />
                        <Form.TextArea
                            placeholder="Description"
                            value={recipe.description}
                            name="description"
                            onChange={handleChange}
                        />
                        <Form.Input
                            placeholder="Category"
                            value={recipe.category}
                            name="category"
                            onChange={handleChange}
                        />
                        <Form.Input
                            type="date"
                            placeholder="Date"
                            value={recipe.date}
                            name="date"
                            onChange={handleChange}
                        />
                        <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                        <Button as={Link} to="/recipes" floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});
