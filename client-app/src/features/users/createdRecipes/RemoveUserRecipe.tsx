import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

interface Props {
    recipeId: string;
}

export default function RemoveUserRecipe({ recipeId }: Props) {
    const { modalStore, recipeStore } = useStore();
    const { deleteRecipe } = recipeStore;

    function deleteCommentAndClose() {
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
                            <Button fluid className="ui positive button" onClick={() => deleteCommentAndClose()}>
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
