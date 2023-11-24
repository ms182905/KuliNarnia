import { useEffect, useState } from 'react';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeFormInstructions from './RecipeFormInstructions';
import RecipeFormIngredients from './RecipeFormIngredients';
import RecipeFormBaseInfo from './RecipeFormBaseInfo';
import PhotoUploadWidget from '../../../app/common/imageUpload/PhotoUploadWidget';
import RecipeFormValidation from './RecipeFormValidation';
import { router } from '../../../app/router/Routes';
import DeleteRecipePhoto from '../../../app/common/modals/DeleteRecipePhoto';

export default observer(function RecipeForm() {
    const { recipeStore, categoryStore, tagStore, measurementStore, pageOptionButtonStore, userStore, modalStore } =
        useStore();
    const { loadRecipe, uploadPhoto, uploading, updateRecipe, createRecipe, loading } = recipeStore;
    const { loadCategories } = categoryStore;
    const { loadTags } = tagStore;
    const { loadMeasurements } = measurementStore;
    const { id } = useParams();

    const [dataEditMode, setDataEditMode] = useState(true);
    const [isValid, setValid] = useState(false);
    const [isSaved, setSaved] = useState(false);
    const [recipePhotos, setRecipePhotos] = useState(recipeStore.selectedRecipe?.photos);
    const [photoId, setPhotoId] = useState('');

    useEffect(() => {
        if (!userStore.user) {
            router.navigate('/');
        }
    }, [userStore.user]);

    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

    useEffect(() => {
        if (recipeStore.selectedRecipe) setRecipePhotos(recipeStore.selectedRecipe.photos);
    }, [recipeStore.selectedRecipe, recipeStore.selectedRecipe?.photos]);

    useEffect(() => {
        if (id && (!recipeStore.selectedRecipe || recipeStore.selectedRecipe.id !== id)) {
            loadRecipe(id);
        }
    }, [id, loadRecipe, recipeStore.selectedRecipe]);

    useEffect(() => {
        if (categoryStore.categoriesTable.length < 1) {
            loadCategories();
        }
    }, [categoryStore.categoriesTable, loadCategories]);

    useEffect(() => {
        if (tagStore.tagsTable.length < 1) {
            loadTags();
        }
    }, [tagStore.tagsTable, loadTags]);

    useEffect(() => {
        if (measurementStore.measurementsTable.length < 1) {
            loadMeasurements();
        }
    }, [measurementStore.measurementsTable, loadMeasurements]);

    function handleFormSubmit() {
        if (id || isSaved) {
            updateRecipe();
        } else {
            createRecipe();
        }
    }

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file);
    }

    if (recipeStore.loadingInitial) return <LoadingComponent content="Loading recipe..." />;
    if (categoryStore.loadingInitial) return <LoadingComponent content="Loading categories..." />;
    if (tagStore.loadingInitial) return <LoadingComponent content="Loading tags..." />;
    if (measurementStore.loadingInitial) return <LoadingComponent content="Loading measurements..." />;

    if (dataEditMode) {
        return (
            <Segment.Group style={{ border: 'none', boxShadow: 'none' }}>
                <RecipeFormBaseInfo />

                <RecipeFormIngredients />

                <RecipeFormInstructions />

                <RecipeFormValidation
                    setValid={setValid}
                    loading={loading}
                    isValid={isValid}
                    handleFormSubmit={handleFormSubmit}
                    setSaved={setSaved}
                    isSaved={isSaved}
                    id={id}
                    setDataEditMode={setDataEditMode}
                />
            </Segment.Group>
        );
    }

    return (
        <>
            <div className="card__content" style={{ display: 'block', padding: '14px', overflow: 'visible' }}>
                <h2 style={{ textAlign: 'center', padding: '0.2em' }}>Recipe photos</h2>
                <div
                    className="card__content"
                    style={{
                        gridTemplateAreas: "'text'",
                        textAlign: 'center',
                        gridTemplateColumns: '1fr',
                        width: '100%',
                        overflow: 'visible',
                    }}
                >
                    <Segment
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            width: '90%',
                            fontFamily: 'Andale Mono, monospace',
                            overflow: 'visible',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '2em',
                        }}
                    >
                        {recipePhotos?.length ? (
                            <Grid columns={2} style={{ width: '100%' }}>
                                {recipePhotos.map((photo, index) => (
                                    <Grid.Column
                                        key={index}
                                        style={{
                                            marginBottom: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img
                                            src={photo.url}
                                            alt={` ${index + 1}`}
                                            style={{ maxWidth: '100%', objectFit: 'cover', marginBottom: '10px' }}
                                        />
                                        <Button
                                            color="red"
                                            size="mini"
                                            content="Delete"
                                            className="negativeButton"
                                            fluid
                                            loading={loading && photo.id === photoId}
                                            onClick={() =>
                                                modalStore.openModal(
                                                    <DeleteRecipePhoto photoId={photo.id} setPhotoId={setPhotoId} />
                                                )
                                            }
                                        />
                                    </Grid.Column>
                                ))}
                            </Grid>
                        ) : (
                            <div>No photos available</div>
                        )}
                    </Segment>
                </div>
            </div>

            <div className="card__content" style={{ display: 'block', padding: '14px', overflow: 'visible' }}>
                <h2 style={{ textAlign: 'center', padding: '0.2em' }}>Add photo</h2>
                <div
                    className="card__content"
                    style={{
                        gridTemplateAreas: "'text'",
                        textAlign: 'center',
                        gridTemplateColumns: '1fr',
                        width: '100%',
                        overflow: 'visible',
                    }}
                >
                    <Segment
                        attached
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            width: '90%',
                            fontFamily: 'Andale Mono, monospace',
                            overflow: 'visible',
                            padding: '3em',
                        }}
                    >
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} ratio={1.33} />
                    </Segment>
                </div>
            </div>

            <div
                className="card__content"
                style={{
                    display: 'block',
                    padding: '14px',
                    overflow: 'visible',
                    width: '40%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                <h2 style={{ textAlign: 'center', padding: '0.2em' }}>Manage</h2>
                <div
                    className="card__content"
                    style={{
                        gridTemplateAreas: "'text'",
                        textAlign: 'center',
                        gridTemplateColumns: '1fr',
                        width: '100%',
                        overflow: 'visible',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Segment style={{ border: 'none', boxShadow: 'none', fontFamily: 'Andale Mono, monospace' }}>
                        <Button
                            loading={loading}
                            disabled={!isValid}
                            onClick={() => {
                                router.navigate(`/recipes/${recipeStore.selectedRecipe!.id}/true`);
                            }}
                            className="editPhotoButton"
                            style={{ marginTop: '1em', fontSize: '1.2em', width: '100%' }}
                        >
                            View recipe
                        </Button>
                        <Button
                            disabled={loading || (!isSaved && !id)}
                            onClick={() => {
                                setDataEditMode(true);
                            }}
                            className="negativeButton"
                            style={{ marginTop: '0.3em', fontSize: '1.2em', width: '100%' }}
                        >
                            Back
                        </Button>
                    </Segment>
                </div>
            </div>
        </>
    );
});
