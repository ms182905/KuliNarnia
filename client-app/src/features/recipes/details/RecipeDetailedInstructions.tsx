import { Segment, Header } from 'semantic-ui-react';
import { Recipe } from '../../../app/models/recipe';

interface Props {
    recipe: Recipe;
}

function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export default function RecipeDetailedInstructions({ recipe }: Props) {
    return (
        <Segment.Group>
            <Segment textAlign="center" attached="top" inverted color="blue" style={{ border: 'none' }}>
                <Header>Instructions</Header>
            </Segment>

            {recipe.instructions.map((instruction, index) => (
                <Segment key={index}>
                    <span>
                        <b>Step {instruction.position}:&nbsp;&nbsp;</b>
                        {capitalizeFirstLetter(instruction.text)}
                    </span>
                </Segment>
            ))}
        </Segment.Group>
    );
}
