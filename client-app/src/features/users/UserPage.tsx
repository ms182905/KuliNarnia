import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function UserPage() {
    const { recipeStore } = useStore();

    const { userName } = useParams();

    return (
        <>
            User: {userName}
        </>
    );
});
