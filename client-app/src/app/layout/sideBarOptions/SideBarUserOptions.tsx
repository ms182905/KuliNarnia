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
                <Menu.Item as={NavLink} to="/recipes" onClick={() => window.scrollTo(0, 0)} name="Recipes" />
                {user ? (
                    <>
                        <Menu.Item
                            as={NavLink}
                            to="/favouriteRecipes"
                            onClick={() => window.scrollTo(0, 0)}
                            name="Favourites"
                        />
                        <Menu.Item
                            as={NavLink}
                            to="/recommendations"
                            onClick={() => window.scrollTo(0, 0)}
                            name="Recommendations"
                        />
                        <Menu.Item as={NavLink} to="/createRecipe">
                            <Button
                                onClick={() => {
                                    resetSelectedRecipe();
                                    window.scrollTo(0, 0);
                                    router.navigate('/createRecipe');
                                }}
                                disabled={location.pathname === '/createRecipe'}
                                positive
                                content="Create Recipe"
                            />
                        </Menu.Item>
                    </>
                ) : (
                    <>
                        <Menu.Item name="Favourites" onClick={() => openModal(<LoginOrRegister />)} />
                        <Menu.Item name="Recommendations" onClick={() => openModal(<LoginOrRegister />)} />
                        <Menu.Item>
                            <Button onClick={() => openModal(<LoginOrRegister />)} positive content="Create Recipe" />
                        </Menu.Item>
                    </>
                )}
                <Menu.Item position="right">
                    <Image src={user?.image || '/assets/user.png'} avatar spaced="right" />
                    <Dropdown pointing="top left" text={user?.displayName}>
                        {user ? (
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    as={Link}
                                    to={`/userPage/${user?.username}`}
                                    text="My Profile"
                                    icon="user"
                                />
                                <Dropdown.Item as={Link} to={'/userRecipes'} text="My recipes" icon="birthday cake" />
                                <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                            </Dropdown.Menu>
                        ) : (
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => openModal(<LoginForm />)} text="Login" icon="user" />
                                <Dropdown.Item
                                    onClick={() => openModal(<RegisterForm />)}
                                    text="Register"
                                    icon="user plus"
                                />
                            </Dropdown.Menu>
                        )}
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Sidebar>
  )
});
