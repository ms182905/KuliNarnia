import { Button, Container, Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src='/assets/logo.png' alt='logo' style={{marginRight: '10px'}}/>
                    KuliNarnia
                </Menu.Item>
                <Menu.Item as={NavLink} to='/recipes' name='Recipes' />
                <Menu.Item>
                    <Button as={NavLink} to='/createRecipe' positive content='Create Recipe'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}