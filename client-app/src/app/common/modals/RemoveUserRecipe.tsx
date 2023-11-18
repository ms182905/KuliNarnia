import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

interface Props {
    recipeId: string;
}

export default function RemoveUserRecipe({ recipeId }: Props) {
    const { modalStore, userRecipesStore } = useStore();
    const { deleteRecipe } = userRecipesStore;

    function deleteRecipeAndClose() {
        modalStore.closeModal();
        deleteRecipe(recipeId);
    }

    return (
        <>
            <Header textAlign="center">Delete this recipe?</Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="ui positive button" onClick={() => deleteRecipeAndClose()}>
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
