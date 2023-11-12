import { useEffect, useState } from 'react';
import { Icon, Segment, Step } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

interface Props {
    setValid: (valid: boolean) => void;
}

export default observer(function RecipeFormValidation({ setValid }: Props) {
    const { recipeStore } = useStore();
    const [recipe, setRecipe] = useState(recipeStore.selectedRecipe);
    const [titleCorrect, setTitleCorrect] = useState(false);
    const [descriptionCorrect, setDescriptionCorrect] = useState(false);
    const [categoryCorrect, setCategoryCorrect] = useState(false);
    const [tagsCorrect, setTagsCorrect] = useState(false);
    const [ingredientsCorrect, setIngredientsCorrect] = useState(false);
    const [instructionsCorrect, setInstructionsCorrect] = useState(false);

    useEffect(() => {
        if (recipeStore.selectedRecipe) setRecipe(recipeStore.selectedRecipe);
    }, [recipeStore.selectedRecipe]);

    useEffect(() => {
        if (recipe?.title && recipe.title.length > 0) setTitleCorrect(true);
        else setTitleCorrect(false);
        if (recipe?.description && recipe.description.length > 0) setDescriptionCorrect(true);
        else setDescriptionCorrect(false);
        if (recipe?.categoryId && recipe.categoryId.length > 0) setCategoryCorrect(true);
        else setCategoryCorrect(false);
        if (recipe?.tagIds && recipe.tagIds.length > 0) setTagsCorrect(true);
        else setTagsCorrect(false);
        console.log(recipe?.ingredients);
        if (recipe?.ingredients && recipe.ingredients.length > 0) setIngredientsCorrect(true);
        else setIngredientsCorrect(false);
        if (recipe?.instructions && recipe.instructions.length > 0) setInstructionsCorrect(true);
        else setInstructionsCorrect(false);
    }, [recipe?.title, recipe?.description, recipe?.categoryId, recipe?.tagIds, recipe?.ingredients, recipe?.ingredients.length, recipe?.instructions, recipe?.instructions.length, setTitleCorrect, setDescriptionCorrect, setCategoryCorrect, setTagsCorrect, setIngredientsCorrect, setInstructionsCorrect]);

    useEffect(() => {
        setValid(
            titleCorrect &&
                descriptionCorrect &&
                categoryCorrect &&
                tagsCorrect &&
                ingredientsCorrect &&
                instructionsCorrect
        );
    }, [titleCorrect, descriptionCorrect, categoryCorrect, tagsCorrect, ingredientsCorrect, instructionsCorrect, setValid]);

    return (
        <>
            <Segment style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Step.Group vertical>
                    <Step completed={titleCorrect}>
                        <Icon name="times circle" color="red" />
                        <Step.Content>
                            <Step.Title>Title</Step.Title>
                            <Step.Description>Recipe has Title</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step completed={descriptionCorrect}>
                        <Icon name="times circle" color="red" />
                        <Step.Content>
                            <Step.Title>Decsription</Step.Title>
                            <Step.Description>Recipe has Decsription</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step completed={categoryCorrect}>
                        <Icon name="times circle" color="red" />
                        <Step.Content>
                            <Step.Title>Category</Step.Title>
                            <Step.Description>Recipe has Category</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step completed={tagsCorrect}>
                        <Icon name="times circle" color="red" />
                        <Step.Content>
                            <Step.Title>Tags</Step.Title>
                            <Step.Description>Recipe has at least one Tag</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step completed={ingredientsCorrect}>
                        <Icon name="times circle" color="red" />
                        <Step.Content>
                            <Step.Title>Ingredients</Step.Title>
                            <Step.Description>Recipe has at least one Ingredient</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step completed={instructionsCorrect}>
                        <Icon name="times circle" color="red" />
                        <Step.Content>
                            <Step.Title>Instructions</Step.Title>
                            <Step.Description>Recipe has at least one Instruction</Step.Description>
                        </Step.Content>
                    </Step>
                </Step.Group>
            </Segment>
        </>
    );
});