import { useStore } from '../../../app/stores/store';
import { useState } from 'react';
import RecipeListItem from '../dashboard/RecipeListItem';

export default function RecommendedRecipesList() {
    const { recommendedRecipesStore } = useStore();
    const { recommendedRecipes, recommendedRecipeRegistry } = recommendedRecipesStore;

    useState(recommendedRecipeRegistry.size);

    return (
        <>
            <div
                style={{ gridTemplateAreas: "'text'", textAlign: 'center', gridTemplateColumns: '1fr' }}
                className="card__content"
            >
                {recommendedRecipes.length > 0 ? (
                    <h2 style={{ padding: '0.5em' }}>Przepisy rekomendowane Tobie</h2>
                ) : (
                    <h2 style={{ padding: '0.5em' }}>
                        Nie można określić rekomendowanych przepisów! <br /> Spróbuj odkryć więcej przepisów!
                    </h2>
                )}
            </div>
            {recommendedRecipes.map((recipe, index) => (
                <RecipeListItem index={index} recipe={recipe} key={index} />
            ))}
        </>
    );
}
