import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from 'uuid';
import { Formik, Form, Field } from 'formik';

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
                {({ handleSubmit }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
                        <Field
                            placeholder="Title"
                            name="title"
                        />
                        <Field
                            placeholder="Description"
                            name="description"
                        />
                        <Field
                            placeholder="Category"
                            name="category"
                        />
                        <Field
                            type="date"
                            placeholder="Date"
                            name="date"
                        />
                        <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                        <Button as={Link} to="/recipes" floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});
