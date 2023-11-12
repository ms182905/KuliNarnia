import { Button, Header, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

interface Props {
    recipeInstructionId: string
}

export default function DeleteRecipeInstruction({recipeInstructionId}: Props) {
    const { modalStore, recipeStore } = useStore();
    const { deleteRecipeInstruction } = recipeStore;

    function deleteInstructionAndClose() {
        modalStore.closeModal();
        deleteRecipeInstruction(recipeInstructionId);
    }

    return (
        <>
            <Header textAlign="center">Delete this instruction?</Header>
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell textAlign='center' width={6}>
                        <Button fluid className='ui positive button' onClick={() => deleteInstructionAndClose()}>Yes</Button>
                    </Table.Cell>
                    <Table.Cell width={1}></Table.Cell>
                    <Table.Cell textAlign='center' width={6}>
                        <Button fluid className="ui negative button" onClick={() => modalStore.closeModal()}>No</Button>
                    </Table.Cell>
                </Table.Row>
            </Table>
        </>
    );
}