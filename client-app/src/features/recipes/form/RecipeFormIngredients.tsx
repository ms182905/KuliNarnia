import { useEffect, useState } from 'react';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Recipe } from '../../../app/models/recipe';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { Ingredient } from '../../../app/models/ingredient';
import DeleteRecipeIngredient from './DeleteRecipeIngredient';

export default observer(function RecipeFormIngredients() {
    const { recipeStore, measurementStore, modalStore } = useStore();
    const { measurementsTable } = measurementStore;
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

    const [ingredient] = useState<Ingredient>({
        id: '',
        name: '',
        amount: '',
        measurement: {
            id: '',
            name: '',
        },
    });

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

    useEffect(() => {
        if (recipeStore.selectedRecipe) setRecipe(recipeStore.selectedRecipe);
    }, [recipeStore.selectedRecipe]);

    const ingredientValidationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .matches(/^[^\s].*$/, 'Name cannot start with a space'),
        amount: Yup.number().required('Amount is required').typeError('Amount must be a number'),
        measurement: Yup.object({
            id: Yup.string().required('Measurement is required'),
        }),
    });

    function handleFormSubmit(ingredient: Ingredient) {
        console.log(ingredient);
        ingredient.id = uuid();
        ingredient.measurement.name = measurementsTable.find(
            (measurement) => measurement.id === ingredient.measurement.id
        )!.name;
        recipeStore.addRecipeIngredient(ingredient);
        setRecipe(recipeStore.selectedRecipe!);
    }

    return (
        <>
            {recipe.ingredients.map((ingredient) => (
                <Segment attached key={ingredient.id}>
                    <Grid>
                        <Grid.Row verticalAlign="middle" style={{ margin: '5px', padding: '4px' }}>
                            <Grid.Column width={2} />
                            <Grid.Column width={4}>
                                <Segment textAlign="center" padded={false} style={{ margin: '2px', padding: '5px' }}>
                                    {ingredient.name}
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Segment textAlign="center" padded={false} style={{ margin: '2px', padding: '5px' }}>
                                    {ingredient.amount}
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Segment textAlign="center" padded={false} style={{ margin: '2px', padding: '5px' }}>
                                    {ingredient.measurement.name}
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button
                                    fluid
                                    type="button"
                                    color="red"
                                    content="Delete"
                                    onClick={() =>
                                        modalStore.openModal(
                                            <DeleteRecipeIngredient recipeIngredientId={ingredient.id} />
                                        )
                                    }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            ))}

            <Segment clearing>
                <Formik
                    validationSchema={ingredientValidationSchema}
                    enableReinitialize
                    initialValues={ingredient}
                    onSubmit={(values, { resetForm }) => {
                        handleFormSubmit(values);
                        resetForm();
                    }}
                >
                    {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                            <Grid>
                                <Grid.Column width={2} />
                                <Grid.Column width={4}>
                                    <MyTextInput placeholder="Name" name="name" />
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <MyTextInput placeholder="Amount" name="amount" />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <MySelectInput
                                        placeholder="Measurement"
                                        name="measurement.id"
                                        options={measurementsList}
                                    />
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Button
                                        disabled={isSubmitting || !dirty || !isValid}
                                        floated="right"
                                        positive
                                        type="submit"
                                        content="Add"
                                        fluid
                                    />
                                </Grid.Column>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Segment>
        </>
    );
});
