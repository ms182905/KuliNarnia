import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'
import RecipeStore from '../stores/recipeStore'
import { useStore } from '../stores/store'

export default function NavBar() {

    const {recipeStore} = useStore();

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src='/assets/logo.png' alt='logo' style={{marginRight: '10px'}}/>
                    KuliNarnia
                </Menu.Item>
                <Menu.Item>
                    <Button onClick={() => recipeStore.openForm()} positive content='Create Recipe'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}