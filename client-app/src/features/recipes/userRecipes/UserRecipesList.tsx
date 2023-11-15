import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import UserRecipesListItem from './UserRecipesListItem';

export default function UserRecipesList() {
    const { userRecipesStore } = useStore();
    const { userRecipes } = userRecipesStore;

    if (userRecipes.length < 1) {
        return (
            <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                No recipes created by user!
            </Header>
        );
    }

    return (
        <>
            {userRecipes
                .sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                })
                .map((recipe) => (
                    <UserRecipesListItem key={recipe.id} recipe={recipe} />
                ))}
        </>
    );
}
