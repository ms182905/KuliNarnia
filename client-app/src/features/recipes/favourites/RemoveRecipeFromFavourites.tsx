import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { toast } from 'react-toastify';

interface Props {
    recipeId: string;
}

export default function RemoveRecipeFromFavourites({ recipeId }: Props) {
    const { modalStore, recipeStore } = useStore();
    const { removeRecipeFromFavourites } = recipeStore;

    function removeRecipeFromFavouritesAndClose() {
        modalStore.closeModal();
        removeRecipeFromFavourites(recipeId);
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
