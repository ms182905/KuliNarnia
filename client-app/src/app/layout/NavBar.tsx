import { Button, Container, Menu, Image, Dropdown } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import LoginForm from '../../features/users/LoginForm';
import RegisterForm from '../../features/users/RegisterForm';
import LoginOrRegister from '../common/modals/LoginOrRegister';

export default observer(function NavBar() {
    const {
        userStore: { user, logout },
        modalStore: { openModal },
        recipeStore: { resetSelectedRecipe },
    } = useStore();
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to="/" header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
                    KuliNarnia
                </Menu.Item>
                <Menu.Item as={NavLink} to="/recipes" onClick={() => window.scrollTo(0, 0)} name="Recipes" />
                <Menu.Item as={NavLink} to="/errors" name="Errors" />
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
                        <Menu.Item>
                            <Button
                                as={NavLink}
                                to="/createRecipe"
                                onClick={() => {
                                    resetSelectedRecipe();
                                    window.scrollTo(0, 0);
                                }}
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
                                    to={`/profile/${user?.username}`}
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
        </Menu>
    );
});
