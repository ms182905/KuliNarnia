import { Header, Pagination } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import RecipeListItem from './RecipeListItem';
import { Fragment } from 'react';

export default function RecipeList() {
    const { recipeStore } = useStore();
    const { groupedRecipes } = recipeStore;

    return (
        <>
            {groupedRecipes.map(([group, recipes]) => (
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>
                    {recipes.map((recipe) => (
                        <RecipeListItem key={recipe.id} recipe={recipe} />
                    ))}
                </Fragment>
            ))}

            <Pagination
                defaultActivePage={1}
                pointing
                secondary
                totalPages={20}
                size="big"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            />
        </>
    );
}
