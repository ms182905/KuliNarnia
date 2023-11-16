import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

interface Props {
    recipeIngredientId: string;
}

export default function DeleteRecipeIngredient({ recipeIngredientId }: Props) {
    const { modalStore, recipeStore } = useStore();
    const { deleteRecipeIngredient } = recipeStore;

    function deleteIngredientAndClose() {
        modalStore.closeModal();
        deleteRecipeIngredient(recipeIngredientId);
    }

    return (
        <>
            <Header textAlign="center">Delete this ingredient?</Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="ui positive button" onClick={() => deleteIngredientAndClose()}>
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
