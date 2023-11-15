import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import UserComments from "./UserComments";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function UserPage() {
    const { commentStore } = useStore();

    const {userName} = useParams();

    if (commentStore.loadingComments) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading user comments..." />;
    }

    return (
        <>
            {userName? (<UserComments username={userName} />) : (<></>)}
        </>
    );
});
