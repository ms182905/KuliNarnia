import { Button, Header, Table, TableCell, TableRow } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginOrRegister() {
    const { modalStore } = useStore();

    return (
        <>
            <Header as="h2" textAlign="center" style={{ fontFamily: 'Andale Mono, monospace' }}>
                Aby kontynuować, zaloguj się lub zarejestruj
            </Header>
            <Table style={{ border: 'none', fontFamily: 'Andale Mono, monospace' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center">
                            <Button
                                className="positiveButton"
                                primary
                                fluid
                                onClick={() => modalStore.openModal(<LoginForm />)}
                            >
                                Zaloguj
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell textAlign="center">
                            <Button
                                className="editPhotoButton"
                                secondary
                                fluid
                                onClick={() => modalStore.openModal(<RegisterForm />)}
                            >
                                Zarejestruj
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </tbody>
            </Table>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <TableRow>
                        <TableCell textAlign="center" width={12}>
                            <Button fluid className="negativeButton" onClick={() => modalStore.closeModal()}>
                                Anuluj
                            </Button>
                        </TableCell>
                    </TableRow>
                </tbody>
            </Table>
        </>
    );
}
