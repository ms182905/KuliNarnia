import { useEffect } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeFormInstructions from './RecipeFormInstructions';
import RecipeFormIngredients from './RecipeFormIngredients';
import RecipeFormBaseInfo from './RecipeFormBaseInfo';

export default observer(function RecipeForm() {
    const { recipeStore, categoryStore, tagStore, measurementStore } = useStore();
    const { loadRecipe } = recipeStore;
    const { loadCategories } = categoryStore;
    const { loadTags } = tagStore;
    const { loadMeasurements } = measurementStore;
    const { id } = useParams();

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

    // function handleFormSubmit(recipe: Recipe) {
    //     console.log(recipe);
    //     if (!recipe.id) {
    //         recipe.id = uuid();
    //         createRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
    //     } else {
    //         updateRecipe(recipe).then(() => navigate(`/recipes/${recipe.id}`));
    //     }
    // }

    if (recipeStore.loadingInitial) return <LoadingComponent content="Loading recipe..." />;
    if (categoryStore.loadingInitial) return <LoadingComponent content="Loading categories..." />;
    if (tagStore.loadingInitial) return <LoadingComponent content="Loading tags..." />;
    if (measurementStore.loadingInitial) return <LoadingComponent content="Loading measurements..." />;

    // TODO: add firm to confirm ingredient delete

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

            <Segment textAlign="center" inverted color="blue" style={{ border: 'none', borderRadius: '3px' }}>
                <Header>Ingredients</Header>
            </Segment>

            <RecipeFormIngredients />

            <Segment textAlign="center" inverted color="violet" style={{ border: 'none', borderRadius: '3px' }}>
                <Header>Instructions</Header>
            </Segment>
            <RecipeFormInstructions />
        </Segment.Group>
    );
});
