import { observer } from 'mobx-react-lite';
import { Recipe } from '../../../app/models/recipe';
import { useStore } from '../../../app/stores/store';
import { SyntheticEvent, useEffect, useState } from 'react';
import RemoveUserRecipe from '../../../app/common/modals/RemoveUserRecipe';

interface Props {
    recipe: Recipe;
}

export default observer(function UserRecipesListItem({ recipe }: Props) {
    const { pageOptionButtonStore, modalStore } = useStore();

    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

    const [target, setTarget] = useState('');

    function handleRecipeDelete(_e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(id);
        modalStore.openModal(<RemoveUserRecipe recipeId={id} />);
    }

    return (
        <div style={{ gridTemplateAreas: "'text img'" }} className="card__content">
            <div>
                <h2 style={{ fontSize: '1.6em' }}>{recipe.title}</h2>
                <p>
                    <a href={`/recipes/${recipe.id}/true`} className="read-more-button">
                        View
                    </a>
                    <button
                        className="delete-recipe-button"
                        onClick={(e) => handleRecipeDelete(e, recipe.id)}
                        disabled={target === recipe.id}
                    >
                        Delete
                    </button>
                </p>
            </div>
            <figure>
                <img
                    src={recipe.photos?.at(0) ? recipe.photos.at(0)?.url : '/assets/placeholder.png'}
                    alt="Description"
                />
            </figure>
        </div>
    );
});
