import { Segment, Header } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export default function RecipeDetailedIngredients({ recipe }: Props) {
    return (
        <Segment.Group>
            <Segment textAlign="center" attached="top" inverted color="red" style={{ border: 'none' }}>
                <Header>Ingredients</Header>
            </Segment>
            {recipe.ingredients.map((ingredient, index) => (
                <Segment key={index}>
                    <span>
                        <b>{capitalizeFirstLetter(ingredient.name)}:&emsp;</b>{ingredient.amount}&emsp;{ingredient.measurement.name}{' '}
                    </span>
                </Segment>
            ))}
        </Segment.Group>
    );
}
