import { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../../../app/models/recipe';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';

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

    const validationSchema = Yup.object({
        title: Yup.string().required('The recipe title is required'),
        description: Yup.string().required('The recipe description is required'),
        category: Yup.string().required(),
    });

    useEffect(() => {
        if (id) loadRecipe(id).then((recipe) => setRecipe(recipe!));
    }, [id, loadRecipe]);

    function handleFormSubmit(recipe: Recipe) {
        if (!recipe.id) {
            recipe.id = uuid();
            createRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
        } else {
            updateRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
        }
    }

    if (loadingInitial) return <LoadingComponent content="Loading recipe..." />;

    return (
        <Segment clearing>
            <Header content='Recipe Details' sub color='teal' /> 
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={recipe}
                onSubmit={(values) => handleFormSubmit(values)}
            >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput placeholder="Title" name="title" />
                        <MyTextArea placeholder="Description" name="description" rows={3} />
                        <MySelectInput placeholder="Category" name="category" options={categoryOptions} />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading}
                            floated="right"
                            positive type="submit" 
                            content="Submit" />
                        <Button as={Link} to="/recipes" floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});
