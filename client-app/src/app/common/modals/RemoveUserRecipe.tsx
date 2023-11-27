import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import { router } from '../../router/Routes';

interface Props {
    recipeId: string;
}

export default function RemoveUserRecipe({ recipeId }: Props) {
    const { modalStore, userRecipesStore } = useStore();
    const { deleteRecipe } = userRecipesStore;

    function deleteRecipeAndClose() {
        modalStore.closeModal();
        deleteRecipe(recipeId);
        router.navigate('/recipes');
    }

    return (
        <>
            <Header textAlign="center" style={{ fontFamily: 'Andale Mono, monospace' }}>
                Usunąć ten przepis?
            </Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="positiveButton" onClick={() => deleteRecipeAndClose()}>
                                Tak
                            </Button>
                        </Table.Cell>
                        <Table.Cell width={1}></Table.Cell>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="negativeButton" onClick={() => modalStore.closeModal()}>
                                Nie
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </tbody>
            </Table>
        </>
    );
}
