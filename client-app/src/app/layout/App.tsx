import { Header, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import SideBar from './SideBar';
import MenuButton from './MenuButton';
import PageOptionButton from './PageOptionButton';
import ListenButton from './ListenButton';

function App() {
    const location = useLocation();
    const { commonStore, userStore } = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded) return <LoadingComponent content="Ładowanie aplikacji..." />;

    return (
        <>
            <ModalContainer />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {location.pathname !== '/' ? (
                <>
                    <Segment className="title-header-container">
                        <Header>
                            {'Kuli '} <img src="/assets/strawberry.png" alt="logo" style={{ marginLeft: '20px' }} />{' '}
                            {'Narnia'}
                        </Header>
                    </Segment>

                    <SideBar />
                    <MenuButton />
                    <ListenButton />
                    <PageOptionButton />
                </>
            ) : (
                <HomePage />
            )}
        </>
    );
}

export default observer(App);
