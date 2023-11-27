import { Menu, Image, Dropdown, Sidebar } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoginForm from '../../common/modals/LoginForm';
import LoginOrRegister from '../../common/modals/LoginOrRegister';
import RegisterForm from '../../common/modals/RegisterForm';
import { useStore } from '../../stores/store';

export default observer(function SideBarUserOptions() {
    const {
        userStore: { user, logout },
        modalStore: { openModal },
        menuHideStore: { state },
    } = useStore();

    return (
        <Sidebar as={Menu} animation="overlay" visible={state} vertical inverted fixed="left">
            <Menu.Item header>
                <img
                    src="/assets/strawberry.png"
                    alt="logo"
                    style={{ marginRight: '10px', paddingTop: '5em', outline: 'none' }}
                />
            </Menu.Item>
            <Menu.Item header>
                <div style={{ fontSize: '2em', fontFamily: 'Andale Mono, monospace' }}> KuliNarnia</div>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to="/recipes"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                name="Przepisy"
                style={{ fontFamily: 'Andale Mono, monospace' }}
            />
            {user ? (
                <>
                    <Menu.Item
                        as={NavLink}
                        to="/favouriteRecipes"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        name="Ulubione"
                        style={{ fontFamily: 'Andale Mono, monospace' }}
                    />
                    <Menu.Item
                        as={NavLink}
                        to="/recommendations"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        name="Rekomendacje"
                        style={{ fontFamily: 'Andale Mono, monospace' }}
                    />
                </>
            ) : (
                <>
                    <Menu.Item
                        style={{ fontFamily: 'Andale Mono, monospace' }}
                        name="Ulubione"
                        onClick={() => openModal(<LoginOrRegister />)}
                    />
                    <Menu.Item
                        style={{ fontFamily: 'Andale Mono, monospace' }}
                        name="Rekomendacje"
                        onClick={() => openModal(<LoginOrRegister />)}
                    />
                </>
            )}
            <Menu.Item header style={{ padding: '20px' }}>
                <Image
                    src={user?.photoUrl ? user.photoUrl : '/assets/user.png'}
                    avatar
                    size="mini"
                    spaced="right"
                    style={{ marginRight: '2em' }}
                />
                <Dropdown
                    pointing="top left"
                    text={user?.displayName}
                    style={{ fontFamily: 'Andale Mono, monospace', fontSize: '1em' }}
                >
                    {user ? (
                        <Dropdown.Menu>
                            <Dropdown.Item
                                style={{ fontFamily: 'Andale Mono, monospace', fontSize: '0.5em' }}
                                as={Link}
                                to={`/userPage/${user?.username}`}
                                text="Mój profil"
                                icon="user"
                            />
                            <Dropdown.Item
                                style={{ fontFamily: 'Andale Mono, monospace', fontSize: '0.5em' }}
                                as={Link}
                                to={'/userRecipes'}
                                text="Moje przepisy"
                                icon="birthday cake"
                            />
                            <Dropdown.Item
                                style={{ fontFamily: 'Andale Mono, monospace', fontSize: '0.5em' }}
                                onClick={logout}
                                text="Wyloguj"
                                icon="power"
                            />
                        </Dropdown.Menu>
                    ) : (
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => openModal(<LoginForm />)}
                                text="Zaloguj"
                                icon="user"
                                style={{ fontFamily: 'Andale Mono, monospace', fontSize: '0.5em' }}
                            />
                            <Dropdown.Item
                                onClick={() => openModal(<RegisterForm />)}
                                text="Zarejestruj"
                                icon="user plus"
                                style={{ fontFamily: 'Andale Mono, monospace', fontSize: '0.5em' }}
                            />
                        </Dropdown.Menu>
                    )}
                </Dropdown>
            </Menu.Item>
        </Sidebar>
    );
});
