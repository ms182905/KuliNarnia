import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Segment, Header, Form, Button, Comment as Com } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';
import { RecipeComment } from '../../../app/models/comment';
import { useStore } from '../../../app/stores/store';
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid';
import MyTextArea from '../../../app/common/form/MyTextArea';
import DeleteRecipeComment from '../form/DeleteRecipeComment';
import LoginOrRegister from '../../../app/common/modals/LoginOrRegister';

interface Props {
    recipe: Recipe;
}

export default observer(function RecipeDetailedComs({ recipe: rec }: Props) {
    const { recipeStore, userStore, modalStore } = useStore();
    const { addRecipeComment } = recipeStore;
    const { openModal } = modalStore;
    const { user } = userStore;

    const [recipe] = useState<Recipe>(rec);

    const [comment] = useState<RecipeComment>({
        id: '',
        text: '',
        date: '',
        appUserDisplayName: '',
        recipeId: recipe.id,
    });

    return (
        <>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                <Header>Comment this recipe</Header>
            </Segment>
            <Segment attached>
                {recipe.comments !== undefined && recipe.comments.length !== 0 ? (
                    <Com.Group size="large">
                        {recipe.comments
                            .slice()
                            .sort((a, b) => {
                                return new Date(a.date).getTime() - new Date(b.date).getTime();
                            })
                            .map((s) => (
                                <Com key={s.id}>
                                    <Com.Avatar src="/assets/user.png" />
                                    <Com.Content>
                                        {s.appUserDisplayName === user?.displayName && (
                                            <Com.Author as="a" style={{ color: 'red' }}>
                                                {s.appUserDisplayName} (You)
                                            </Com.Author>
                                        )}
                                        {s.appUserDisplayName !== user?.displayName && (
                                            <Com.Author as="a">{s.appUserDisplayName}</Com.Author>
                                        )}

                                        <Com.Metadata>
                                            <div>
                                                {s.date.substring(0, 10)} at {s.date.substring(11, 16)}
                                            </div>
                                        </Com.Metadata>
                                        <Com.Text>{s.text}</Com.Text>
                                        {/* <Com.Actions>
                                    <Com.Action>Reply</Com.Action>
                                </Com.Actions> */}
                                        {s.appUserDisplayName === user?.displayName && (
                                            <Com.Actions>
                                                <Com.Action
                                                    value={s.id}
                                                    onClick={() =>
                                                        modalStore.openModal(
                                                            <DeleteRecipeComment recipeCommentId={s.id} />
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Com.Action>
                                            </Com.Actions>
                                        )}
                                    </Com.Content>
                                </Com>
                            ))}
                    </Com.Group>
                ) : (
                    <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                        No comments yet!
                    </Header>
                )}

                <Formik
                    validationSchema={undefined}
                    enableReinitialize
                    initialValues={comment}
                    onSubmit={(comment, { resetForm }) => {
                        if (user) {
                            comment.appUserDisplayName = user.displayName;
                            comment.date = new Date().toISOString();
                            comment.id = uuid();
                            addRecipeComment(comment);
                            resetForm();
                        } else {
                            openModal(<LoginOrRegister />);
                        }
                    }}
                >
                    {({ handleSubmit, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                            <MyTextArea placeholder="Type your comment here!" name="text" rows={2} />
                            <Button
                                disabled={!dirty}
                                content="Add Comment"
                                icon="edit"
                                primary
                                fluid
                                positive
                                type="submit"
                            />
                        </Form>
                    )}
                </Formik>
            </Segment>
        </>
    );
});
