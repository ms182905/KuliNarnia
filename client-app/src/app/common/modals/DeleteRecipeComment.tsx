import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

interface Props {
    recipeCommentId: string;
}

export default function DeleteRecipeComment({ recipeCommentId }: Props) {
    const { modalStore, recipeStore } = useStore();
    const { deleteRecipeComment } = recipeStore;

    function deleteCommentAndClose() {
        modalStore.closeModal();
        deleteRecipeComment(recipeCommentId);
    }

    return (
        <>
            <Header textAlign="center">Delete this comment?</Header>
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
