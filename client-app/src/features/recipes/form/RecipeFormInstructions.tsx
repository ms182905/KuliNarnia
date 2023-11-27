import { useEffect, useState } from 'react';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Recipe } from '../../../app/models/recipe';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { Instruction } from '../../../app/models/instruction';
import DeleteRecipeInstruction from '../../../app/common/modals/DeleteRecipeInstruction';

export default observer(function RecipeFormInstructions() {
    const { recipeStore, modalStore } = useStore();
    const { addRecipeInstruction } = recipeStore;

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

    const [instruction] = useState<Instruction>({
        id: '',
        text: '',
        position: 0,
    });

    const instructionValidationSchema = Yup.object({
        text: Yup.string().matches(/^[^\s].*$/, 'Instrukcja nie może zaczynać się od spacji'),
    });

    useEffect(() => {
        if (recipeStore.selectedRecipe) setRecipe(recipeStore.selectedRecipe);
    }, [recipeStore.selectedRecipe]);

    function handleFormSubmit(instruction: Instruction) {
        instruction.id = uuid();

        const maxPosition = recipe.instructions.reduce((max, instruction) => {
            return instruction.position > max ? instruction.position : max;
        }, 0);

        instruction.position = maxPosition + 1;

        addRecipeInstruction(instruction);
    }

    return (
        <>
            <div className="card__content" style={{ display: 'block', padding: '14px', overflow: 'visible' }}>
                <h2 style={{ textAlign: 'center', padding: '0.2em' }}>Instrukcje</h2>
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
                        <Segment clearing style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
                            <Formik
                                validationSchema={instructionValidationSchema}
                                enableReinitialize
                                initialValues={instruction}
                                onSubmit={(values, { resetForm }) => {
                                    handleFormSubmit(values);
                                    resetForm();
                                }}
                            >
                                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                                        <Grid>
                                            <Grid.Column width={14}>
                                                <MyTextInput placeholder="Instrukcja" name="text" />
                                            </Grid.Column>
                                            <Grid.Column width={2}>
                                                <Button
                                                    disabled={isSubmitting || !dirty || !isValid}
                                                    floated="right"
                                                    positive
                                                    type="submit"
                                                    fluid
                                                    className="positiveButton"
                                                >
                                                    Dodaj
                                                </Button>
                                            </Grid.Column>
                                        </Grid>
                                    </Form>
                                )}
                            </Formik>
                        </Segment>
                    </Segment>
                </div>
                {recipe.instructions.length > 0 && (
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
                            {recipe.instructions.map((instruction) => (
                                <Segment
                                    key={instruction.id}
                                    style={{
                                        width: '100%',
                                        borderRadius: '1em',
                                        marginBottom: '1em',
                                        paddingTop: '0.5em',
                                    }}
                                >
                                    <Grid>
                                        <Grid.Row verticalAlign="middle" style={{ margin: '5px', padding: '4px' }}>
                                            <Grid.Column width={2}>
                                                <Segment
                                                    textAlign="center"
                                                    padded={false}
                                                    style={{
                                                        margin: '2px',
                                                        padding: '5px',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                    }}
                                                >
                                                    Krok {instruction.position}:
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column
                                                width={12}
                                                style={{
                                                    textAlign: 'center',
                                                    maxWidth: '100%',
                                                    marginTop: '1em',
                                                    marginBottom: '1em',
                                                }}
                                            >
                                                <Segment
                                                    textAlign="center"
                                                    padded={false}
                                                    style={{
                                                        margin: '2px',
                                                        padding: '5px',
                                                        borderRadius: '0.67em',
                                                        fontSize: '1.5em',
                                                    }}
                                                >
                                                    {instruction.text}
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column width={2}>
                                                <Button
                                                    fluid
                                                    type="button"
                                                    color="red"
                                                    className="negativeButton"
                                                    onClick={() =>
                                                        modalStore.openModal(
                                                            <DeleteRecipeInstruction
                                                                recipeInstructionId={instruction.id}
                                                            />
                                                        )
                                                    }
                                                >
                                                    Usuń
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
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
