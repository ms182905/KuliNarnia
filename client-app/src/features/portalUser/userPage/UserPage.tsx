import { useParams } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import UserComments from './UserComments';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import AnotherUserRecipeDashboard from './AnotherUserRecipeDashboard';
import { useEffect } from 'react';
import DeleteUserAccount from '../../../app/common/modals/DeleteUserAccount';

export default observer(function UserPage() {
    const { commentStore, userRecipesStore, userStore, modalStore, pageOptionButtonStore } = useStore();

    const { userName } = useParams();

    useEffect(() => {
        if (userStore.user?.role === 'Administrator') {
            if (!pageOptionButtonStore.visible || pageOptionButtonStore.text !== 'Delete user account') {
                pageOptionButtonStore.setCallback(() =>
                    modalStore.openModal(<DeleteUserAccount userName={userName!} />)
                );
                pageOptionButtonStore.setText('Delete user account');
                pageOptionButtonStore.setVisible(true);
                pageOptionButtonStore.setLoading(false);
            }
        } else {
            if (pageOptionButtonStore.visible) {
                pageOptionButtonStore.setVisible(false);
                pageOptionButtonStore.setLoading(false);
            }
        }
    }, [pageOptionButtonStore, modalStore, userStore.user?.role, userName]);

    if (commentStore.loadingComments) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return <LoadingComponent content="Loading user comments..." />;
    }

    if (userRecipesStore.loadingAnotherUserRecipes) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return <LoadingComponent content="Loading user recipes..." />;
    }

    if (userStore.loading) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return <LoadingComponent content="Loading user..." />;
    }

    if (!userName) return <></>;

    return (
        <>
            <AnotherUserRecipeDashboard username={userName} />
            <UserComments username={userName} />
        </>
    );
});
