import { Link } from 'react-router-dom';
import { Container, Header, Segment, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoginForm from '../../app/common/modals/LoginForm';
import RegisterForm from '../../app/common/modals/RegisterForm';

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();

    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header inverted style={{ fontSize: '6em', fontFamily: 'Andale Mono, monospace', width: '100%' }}>
                    {'Kuli '} <br />
                    <img src="/assets/strawberry.png" alt="logo" />
                    <br />
                    {'Narnia'}
                </Header>
                {userStore.isLoggedIn ? (
                    <></>
                ) : (
                    <>
                        <Header as="h2">
                            <Button
                                onClick={() => modalStore.openModal(<LoginForm />)}
                                size="huge"
                                inverted
                                style={{ fontFamily: 'Andale Mono, monospace', borderRadius: '1em', width: '60%' }}
                            >
                                Zaloguj
                            </Button>
                        </Header>
                        <Header as="h2">
                            <Button
                                onClick={() => modalStore.openModal(<RegisterForm />)}
                                size="huge"
                                inverted
                                style={{ fontFamily: 'Andale Mono, monospace', borderRadius: '1em', width: '60%' }}
                            >
                                Zarejestruj
                            </Button>
                        </Header>
                    </>
                )}
                <Header as="h2">
                    {userStore.user?.role === 'Administrator' ? (
                        <Button
                            as={Link}
                            to="/lastActivity"
                            size="huge"
                            inverted
                            style={{ fontFamily: 'Andale Mono, monospace', borderRadius: '1em', width: '60%' }}
                        >
                            Witaj, Administratorze!
                        </Button>
                    ) : (
                        <Button
                            as={Link}
                            to="/recipes"
                            size="huge"
                            inverted
                            style={{ fontFamily: 'Andale Mono, monospace', borderRadius: '1em', width: '60%' }}
                        >
                            Idź do przepisów!
                        </Button>
                    )}
                </Header>
            </Container>
        </Segment>
    );
});
