import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import { Recipe } from '../../app/models/recipe';
import { useStore } from '../../app/stores/store';

interface Props {
    username: string;
}

export default observer(function RecipeDetailedComs({username} : Props) {
    const { commentStore, userStore } = useStore();
    const { userComments, userCommentsLoaded, loadUserComments } = commentStore;

    useEffect(() => {
        if (!userCommentsLoaded || commentStore.username.length === 0) loadUserComments(username);
    }, [userCommentsLoaded, loadUserComments, commentStore.username.length]);

    return (
        <>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                <Header>Your comments</Header>
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
                                <Comment key={s.id}>
                                    <Comment.Avatar src="/assets/user.png" />
                                    <Comment.Content>

                                        <Comment.Author as="a">{s.appUserDisplayName}</Comment.Author>


                                        <Comment.Metadata>
                                            <div>
                                                {s.date.substring(0, 10)} at {s.date.substring(11, 16)}
                                            </div>
                                        </Comment.Metadata>
                                        <Comment.Text>{s.text}</Comment.Text>
                                        {/* <Com.Actions>
                                    <Com.Action>Reply</Com.Action>
                                </Com.Actions> */}
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
