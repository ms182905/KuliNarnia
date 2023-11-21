import { useEffect } from 'react';
import { Grid, Pagination, Segment } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeSearchElement from './RecipeSearchElement';
import { useLocation } from 'react-router-dom';

export default observer(function RecipeDashboard() {
    const { recipeStore } = useStore();
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

    if (recipeStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading recipes..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <Segment className='filter-segment'>
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
                    fontFamily: 'Andale Mono, monospace'
                }}
                onPageChange={(_event, data) => {
                    handlePageChange(Number(data.activePage));
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
