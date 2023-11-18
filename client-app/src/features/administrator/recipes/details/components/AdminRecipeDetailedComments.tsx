import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Segment, Header, Comment as Com } from 'semantic-ui-react';
import DeleteRecipeComment from '../../../../../app/common/modals/DeleteRecipeComment';
import { Recipe } from '../../../../../app/models/recipe';
import { useStore } from '../../../../../app/stores/store';

interface Props {
    recipe: Recipe;
}

export default observer(function RecipeDetailedComments({ recipe: rec }: Props) {
    const { modalStore } = useStore();

    const [recipe] = useState<Recipe>(rec);

    return (
        <>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                <Header>Recipe comments</Header>
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
                                        <Com.Author as="a">{s.appUserDisplayName}</Com.Author>

                                        <Com.Metadata>
                                            <div>
                                                {s.date.substring(0, 10)} at {s.date.substring(11, 16)}
                                            </div>
                                        </Com.Metadata>
                                        <Com.Text>{s.text}</Com.Text>
                                        <Com.Actions>
                                            <Com.Action
                                                value={s.id}
                                                onClick={() =>
                                                    modalStore.openModal(<DeleteRecipeComment recipeCommentId={s.id} />)
                                                }
                                            >
                                                Delete
                                            </Com.Action>
                                        </Com.Actions>
                                    </Com.Content>
                                </Com>
                            ))}
                    </Com.Group>
                ) : (
                    <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                        No comments yet!
                    </Header>
                )}
            </Segment>
        </>
    );
});
