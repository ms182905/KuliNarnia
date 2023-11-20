import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import { toast } from 'react-toastify';
import { Recipe } from '../../models/recipe';

interface Props {
    recipe?: Recipe;
    recipeId?: string;
}

export default function RemoveRecipeFromFavourites({ recipe, recipeId }: Props) {
    const { modalStore, favouriteRecipesStore } = useStore();
    const { removeRecipeFromFavourites, removeRecipeFromFavouritesById } = favouriteRecipesStore;

    function removeRecipeFromFavouritesAndClose() {
        modalStore.closeModal();
        if (recipe) removeRecipeFromFavourites(recipe);
        if (recipeId) removeRecipeFromFavouritesById(recipeId);
    }

    return (
        <>
            <Header textAlign="center">Delete this recipe from favourites?</Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button
                                fluid
                                className="ui positive button"
                                onClick={() => {
                                    removeRecipeFromFavouritesAndClose();
                                    toast.success('Recipe removed from favourites!');
                                }}
                            >
                                Yes
                            </Button>
                        </Table.Cell>
                        <Table.Cell width={1}></Table.Cell>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="ui negative button" onClick={() => modalStore.closeModal()}>
                                No
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </tbody>
            </Table>
        </>
    );
}