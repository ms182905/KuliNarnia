import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { useState } from 'react';
import RecommendedRecipesListItem from './RecommendedRecipesListItem';

export default function RecommendedRecipesList() {
    const { recommendedRecipesStore } = useStore();
    const { recommendedRecipes, recommendedRecipeRegistry } = recommendedRecipesStore;

    const [registrySize] = useState(recommendedRecipeRegistry.size);

    if (registrySize < 1) {
        return (
            <>
                <Header as="h2" textAlign="center" attached="bottom" style={{ border: '10px' }}>
                    Cannot determine recommended recipes!
                </Header>
                <Header as="h2" textAlign="center" attached="bottom" style={{ border: '10px' }}>
                    Try to explore more recipes
                </Header>
            </>
        );
    }

    return (
        <>
            {recommendedRecipes.map((recipe) => (
                <RecommendedRecipesListItem key={recipe.id} recipe={recipe} />
            ))}
        </>
    );
}
