import { observer } from 'mobx-react-lite';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
    index: number;
}

export default observer(function RecipeListItem({ recipe, index }: Props) {
    console.log(index);

    return (
        <div style={{ gridTemplateAreas: index % 2 === 0 ? "'text img'" : "'img text'" }} className="card__content">
            <div>
                <h2>{recipe.title}</h2>
                <p>{recipe.description}</p>
                <p className="category-and-tags">{formatRecipeInfo(recipe)}</p>
                <p>
                    <a href={`/recipes/${recipe.id}`} className="read-more-button">
                        Read more
                    </a>
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

function formatRecipeInfo(recipe: Recipe) {
    if (!recipe || typeof recipe !== 'object') {
        return '';
    }

    let categoryName = recipe.categoryName || '';
    if (categoryName === 'Unknown') {
        categoryName = '';
    }

    const tags = recipe.tags || [];

    const allWords = [categoryName, ...tags];

    const formattedWords = allWords.map((word) => {
        if (typeof word === 'string') {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word.name.charAt(0).toUpperCase() + word.name.slice(1);
    });

    const resultString = formattedWords.join(', ');

    return resultString;
}
