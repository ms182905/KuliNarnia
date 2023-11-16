import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { router } from "../../../app/router/Routes";

export default observer(function Tags() {
    const { userStore } = useStore();
    const { user } = userStore;

    if (user?.role !== "Administrator") {
        router.navigate('/not-found');
    }

    return (
        <>
            Tags
        </>
    );
});
