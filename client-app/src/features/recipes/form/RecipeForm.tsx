import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeFormInstructions from './RecipeFormInstructions';
import RecipeFormIngredients from './RecipeFormIngredients';
import RecipeFormBaseInfo from './RecipeFormBaseInfo';
import PhotoUploadWidget from '../../../app/common/imageUpload/PhotoUploadWidget';

export default observer(function RecipeForm() {
    const { recipeStore, categoryStore, tagStore, measurementStore } = useStore();
    const { loadRecipe, uploadPhoto, uploading, updateRecipe, createRecipe, loading } = recipeStore;
    const { loadCategories } = categoryStore;
    const { loadTags } = tagStore;
    const { loadMeasurements } = measurementStore;
    const { id } = useParams();

    const [dataEditMode, setDataEditMode] = useState(true);

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
        if (id) {
            //recipe.id = uuid();
            //createRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
            updateRecipe();
        } else {
            createRecipe();
            //updateRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
        }
    }

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file);
    }

    if (recipeStore.loadingInitial) return <LoadingComponent content="Loading recipe..." />;
    if (categoryStore.loadingInitial) return <LoadingComponent content="Loading categories..." />;
    if (tagStore.loadingInitial) return <LoadingComponent content="Loading tags..." />;
    if (measurementStore.loadingInitial) return <LoadingComponent content="Loading measurements..." />;

    // TODO: add firm to confirm ingredient delete
    if (dataEditMode) {
        return (
            <Segment.Group>
                <Segment
                    textAlign="center"
                    attached="top"
                    inverted
                    color="red"
                    style={{ border: 'none', borderRadius: '3px' }}
                >
                    <Header>Primary data</Header>
                </Segment>
                <RecipeFormBaseInfo />

                <Segment textAlign="center" inverted color="pink" style={{ border: 'none', borderRadius: '3px' }}>
                    <Header>Ingredients</Header>
                </Segment>

                <RecipeFormIngredients />

                <Segment textAlign="center" inverted color="violet" style={{ border: 'none', borderRadius: '3px' }}>
                    <Header>Instructions</Header>
                </Segment>

                <RecipeFormInstructions />

                {/* <Segment textAlign="center" inverted color="yellow" style={{ border: 'none', borderRadius: '3px' }}>
                    <Header>Photos</Header>
                </Segment>
                <Segment>
                    <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                </Segment> */}
                <Segment>
                    {/* <Button as={Link} to={`/recipes/${recipeStore.selectedRecipe.id}`} color="teal" floated="right" content="View" /> */}
                    <Button
                        color="green"
                        size="huge"
                        fluid
                        content="Save changes"
                        loading={loading}
                        onClick={() => {handleFormSubmit()}}
                    />
                    <Button
                        color="blue"
                        size="huge"
                        fluid
                        disabled={loading}
                        content="Go to photos"
                        onClick={() => {setDataEditMode(false)}}
                    />
                </Segment>
            </Segment.Group>
        );
    }

    return (
        <>
            <Segment textAlign="center" inverted color="yellow" style={{ border: 'none', borderRadius: '3px' }}>
                <Header>Photos</Header>
            </Segment>
            <Segment>
                <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
            </Segment>
            <Segment>
                <Button as={Link} to={`/recipes/${recipeStore.selectedRecipe!.id}`} color="teal" floated="right" content="View" />
                {/* <Button color="green" size="huge" fluid content="Save changes" onClick={() => setDataEditMode(false)} /> */}
                <Button color="blue" size="huge" fluid content="Back" onClick={() => setDataEditMode(true)} />
            </Segment>
        </>
    );
});
