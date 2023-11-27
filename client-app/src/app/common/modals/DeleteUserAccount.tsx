import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

interface Props {
    userName: string;
}

export default function DeleteUserAccount({ userName }: Props) {
    const { modalStore, userStore } = useStore();
    const { deleteUserAccount } = userStore;

    function deleteUserAccountAndClose() {
        modalStore.closeModal();
        deleteUserAccount(userName);
    }

    return (
        <>
            <Header textAlign="center" style={{ fontFamily: 'Andale Mono, monospace' }}>
                Usunąć to konto?
            </Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="positiveButton" onClick={() => deleteUserAccountAndClose()}>
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
