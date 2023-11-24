import { Container, Menu, Image, Dropdown, Sidebar } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';

export default observer(function SideBarUserOptions() {
    const {
        userStore: { user, logout },
        menuHideStore: { state },
    } = useStore();

    return (
        <Sidebar as={Menu} animation="overlay" visible={state} vertical inverted fixed="left">
            <Container className="menu-container">
                <Menu.Item as={NavLink} header>
                    <img src="/assets/strawberry.png" alt="logo" style={{ marginRight: '10px', paddingTop: '5em' }} />
                    KuliNarnia
                </Menu.Item>
                <Menu.Item
                    as={NavLink}
                    to="/lastActivity"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    name="Last activity"
                />
                <Menu.Item
                    as={NavLink}
                    to="/recipes"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    name="Manage recipes"
                />
                <Menu.Item
                    as={NavLink}
                    to="/categories"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    name="Manage categories"
                />
                <Menu.Item
                    as={NavLink}
                    to="/tags"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    name="Manage tags"
                />
                <Menu.Item
                    as={NavLink}
                    to="/measurements"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    name="Manage measurements"
                />

                <Menu.Item position="right">
                    <Image src={user?.image || '/assets/user.png'} avatar spaced="right" />
                    <Dropdown pointing="top left" text={user?.displayName}>
                        <Dropdown.Menu>
                            {/* <Dropdown.Item
                                    as={Link}
                                    to={`/userPage/${user?.username}`}
                                    text="My Profile"
                                    icon="user"
                                /> */}
                            <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Sidebar>
    );
});
