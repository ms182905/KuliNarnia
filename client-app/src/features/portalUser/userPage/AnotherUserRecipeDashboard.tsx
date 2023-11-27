import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Header, Icon, Image as Img, Button, Divider } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import PhotoUploadWidget from '../../../app/common/imageUpload/PhotoUploadWidget';
import AnotherUserRecipeList from './AnotherUserRecipeList';

interface Props {
    username: string;
}

export default observer(function AnotherUserRecipeDashboard({ username }: Props) {
    const { userRecipesStore, userStore, commentStore } = useStore();
    const { anotherUserProfilePhotoUrl } = userRecipesStore;
    const { loadAnotherUserRecipes } = userRecipesStore;

    const [editPhotoMode, setEditPhotoMode] = useState(false);

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
                        Edytuj zdjęcie
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
                        Stworzonych przepisów: {userRecipesStore.anotherUserRecipesNumber}
                    </p>
                    <p style={{ fontSize: '0.5em' }}>Napisanych komentarzy: {commentStore.userCommentsNumber}</p>
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
                                    Edytuj zdjęcie profilowe
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
                                Anuluj
                            </Button>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <AnotherUserRecipeList username={username} />
        </>
    );
});
