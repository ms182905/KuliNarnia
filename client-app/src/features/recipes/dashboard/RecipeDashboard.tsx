import { useEffect, useState } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import RecipeList from './RecipeList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RecipeSearchElement from './RecipeSearchElement';
import { useLocation } from 'react-router-dom';

export default observer(function RecipeDashboard() {
    const { recipeStore } = useStore();
    const { loadRecipes, recipeRegistry, recipesNumber, handlePageChange, pageCapacity, recipeDashboardPageNumber } = recipeStore;

    console.log(useLocation().pathname);

    useEffect(() => {
        if (recipeRegistry.size < 1) loadRecipes(recipeDashboardPageNumber);
    }, [loadRecipes, recipeRegistry.size, recipeDashboardPageNumber]);

    // useEffect(() => {
    //     if (recipeStore.recipeDashboardPageNumber === 1) setPageNumber(1);
    // }, [recipeStore.recipeDashboardPageNumber]);

    if (recipeStore.loadingInitial){
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading recipes..." />;
    } 

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    {/* </Grid.Column>
            <Grid.Column width='6'> */}
                    <RecipeSearchElement />
                    <RecipeList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={recipeDashboardPageNumber}
                pointing
                secondary
                totalPages={Math.ceil(recipesNumber / pageCapacity)}
                size="huge"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2em',
                    paddingBottom: '1em',
                }}
                onPageChange={(event, data) => {
                    handlePageChange(Number(data.activePage));
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
