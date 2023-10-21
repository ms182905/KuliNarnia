import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecommendedRecipesList from './RecommendedRecipesList';

export default observer(function RecommendedRecipesDashboard() {
    const { recommendedRecipesStore } = useStore();
    const {
        loadRecommendedRecipes,
        recommendedRecipeRegistry,
        recommendedRecipesLoaded
    } = recommendedRecipesStore;

    useEffect(() => {
        if (recommendedRecipeRegistry.size < 1 && !recommendedRecipesLoaded) {
            loadRecommendedRecipes();
        }
    }, [recommendedRecipeRegistry, recommendedRecipesLoaded, loadRecommendedRecipes]);

    if (!recommendedRecipesLoaded) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading recommended recipes..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <RecommendedRecipesList />
                </Grid.Column>
            </Grid>
        </>
    );
});
