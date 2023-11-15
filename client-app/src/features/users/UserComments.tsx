import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { Link } from 'react-router-dom';

interface Props {
    username: string;
}

export default observer(function RecipeDetailedComments({ username }: Props) {
    const { commentStore, userStore } = useStore();
    const { userComments, userCommentsLoaded, loadUserComments } = commentStore;

    useEffect(() => {
        if (!userCommentsLoaded || commentStore.username !== username) loadUserComments(username);
    }, [userCommentsLoaded, loadUserComments, commentStore.username, username]);

    return (
        <>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                {userStore.user?.username === username ? (
                    <Header>Your recently added comments</Header>
                ) : (
                    <Header>{username}`s recently added comments</Header>
                )}
            </Segment>
            <Segment attached>
                {userComments.length !== 0 ? (
                    <Comment.Group size="large">
                        {userComments
                            .slice()
                            .sort((a, b) => {
                                return new Date(a.date).getTime() - new Date(b.date).getTime();
                            })
                            .map((s) => (
                                <Comment as={Link} to={`/recipes/${s.recipeId}`} key={s.id}>
                                    <Comment.Avatar src="/assets/user.png" />
                                    <Comment.Content>
                                        <Comment.Author >{s.appUserDisplayName}</Comment.Author>

                                        <Comment.Metadata>
                                            <div>
                                                {s.date.substring(0, 10)} at {s.date.substring(11, 16)}
                                            </div>
                                        </Comment.Metadata>
                                        <Comment.Text>{s.text}</Comment.Text>
                                    </Comment.Content>
                                </Comment>
                            ))}
                    </Comment.Group>
                ) : (
                    <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                        No comments yet!
                    </Header>
                )}
            </Segment>
        </>
    );
});
