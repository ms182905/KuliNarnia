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
    const { userRecipesStore, userStore, modalStore, pageOptionButtonStore } = useStore();
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
                        <PhotoUploadWidget
                            uploadPhoto={handlePhotoUpload}
                            loading={userStore.photoUploading}
                            ratio={1}
                        />
                        <Button color="red" onClick={() => setEditPhotoMode(false)} fluid style={{ marginTop: '8px' }}>
                            <Icon name="cancel" />
                            Cancel
                        </Button>
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
            </Segment>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                {userStore.user?.username === username ? (
                    <Header>Your recently added recipes</Header>
                ) : (
                    <Header>{username}`s recently added recipes</Header>
                )}
            </Segment>
            <AnotherUserRecipeList username={username} />
        </>
    );
});
