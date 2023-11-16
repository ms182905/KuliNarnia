import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Header, Icon, Item, Segment, Image as Img, Button, Divider } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';
import PhotoUploadWidget from '../../../app/common/imageUpload/PhotoUploadWidget';

interface Props {
    username: string;
}

export default observer(function AnotherUserRecipeDashboard({ username }: Props) {
    const { userRecipesStore, userStore } = useStore();
    const { loadAnotherUserRecipes, anotherUserRecipes, anotherUserProfilePhotoUrl } = userRecipesStore;

    const [editPhotoMode, setEditPhotoMode] = useState(false);

    useEffect(() => {
        if (userRecipesStore.anotherUserUsername !== username) loadAnotherUserRecipes(username);
    }, [loadAnotherUserRecipes, userRecipesStore.anotherUserUsername, username]);

    function handlePhotoUpload(file: Blob) {
        userStore.uploadPhoto(file);
    }

    return (
        <>
            <Segment textAlign="center">
                {userStore.user?.username === username ? (
                    <Button
                        color="teal"
                        onClick={() => setEditPhotoMode(true)}
                        style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                    >
                        <Icon name="edit" style={{ marginRight: '8px' }} />
                        Edit Photo
                    </Button>
                ) : (
                    <></>
                )}

                <Img
                    size="medium"
                    circular
                    centered
                    src={anotherUserProfilePhotoUrl ? anotherUserProfilePhotoUrl : '/assets/user.png'}
                />
                <Header as="h1">{username}</Header>
                {editPhotoMode ? (
                    <>
                        <Divider horizontal>
                            <Header as="h4">
                                <Icon name="edit" />
                                Edit profile photo
                            </Header>
                        </Divider>
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={userStore.photoUploading} ratio={1}/>
                        <Button color="red" onClick={() => setEditPhotoMode(false)} fluid style={{ marginTop: '8px' }}>
                            <Icon name="cancel" />
                            Cancel
                        </Button>
                    </>
                ) : (
                    <></>
                )}
            </Segment>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                {userStore.user?.username === username ? (
                    <Header>Your recently added recipes</Header>
                ) : (
                    <Header>{username}`s recently added recipes</Header>
                )}
            </Segment>
            <Segment attached>
                {anotherUserRecipes.length !== 0 ? (
                    <>
                        <Segment.Group>
                            {anotherUserRecipes.map((recipe) => (
                                <>
                                    <Segment>
                                        <Item.Group>
                                            <Item>
                                                <Item.Image
                                                    size="tiny"
                                                    circular
                                                    src={recipe.photos?.at(0)?.url || '/assets/placeholder.png'}
                                                />
                                                <Item.Content>
                                                    <Item.Header as={Link} to={`/recipes/${recipe.id}`}>
                                                        {recipe.title}
                                                    </Item.Header>
                                                    <Item.Description>
                                                        <span>
                                                            <Icon name="clock" /> {recipe.date}
                                                        </span>
                                                    </Item.Description>
                                                </Item.Content>
                                            </Item>
                                        </Item.Group>
                                    </Segment>
                                </>
                            ))}
                        </Segment.Group>
                    </>
                ) : (
                    <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                        No recipes yet!
                    </Header>
                )}
            </Segment>
        </>
    );
});
