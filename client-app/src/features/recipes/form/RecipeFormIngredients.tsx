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
import DeleteRecipeIngredient from '../../../app/common/modals/DeleteRecipeIngredient';

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
            .required('Nazwa jest wymagana')
            .matches(/^[^\s].*$/, 'Nazwa nie może zaczynać się od spacji'),
        amount: Yup.number().required('Ilość jest wymagana').typeError('Ilość musi być liczbą'),
        measurement: Yup.object({
            id: Yup.string().required('Miara jest wymagana'),
        }),
    });

    function handleFormSubmit(ingredient: Ingredient) {
        ingredient.id = uuid();
        ingredient.measurement.name = measurementsTable.find(
            (measurement) => measurement.id === ingredient.measurement.id
        )!.name;
        recipeStore.addRecipeIngredient(ingredient);
        setRecipe(recipeStore.selectedRecipe!);
    }

    return (
        <>
            <div className="card__content" style={{ display: 'block', padding: '14px', overflow: 'visible' }}>
                <h2 style={{ textAlign: 'center', padding: '0.2em' }}>Składniki</h2>
                <div
                    className="card__content"
                    style={{
                        gridTemplateAreas: "'text'",
                        textAlign: 'center',
                        gridTemplateColumns: '1fr',
                        width: '100%',
                        overflow: 'visible',
                    }}
                >
                    <Segment
                        attached
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            width: '90%',
                            fontFamily: 'Andale Mono, monospace',
                            overflow: 'visible',
                        }}
                    >
                        <Segment
                            clearing
                            style={{ width: '100%', border: 'none', boxShadow: 'none', wordWrap: 'break-word' }}
                        >
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
                                    <Form
                                        className="ui form"
                                        onSubmit={handleSubmit}
                                        autoComplete="off"
                                        style={{ width: '100%' }}
                                    >
                                        <Grid>
                                            <Grid.Column style={{ width: '40%' }}>
                                                <MyTextInput placeholder="Nazwa" name="name" />
                                            </Grid.Column>
                                            <Grid.Column style={{ width: '20%' }}>
                                                <MyTextInput placeholder="Ilość" name="amount" />
                                            </Grid.Column>
                                            <Grid.Column style={{ width: '40%' }}>
                                                <MySelectInput
                                                    placeholder="Miara"
                                                    name="measurement.id"
                                                    options={measurementsList}
                                                />
                                            </Grid.Column>

                                            <Button
                                                disabled={isSubmitting || !dirty || !isValid}
                                                floated="right"
                                                positive
                                                className="positiveButton"
                                                type="submit"
                                                style={{
                                                    width: '97%',
                                                    marginLeft: 'auto',
                                                    marginRight: 'auto',
                                                    marginBottom: '1em',
                                                }}
                                            >
                                                Dodaj
                                            </Button>
                                        </Grid>
                                    </Form>
                                )}
                            </Formik>
                        </Segment>
                    </Segment>
                </div>
                {recipe.ingredients.length > 0 && (
                    <div
                        className="card__content"
                        style={{
                            gridTemplateAreas: "'text'",
                            textAlign: 'center',
                            gridTemplateColumns: '1fr',
                            width: '100%',
                            overflow: 'visible',
                        }}
                    >
                        <Segment
                            style={{
                                border: 'none',
                                boxShadow: 'none',
                                width: '90%',
                                fontFamily: 'Andale Mono, monospace',
                                overflow: 'visible',
                                gap: '0.5em',
                            }}
                        >
                            {recipe.ingredients.map((ingredient) => (
                                <Segment
                                    key={ingredient.id}
                                    style={{
                                        width: '100%',
                                        borderRadius: '1em',
                                        marginBottom: '1em',
                                        paddingTop: '0.5em',
                                        wordWrap: 'break-word',
                                    }}
                                >
                                    <Grid>
                                        <Grid.Column style={{ width: '40%' }}>
                                            <Segment
                                                textAlign="center"
                                                style={{
                                                    margin: '2px',
                                                    padding: '5px',
                                                    borderRadius: '0.67em',
                                                    fontSize: '1.5em',
                                                }}
                                            >
                                                {ingredient.name}
                                            </Segment>
                                        </Grid.Column>
                                        <Grid.Column style={{ width: '20%' }}>
                                            <Segment
                                                textAlign="center"
                                                style={{
                                                    margin: '2px',
                                                    padding: '5px',
                                                    borderRadius: '0.67em',
                                                    fontSize: '1.5em',
                                                }}
                                            >
                                                {ingredient.amount}
                                            </Segment>
                                        </Grid.Column>
                                        <Grid.Column style={{ width: '40%' }}>
                                            <Segment
                                                textAlign="center"
                                                style={{
                                                    margin: '2px',
                                                    padding: '5px',
                                                    borderRadius: '0.67em',
                                                    fontSize: '1.5em',
                                                }}
                                            >
                                                {ingredient.measurement.name}
                                            </Segment>
                                        </Grid.Column>

                                        <Button
                                            fluid
                                            type="button"
                                            color="red"
                                            content="Usuń"
                                            className="negativeButton"
                                            style={{
                                                width: '97%',
                                                marginLeft: 'auto',
                                                marginRight: 'auto',
                                                marginBottom: '1em',
                                            }}
                                            onClick={() =>
                                                modalStore.openModal(
                                                    <DeleteRecipeIngredient recipeIngredientId={ingredient.id} />
                                                )
                                            }
                                        />
                                    </Grid>
                                </Segment>
                            ))}
                        </Segment>
                    </div>
                )}
            </div>
        </>
    );
});
