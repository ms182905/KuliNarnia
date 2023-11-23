import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Segment, Comment as Com } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
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
        <div className="card__content" style={{ display: 'block', padding: '14px', marginTop: '0.5em' }}>
            <h2 style={{ textAlign: 'center', padding: '0.2em' }}>
                {userStore.user?.username === username
                    ? 'Your recently added comments'
                    : `${username}s recently added comments`}
            </h2>
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
                    {userComments !== undefined && userComments.length !== 0 ? (
                        <Com.Group size="large">
                            {userComments
                                .slice()
                                .sort((a, b) => {
                                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                                })
                                .map((s, index) => (
                                    <Com as={Link} to={`/recipes/${s.recipeId}`} key={index}>
                                        <Com.Avatar src={s.appUserPhotoUrl ? s.appUserPhotoUrl : '/assets/user.png'} />
                                        <Com.Content style={{ paddingBottom: '0.5em' }}>
                                            <Com.Author style={{}}>{s.appUserDisplayName}</Com.Author>

                                            <Com.Metadata>
                                                <div>
                                                    {s.date.substring(0, 10)} at {s.date.substring(11, 16)}
                                                </div>
                                            </Com.Metadata>
                                            <Com.Text>{s.text}</Com.Text>
                                        </Com.Content>
                                    </Com>
                                ))}
                        </Com.Group>
                    ) : (
                        <h2
                            style={{
                                textAlign: 'center',
                                width: '100%',
                                fontSize: '2em',
                                fontFamily: 'Andale Mono, monospace',
                            }}
                        >
                            No comments yet!
                        </h2>
                    )}
                </Segment>
            </div>
        </div>
    );
});
