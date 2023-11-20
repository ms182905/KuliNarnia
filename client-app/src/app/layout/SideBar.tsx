import {
    Button,
    Container,
    Menu,
    Image,
    Dropdown,
    Checkbox,
    Grid,
    Header,
    Icon,
    Segment,
    Sidebar,
} from 'semantic-ui-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import LoginForm from '../common/modals/LoginForm';
import RegisterForm from '../common/modals/RegisterForm';
import LoginOrRegister from '../common/modals/LoginOrRegister';
import { router } from '../router/Routes';
import SideBarUserOptions from './sideBarOptions/SideBarUserOptions';
import { useState } from 'react';
import SideBarAdminOptions from './sideBarOptions/SideBarAdminOptions';

export default observer(function SideBar() {
    const location = useLocation();
    const {
        userStore: { user, logout },
        modalStore: { openModal },
        recipeStore: { resetSelectedRecipe },
    } = useStore();

    return (
        <Sidebar.Pushable style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
            {user?.role !== 'Administrator' ? <SideBarUserOptions  /> : <SideBarAdminOptions />}

            <Sidebar.Pusher style={{ maxHeight: '100vh', height: '100vh', overflowY: 'auto' }}>
                <Container style={{ width: '70%', margin: '10px 0px 20px 0px', border: 'none !important' }}>

                    <Segment className='title-header-container'><Header>{"Kuli "} <img src="/assets/strawberry.png" alt="logo" style={{ marginLeft: '20px' }} /> {"Narnia"}</Header></Segment>

                        <Outlet />

                </Container>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
});
