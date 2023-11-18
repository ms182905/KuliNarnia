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
            <Header textAlign="center">Delete user account?</Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="ui positive button" onClick={() => deleteUserAccountAndClose()}>
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
