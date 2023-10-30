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
import MyMultipleChoiceDropdownInput from '../../../app/common/form/MyMultipleChoiceDropdownInput';
import RecipeFormInstructions from './RecipeFormInstructions';
import RecipeFormIngredients from './RecipeFormIngredients';

export default observer(function RecipeForm() {
    const { recipeStore, categoryStore, tagStore, measurementStore } = useStore();
    const { createRecipe, updateRecipe, loading, loadRecipe } = recipeStore;
    const { categoriesTable, loadCategories } = categoryStore;
    const { tagsTable, loadTags } = tagStore;
    const { measurementsTable, loadMeasurements } = measurementStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoriesList, setCategoriesList] = useState<{ text: string; value: string }[]>([]);
    const [tagsList, setTagList] = useState<{ text: string; value: string; key: string }[]>([]);
    const [measurementsList, setMeasurementsList] = useState<{ text: string; value: string; key: string }[]>([]);

    const [recipe, setRecipe] = useState<Recipe>({
        id: '',
        title: '',
        categoryId: '',
        description: '',
        date: '',
        creatorId: '',
        ingredients: [],
        instructions: [],
        tags: [],
        tagIds: [],
        comments: [],
    });

    useEffect(() => {
        if (categoriesTable.length > 0) {
            const tempCategories: { text: string; value: string }[] = [];
            categoriesTable.forEach((s) =>
                tempCategories.push({ text: s.name.charAt(0).toUpperCase() + s.name.slice(1), value: s.id })
            );
            tempCategories.sort((a, b) => a.text.localeCompare(b.text));
            setCategoriesList(tempCategories);
        }
    }, [categoriesTable]);

    useEffect(() => {
        if (tagsTable.length > 0) {
            const tempTags: { text: string; value: string; key: string }[] = [];
            tagsTable.forEach((s) =>
                tempTags.push({ text: s.name.charAt(0).toUpperCase() + s.name.slice(1), value: s.id, key: s.name })
            );
            tempTags.sort((a, b) => a.text.localeCompare(b.text));
            setTagList(tempTags);
        }
    }, [tagsTable]);

    useEffect(() => {
        if (measurementsTable.length > 0) {
            const tempMeasurements: { text: string; value: string; key: string }[] = [];
            measurementsTable.forEach((s) =>
                tempMeasurements.push({
                    text: s.name.charAt(0).toUpperCase() + s.name.slice(1),
                    value: s.id,
                    key: s.name,
                })
            );
            tempMeasurements.sort((a, b) => a.text.localeCompare(b.text));
            setMeasurementsList(tempMeasurements);
        }
    }, [measurementsTable]);

    const primaryDataValidationSchema = Yup.object({
        title: Yup.string().required('The recipe title is required'),
        description: Yup.string().required('The recipe description is required'),
        categoryId: Yup.string().required(),
        tagIds: Yup.array().min(1),
    });

    useEffect(() => {
        if (id) {
            if (recipeStore.selectedRecipe?.id === id) setRecipe(recipeStore.selectedRecipe);
            else {
                loadRecipe(id).then((recipe) => {
                    console.log(recipe);
                    setRecipe(recipe!);
                });
            }
        }
        if (categoriesList.length < 1) {
            loadCategories();
        }
        if (tagsList.length < 1) {
            loadTags();
        }
        if (measurementsList.length < 1) {
            loadMeasurements();
        }
    }, [id, loadRecipe, categoriesList, loadCategories, tagsList, loadTags, measurementsList, loadMeasurements, recipeStore.selectedRecipe]);

    function handleFormSubmit(recipe: Recipe) {
        console.log(recipe);
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

    // TODO: add firm to confirm ingredient delete

    return (
        <Segment.Group>
            <Segment
                textAlign="center"
                attached="top"
                inverted
                color="red"
                style={{ border: 'none', borderRadius: '3px' }}
            >
                <Header>Primary data</Header>
            </Segment>
            <Segment clearing>
                <Header content="Recipe Details" sub color="teal" />
                <Formik
                    validationSchema={primaryDataValidationSchema}
                    enableReinitialize
                    initialValues={recipe}
                    onSubmit={(values) => handleFormSubmit(values)}
                >
                    {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                            <MyTextInput placeholder="Title" name="title" />
                            <MyTextArea placeholder="Description" name="description" rows={3} />
                            <MySelectInput placeholder="Category" name="categoryId" options={categoriesList} />
                            <MyMultipleChoiceDropdownInput placeholder="Tags" name="tagIds" options={tagsList} />
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={loading}
                                floated="right"
                                positive
                                type="submit"
                                content="Submit"
                            />
                            <Button as={Link} to="/recipes" floated="right" type="button" content="Cancel" />
                        </Form>
                    )}
                </Formik>
            </Segment>
            <Segment textAlign="center" inverted color="blue" style={{ border: 'none', borderRadius: '3px' }}>
                <Header>Ingredients</Header>
            </Segment>

            <RecipeFormIngredients/>

            
            <Segment textAlign="center" inverted color="violet" style={{ border: 'none', borderRadius: '3px' }}>
                <Header>Instructions</Header>
            </Segment>
            <RecipeFormInstructions/>
        </Segment.Group>
    );
});
