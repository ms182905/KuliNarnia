import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Header, Form, Button, Comment as Com } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

export default observer(function RecipeDetailedComs({ recipe }: Props) {
    return (
        <>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                <Header>Comment this recipe</Header>
            </Segment>
            <Segment attached>
                {recipe.comments !== undefined && recipe.comments.length !== 0 && (
                    <Com.Group size="large">
                        {recipe.comments
                            .slice()
                            .sort((a, b) => {
                                return new Date(a.date).getTime() - new Date(b.date).getTime();
                            })
                            .map((s, index) => (
                                <Com>
                                    <Com.Avatar src="/assets/user.png" />
                                    <Com.Content>
                                        <Com.Author as="a">{s.appUserDisplayName}</Com.Author>
                                        <Com.Metadata>
                                            <div>{s.date.substring(0, 10)} at {s.date.substring(11, 16)}</div>
                                        </Com.Metadata>
                                        <Com.Text>{s.text}</Com.Text>
                                        {/* <Com.Actions>
                                    <Com.Action>Reply</Com.Action>
                                </Com.Actions> */}
                                    </Com.Content>
                                </Com>
                            ))}
                    </Com.Group>
                )}
                {(recipe.comments === undefined || recipe.comments.length === 0) && (
                    <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                        No comments yet!
                    </Header>
                )}
                <Form reply>
                    <Form.TextArea />
                    <Button content="Add Comment" icon="edit" primary fluid />
                </Form>
            </Segment>
        </>
    );
});
