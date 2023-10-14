import { Button, Header, Table, TableCell, TableRow } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import LoginForm from '../../../features/users/LoginForm';
import RegisterForm from '../../../features/users/RegisterForm';

export default function LoginOrRegister() {
    const { modalStore } = useStore();

    return (
        <>
            <Header as="h2" textAlign="center">
                To proceed login or register
            </Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center">
                            <Button primary fluid onClick={() => modalStore.openModal(<LoginForm />)}>
                                Login
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell textAlign="center">
                            <Button secondary fluid onClick={() => modalStore.openModal(<RegisterForm />)}>
                                Register
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </tbody>
            </Table>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <TableRow>
                        <TableCell textAlign="center" width={12}>
                            <Button fluid className="ui negative button" onClick={() => modalStore.closeModal()}>
                                Cancel
                            </Button>
                        </TableCell>
                    </TableRow>
                </tbody>
            </Table>
        </>
    );
}