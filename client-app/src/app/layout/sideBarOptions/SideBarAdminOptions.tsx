import { Button, Container, Menu, Image, Dropdown, Checkbox, Grid, Header, Icon, Segment, Sidebar } from 'semantic-ui-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoginForm from '../../common/modals/LoginForm';
import LoginOrRegister from '../../common/modals/LoginOrRegister';
import RegisterForm from '../../common/modals/RegisterForm';
import { router } from '../../router/Routes';
import { useStore } from '../../stores/store';

export default observer(function SideBarUserOptions() {
    const location = useLocation();
    const {
        userStore: { user, logout },
        modalStore: { openModal },
        recipeStore: { resetSelectedRecipe },
        menuHideStore: { state },
    } = useStore();

    return (
        <Sidebar as={Menu} animation='overlay' visible={state} vertical inverted fixed="left" >
        <Container className='menu-container'>
                    <Menu.Item as={NavLink} to="/" header>
                        <img src="/assets/strawberry.png" alt="logo" style={{ marginRight: '10px' }} />
                        KuliNarnia
                    </Menu.Item>
                    <Menu.Item
                        as={NavLink}
                        to="/lastActivity"
                        onClick={() => window.scrollTo(0, 0)}
                        name="Last activity"
                    />
                    <Menu.Item
                        as={NavLink}
                        to="/adminRecipes"
                        onClick={() => window.scrollTo(0, 0)}
                        name="Manage recipes"
                    />
                    <Menu.Item
                        as={NavLink}
                        to="/categories"
                        onClick={() => window.scrollTo(0, 0)}
                        name="Manage categories"
                    />
                    <Menu.Item as={NavLink} to="/tags" onClick={() => window.scrollTo(0, 0)} name="Manage tags" />
                    <Menu.Item
                        as={NavLink}
                        to="/measurements"
                        onClick={() => window.scrollTo(0, 0)}
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
  )
});
