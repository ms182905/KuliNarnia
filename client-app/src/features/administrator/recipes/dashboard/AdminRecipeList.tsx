import { Header } from 'semantic-ui-react';
import { useStore } from '../../../../app/stores/store';
import AdminRecipeListItem from './AdminRecipeListItem';
import { Fragment } from 'react';

export default function AdminRecipeList() {
    const { recipeStore } = useStore();
    const { groupedRecipes } = recipeStore;

    return (
        <>
            {groupedRecipes
                .sort((a, b) => {
                    return new Date(b[0]).getTime() - new Date(a[0]).getTime();
                })
                .map(([group, recipes]) => (
                    <Fragment key={group}>
                        <Header sub color="teal">
                            {group}
                        </Header>
                        {recipes.map((recipe) => (
                            <AdminRecipeListItem key={recipe.id} recipe={recipe} />
                        ))}
                    </Fragment>
                ))}
        </>
    );
}
