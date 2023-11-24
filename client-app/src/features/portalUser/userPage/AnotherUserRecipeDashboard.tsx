import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Header, Icon, Segment, Image as Img, Button, Divider } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import PhotoUploadWidget from '../../../app/common/imageUpload/PhotoUploadWidget';
import AnotherUserRecipeList from './AnotherUserRecipeList';
import DeleteUserAccount from '../../../app/common/modals/DeleteUserAccount';

interface Props {
    username: string;
}

export default observer(function AnotherUserRecipeDashboard({ username }: Props) {
    const { userRecipesStore, userStore, modalStore, pageOptionButtonStore, commentStore } = useStore();
    const { anotherUserProfilePhotoUrl } = userRecipesStore;
    const { loadAnotherUserRecipes } = userRecipesStore;

    const [editPhotoMode, setEditPhotoMode] = useState(false);

    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

    function handlePhotoUpload(file: Blob) {
        userStore.uploadPhoto(file);
    }

    useEffect(() => {
        if (userRecipesStore.anotherUserUsername !== username) loadAnotherUserRecipes(username, 0);
    }, [loadAnotherUserRecipes, userRecipesStore.anotherUserUsername, username]);

    return (
        <>
            <div
                className="card__content"
                style={{
                    display: 'block',
                    position: 'relative',
                    padding: '14px',
                    marginTop: '0.5em',
                    textAlign: 'center',
                }}
            >
                {userStore.user?.username === username ? (
                    <Button
                        style={{ position: 'absolute', right: '14px' }}
                        color="teal"
                        onClick={() => setEditPhotoMode(true)}
                        className="editPhotoButton"
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
                    style={{ paddingTop: '1em' }}
                />
                <Header
                    as="h1"
                    style={{ paddingBottom: '14px', fontSize: '2em', fontFamily: 'Andale Mono, monospace' }}
                >
                    {username}
                    <p style={{ fontSize: '0.5em', margin: '0' }}>
                        Created recipes: {userRecipesStore.anotherUserRecipesNumber}
                    </p>
                    <p style={{ fontSize: '0.5em' }}>Written comments: {commentStore.userCommentsNumber}</p>
                </Header>

                {editPhotoMode ? (
                    <>
                        <div
                            className="card__content"
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '14px',
                                marginTop: '0.5em',
                                textAlign: 'center',
                            }}
                        >
                            <Divider horizontal style={{ width: '100%' }}>
                                <Header as="h4" style={{ width: '100%', fontFamily: 'Andale Mono, monospace' }}>
                                    <Icon name="edit" />
                                    Edit profile photo
                                </Header>
                            </Divider>
                            <PhotoUploadWidget
                                uploadPhoto={handlePhotoUpload}
                                loading={userStore.photoUploading}
                                ratio={1}
                            />
                            <Button
                                onClick={() => setEditPhotoMode(false)}
                                fluid
                                style={{ marginTop: '8px' }}
                                className="negativeButton"
                            >
                                <Icon name="cancel" />
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {userStore.user?.role === 'Administrator' && (
                    <Button
                        content="Delete user account"
                        color="red"
                        fluid
                        loading={userStore.loading}
                        onClick={() => modalStore.openModal(<DeleteUserAccount userName={username} />)}
                    />
                )}
            </div>
            <AnotherUserRecipeList username={username} />
        </>
    );
});
