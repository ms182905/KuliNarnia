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

export default observer(function RecipeForm() {
    const { recipeStore, categoryStore, tagStore } = useStore();
    const { createRecipe, updateRecipe, loading, loadRecipe } = recipeStore;
    const { categoriesTable, loadCategories } = categoryStore;
    const { tagsTable, loadTags } = tagStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoriesList, setCategoriesList] = useState<{text: string, value: string}[]>([]);
    const [tagsList, setTagList] = useState<{text: string, value: string}[]>([]);


    const [recipe, setRecipe] = useState<Recipe>({
        id: '',
        title: '',
        categoryId: '',
        description: '',
        date: '',
        creatorId: '',
        ingredients: [],
        instructions: [],
        tags: []
    });

    useEffect( () => {
        if (categoriesTable.length > 0) {
            const tempCategories: {text: string, value: string}[] = [];
            categoriesTable.forEach(s => tempCategories.push({text: s.name.charAt(0).toUpperCase() + s.name.slice(1), value: s.id}));
            tempCategories.sort((a, b) => a.text.localeCompare(b.text));
            setCategoriesList(tempCategories);
        }
        if (tagsTable.length > 0) {
            const tempTags: {text: string, value: string}[] = [];
            categoriesTable.forEach(s => tempTags.push({text: s.name.charAt(0).toUpperCase() + s.name.slice(1), value: s.id}));
            tempTags.sort((a, b) => a.text.localeCompare(b.text));
            setTagList(tempTags);
        }
    }, [categoriesTable, tagsTable]);

    const validationSchema = Yup.object({
        title: Yup.string().required('The recipe title is required'),
        description: Yup.string().required('The recipe description is required'),
        categoryId: Yup.string().required(),
        //tags: Yup.array().nonNullable()
    });

    useEffect(() => {
        if (id) loadRecipe(id).then((recipe) => setRecipe(recipe!));
        if (categoriesList.length === 0) {
            loadCategories();
        }
        if (tagsList.length === 0) {
            loadTags();
        }
    }, [id, loadRecipe, categoriesList, loadCategories, tagsList, loadTags]);

    function handleFormSubmit(recipe: Recipe) {
        if (!recipe.id) {
            recipe.id = uuid();
            createRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
        } else {
            updateRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
        }
    }

    if (recipeStore.loadingInitial) return <LoadingComponent content="Loading recipe..." />;
    if (categoryStore.loadingInitial) return <LoadingComponent content="Loading categories..." />;
    if (tagStore.loadingInitial) return <LoadingComponent content="Loading tags..." />;

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
                        <MySelectInput placeholder="Category" name="categoryId" options={categoriesList} />
                        <MySelectInput placeholder="Tags" name="tags" options={tagsList} />
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
