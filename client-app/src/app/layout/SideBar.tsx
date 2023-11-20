import { Container, Sidebar } from 'semantic-ui-react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import SideBarUserOptions from './sideBarOptions/SideBarUserOptions';
import SideBarAdminOptions from './sideBarOptions/SideBarAdminOptions';

export default observer(function SideBar() {
    const {
        userStore: { user },
    } = useStore();

    return (
        <Sidebar.Pushable style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
            {user?.role !== 'Administrator' ? <SideBarUserOptions /> : <SideBarAdminOptions />}

            <Sidebar.Pusher style={{ maxHeight: '100vh', height: '100vh', overflowY: 'auto' }}>
                <Container
                    className="dashboardcard"
                    style={{ width: '70%', margin: '10px 0px 20px 0px', border: 'none !important' }}
                >
                    <div className="main-content">
                        <Outlet />
                    </div>
                </Container>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
});
