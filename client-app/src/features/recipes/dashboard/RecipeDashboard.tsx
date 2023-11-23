import { useEffect } from 'react';
import { Grid, Pagination, Segment } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeSearchElement from './RecipeSearchElement';
import { useLocation } from 'react-router-dom';
import { router } from '../../../app/router/Routes';
import LoginOrRegister from '../../../app/common/modals/LoginOrRegister';

export default observer(function RecipeDashboard() {
    const { recipeStore, pageOptionButtonStore, userStore, modalStore } = useStore();
    const {
        loadRecipes,
        recipeRegistry,
        recipesNumber,
        handlePageChange,
        pageCapacity,
        recipeDashboardPageNumber,
        searchQuery,
        selectedCategory,
        selectedTags,
    } = recipeStore;

    console.log(useLocation().pathname);

    useEffect(() => {
        if (recipeRegistry.size < 1) {
            loadRecipes(recipeDashboardPageNumber);
        }
    }, [loadRecipes, recipeRegistry.size, recipeDashboardPageNumber, searchQuery, selectedCategory, selectedTags]);

    useEffect(() => {
        if (pageOptionButtonStore.text !== 'Add new recipe' || !pageOptionButtonStore.visible) {
            pageOptionButtonStore.setText('Add new recipe');
            pageOptionButtonStore.setVisible(true);
            pageOptionButtonStore.setLoading(false);
            if (userStore.user) {
                pageOptionButtonStore.setCallback(() => {
                    window.scrollTo(0, 0);
                    router.navigate('/createRecipe');
                });
            } else {
                pageOptionButtonStore.setCallback(() => modalStore.openModal(<LoginOrRegister />));
            }
        }
    }, [pageOptionButtonStore, modalStore, userStore.user]);

    if (recipeStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading recipes..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <Segment className="filter-segment">
                        <RecipeSearchElement />
                    </Segment>
                    <RecipeList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={recipeDashboardPageNumber}
                totalPages={Math.ceil(recipesNumber / pageCapacity)}
                size="huge"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '0.5em',
                    fontFamily: 'Andale Mono, monospace',
                    borderRadius: '1em',
                }}
                onPageChange={(_event, data) => {
                    handlePageChange(Number(data.activePage));
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
