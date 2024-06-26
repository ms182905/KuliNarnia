import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Segment } from 'semantic-ui-react';
import { Recipe } from '../../../../app/models/recipe';
import { useStore } from '../../../../app/stores/store';
import RemoveRecipeFromFavourites from '../../../../app/common/modals/RemoveRecipeFromFavourites';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { router } from '../../../../app/router/Routes';
import { Tag } from '../../../../app/models/tag';
import { Link } from 'react-router-dom';
import RemoveUserRecipe from '../../../../app/common/modals/RemoveUserRecipe';

interface Props {
    recipe: Recipe;
    editable: boolean;
}

export default observer(function RecipeDetailedHeader({ recipe, editable }: Props) {
    const { modalStore, favouriteRecipesStore, userStore, pageOptionButtonStore } = useStore();
    const { addRecipeToFavourites } = favouriteRecipesStore;
    const [editOption] = useState(editable && userStore.user?.displayName === recipe.creatorName);

    useEffect(() => {
        if (userStore.user) {
            if (userStore.user?.role !== 'Administrator') {
                if (
                    recipe &&
                    !pageOptionButtonStore.visible &&
                    (pageOptionButtonStore.text === 'Add to favourites' ||
                        pageOptionButtonStore.text === 'Remove from favourites' ||
                        pageOptionButtonStore.text === 'Manage recipe')
                ) {
                    pageOptionButtonStore.setText(editOption ? 'Add to favourites' : 'Manage recipe');
                    pageOptionButtonStore.setVisible(true);
                    pageOptionButtonStore.setLoading(false);
                }
            } else {
                if (recipe && (!pageOptionButtonStore.visible || pageOptionButtonStore.text !== 'Delete recipe')) {
                    pageOptionButtonStore.setCallback(() =>
                        modalStore.openModal(<RemoveUserRecipe recipeId={recipe.id} />)
                    );
                    pageOptionButtonStore.setText('Delete recipe');
                    pageOptionButtonStore.setVisible(true);
                    pageOptionButtonStore.setLoading(false);
                }
            }
        } else {
            if (pageOptionButtonStore.visible) {
                pageOptionButtonStore.setVisible(false);
                pageOptionButtonStore.setLoading(false);
            }
        }
    }, [pageOptionButtonStore, editOption, recipe, modalStore, userStore.user?.role, userStore.user]);

    useEffect(() => {
        if (userStore.user?.role !== 'Administrator') {
            if (!editOption) {
                if (recipe.inFavourites) {
                    pageOptionButtonStore.setCallback(() =>
                        modalStore.openModal(<RemoveRecipeFromFavourites recipe={recipe} />)
                    );
                    pageOptionButtonStore.setText('Remove from favourites');
                } else {
                    pageOptionButtonStore.setCallback(() => {
                        addRecipeToFavourites(recipe);
                    });
                    pageOptionButtonStore.setText('Add to favourites');
                }
            } else {
                pageOptionButtonStore.setCallback(() => router.navigate(`/manage/${recipe.id}`));
                pageOptionButtonStore.setText('Manage recipe');
            }
        }
    }, [recipe.inFavourites, editOption, addRecipeToFavourites, pageOptionButtonStore, modalStore, recipe, userStore.user?.role]);

    return (
        <Segment.Group style={{ border: 'none', boxShadow: 'none' }}>
            <Segment attached="top" style={{ borderTopLeftRadius: '1em', borderTopRightRadius: '1em' }}>
                <Slide
                    autoplay={recipe.photos && recipe.photos.length > 1}
                    arrows={recipe.photos && recipe.photos.length > 1}
                    infinite
                >
                    {recipe.photos?.length ? (
                        recipe.photos.map((photo, index) => (
                            <div key={index} className="each-slide-effect">
                                <div style={{ backgroundImage: `url(${photo.url})` }}></div>
                            </div>
                        ))
                    ) : (
                        <div className="each-slide-effect">
                            <div style={{ backgroundImage: `url('/assets/placeholder.png')` }}>
                                <span>Brak zdjęć!</span>
                            </div>
                        </div>
                    )}
                </Slide>
            </Segment>
            <Segment
                clearing
                attached="bottom"
                style={{ borderBottomLeftRadius: '1em', borderBottomRightRadius: '1em' }}
            >
                <div
                    className="card__content"
                    style={{ gridTemplateAreas: "'text'", textAlign: 'center', gridTemplateColumns: '1fr' }}
                >
                    <div>
                        <h2 style={{ fontSize: '3em' }}>
                            {recipe.title}
                            <p style={{ fontSize: '0.5em' }}>
                                Stworzony przez:{' '}
                                <Link to={`/userPage/${recipe.creatorName}`}>{recipe.creatorName}</Link>
                            </p>
                        </h2>
                        <p style={{ fontSize: '1.3em' }}>{recipe.description}</p>
                        {recipe.categoryName && recipe.categoryName !== 'Unknown' && (
                            <p style={{ paddingBottom: '1.5em', fontSize: '1.4em' }}>
                                Kategoria: {formatWords(recipe.categoryName)}{' '}
                                {recipe.tags && recipe.tags.length > 0 && (
                                    <>
                                        <br />
                                        Tagi: {formatWords(recipe.tags)}
                                    </>
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </Segment>
        </Segment.Group>
    );
});

function formatWords(input: string | Tag[]) {
    if (typeof input === 'string') {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    const formattedWords = input.map((tag) => {
        return tag.name.charAt(0).toUpperCase() + tag.name.slice(1);
    });

    return formattedWords.join(', ');
}
