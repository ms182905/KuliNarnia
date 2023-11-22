import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Segment, Form, Button, Comment as Com } from 'semantic-ui-react';
import { Recipe } from '../../../../app/models/recipe';
import { RecipeComment } from '../../../../app/models/comment';
import { useStore } from '../../../../app/stores/store';
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid';
import MyTextArea from '../../../../app/common/form/MyTextArea';
import DeleteRecipeComment from '../../../../app/common/modals/DeleteRecipeComment';
import LoginOrRegister from '../../../../app/common/modals/LoginOrRegister';

interface Props {
    recipe: Recipe;
}

export default observer(function RecipeDetailedComments({ recipe: rec }: Props) {
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
        appUserPhotoUrl: user?.photoUrl,
    });

    return (
        <>
            <div className="card__content" style={{ display: 'block', padding: '14px' }}>
                <h2 style={{ textAlign: 'center', padding: '0.2em' }}>Comment this recipe</h2>
                <div
                    className="card__content"
                    style={{
                        gridTemplateAreas: "'text'",
                        textAlign: 'center',
                        gridTemplateColumns: '1fr',
                        width: '100%',
                    }}
                >
                    <Segment
                        attached
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            width: '90%',
                            fontFamily: 'Andale Mono, monospace',
                        }}
                    >
                        {recipe.comments !== undefined && recipe.comments.length !== 0 ? (
                            <Com.Group size="large">
                                {recipe.comments
                                    .slice()
                                    .sort((a, b) => {
                                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                                    })
                                    .map((s) => (
                                        <Com key={s.id}>
                                            <Com.Avatar src={s.appUserPhotoUrl? s.appUserPhotoUrl : "/assets/user.png"} />
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
                            <h2 style={{ textAlign: 'center', width: '100%' }}>No comments yet!</h2>
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
                                <Form
                                    className="ui form"
                                    onSubmit={handleSubmit}
                                    autoComplete="off"
                                    style={{ width: '100%' }}
                                >
                                    <MyTextArea placeholder="Type your comment here!" name="text" rows={2} />
                                    <Button
                                        className="positiveButton"
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
                </div>
            </div>
        </>
    );
});
