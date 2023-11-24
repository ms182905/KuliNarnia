import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecommendedRecipesList from './RecommendedRecipesList';
import { router } from '../../../app/router/Routes';

export default observer(function RecommendedRecipesDashboard() {
    const { recommendedRecipesStore, pageOptionButtonStore, userStore } = useStore();
    const { loadRecommendedRecipes, recommendedRecipeRegistry, recommendedRecipesLoaded } = recommendedRecipesStore;

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
        if (recommendedRecipeRegistry.size < 1 && !recommendedRecipesLoaded) {
            loadRecommendedRecipes();
        }
    }, [recommendedRecipeRegistry, recommendedRecipesLoaded, loadRecommendedRecipes]);

    if (!recommendedRecipesLoaded) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
