import { useParams } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import UserComments from './UserComments';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import AnotherUserRecipeDashboard from './AnotherUserRecipeDashboard';

export default observer(function UserPage() {
    const { commentStore, userRecipesStore } = useStore();

    const { userName } = useParams();

    if (commentStore.loadingComments) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading user comments..." />;
    }

    if (userRecipesStore.loadingAnotherUserRecipes) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading user recipes..." />;
    }

    if (!userName) return <></>;

    return (
        <>
            <AnotherUserRecipeDashboard username={userName} />
            <UserComments username={userName} />
        </>
    );
});
