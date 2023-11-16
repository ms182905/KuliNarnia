import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoginForm from '../../app/common/modals/LoginForm';
import RegisterForm from '../../app/common/modals/RegisterForm';

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();

    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as="h1" inverted>
                    <Image size="massive" src="/assets/logo.png" alt="logo" style={{ marginBottom: 13 }} />
                    KuliNarnia
                </Header>
                {userStore.isLoggedIn ? (
                    <></>
                ) : (
                    <>
                        <Header as="h2">
                            <Button onClick={() => modalStore.openModal(<LoginForm />)} size="huge" inverted>
                                Login
                            </Button>
                        </Header>
                        <Header as="h2">
                            <Button onClick={() => modalStore.openModal(<RegisterForm />)} size="huge" inverted>
                                Register
                            </Button>
                        </Header>
                    </>
                )}
                <Header as="h2">
                    <Button as={Link} to="/recipes" size="huge" inverted>
                        Take me to recipes!
                    </Button>
                </Header>
            </Container>
        </Segment>
    );
});
