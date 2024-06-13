import { useStore } from '../../../app/stores/store';
import UserRecipesListItem from './UserRecipesListItem';

export default function UserRecipesList() {
    const { userRecipesStore } = useStore();
    const { userRecipes } = userRecipesStore;

    if (userRecipes.length < 1) {
        return (
            <div
                className="card__content"
                style={{
                    gridTemplateAreas: "'text'",
                    textAlign: 'center',
                    gridTemplateColumns: '1fr',
                    width: '100%',
                }}
            >
                <h2
                    style={{
                        textAlign: 'center',
                        width: '100%',
                        fontSize: '2em',
                        fontFamily: 'Andale Mono, monospace',
                        paddingBottom: '1em',
                    }}
                >
                    Brak przepisów!
                </h2>
            </div>
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
