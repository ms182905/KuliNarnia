import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

interface Props {
    recipeInstructionId: string;
}

export default function DeleteRecipeInstruction({ recipeInstructionId }: Props) {
    const { modalStore, recipeStore } = useStore();
    const { deleteRecipeInstruction } = recipeStore;

    function deleteInstructionAndClose() {
        modalStore.closeModal();
        deleteRecipeInstruction(recipeInstructionId);
    }

    return (
        <>
            <Header textAlign="center" style={{ fontFamily: 'Andale Mono, monospace' }}>
                Delete this instruction?
            </Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="positiveButton" onClick={() => deleteInstructionAndClose()}>
                                Yes
                            </Button>
                        </Table.Cell>
                        <Table.Cell width={1}></Table.Cell>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="negativeButton" onClick={() => modalStore.closeModal()}>
                                No
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </tbody>
            </Table>
        </>
    );
}
