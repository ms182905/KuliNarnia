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
import DeleteRecipeInstruction from './DeleteRecipeInstruction';

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
        text: Yup.string().matches(/^[^\s].*$/, 'Instruction cannot start with a space'),
    });

    useEffect(() => {
        if (recipeStore.selectedRecipe) setRecipe(recipeStore.selectedRecipe);
    }, [recipeStore.selectedRecipe]);

    function handleFormSubmit(instruction: Instruction) {
        console.log(instruction);
        instruction.id = uuid();

        const maxPosition = recipe.instructions.reduce((max, instruction) => {
            return instruction.position > max ? instruction.position : max;
        }, 0);

        instruction.position = maxPosition + 1;

        addRecipeInstruction(instruction);
    }

    return (
        <>
            {recipe.instructions.map((instruction) => (
                <Segment attached key={instruction.id}>
                <Grid>
                    <Grid.Row verticalAlign="middle" style={{ margin: '5px', padding: '4px' }}>
                        <Grid.Column width={2}>
                            <Segment textAlign="center" padded={false} style={{ margin: '2px', padding: '5px' }}>
                                Step {instruction.position}:
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={12} style={{ textAlign: 'center', maxWidth: '100%' }}>
                            <Segment textAlign="center" padded={false} style={{ margin: '2px', padding: '5px' }}>
                                {instruction.text}
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
                                        <DeleteRecipeInstruction recipeInstructionId={instruction.id} />
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
                                    <MyTextInput placeholder="Content" name="text" />
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
