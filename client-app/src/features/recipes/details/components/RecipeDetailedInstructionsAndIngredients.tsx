import { Recipe } from '../../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export default function RecipeDetailedInstructionsAndIngredients({ recipe }: Props) {
    return (
        <div id="index" className="card__instruction-ingredient" style={{ paddingLeft: '1em', paddingRight: '1em' }}>
            <div className="a">
                <h2 style={{ textAlign: 'center', width: 'auto', margin: '0 auto' }}>Preparation steps</h2>
                <div className="column-container">
                    <ol style={{ paddingLeft: '2em' }}>
                        {recipe.instructions.map((instruction, index) => (
                            <li key={index}>
                                <span>{capitalizeFirstLetter(instruction.text)}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            <div className="b">
                <h2 style={{ textAlign: 'center' }}>Ingredients</h2>
                <div className="column-container">
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                <span>
                                    <b>{capitalizeFirstLetter(ingredient.name)}:&emsp;</b>
                                    {ingredient.amount}&emsp;{ingredient.measurement.name}{' '}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        // <Segment.Group>
        //     <Segment textAlign="center" attached="top" inverted color="blue" style={{ border: 'none' }}>
        //         <Header>Instructions</Header>
        //     </Segment>

        // </Segment.Group>
    );
}
