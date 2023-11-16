import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { router } from "../../../app/router/Routes";
import { useEffect } from "react";
import { Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function Tags() {
    const { userStore, tagStore } = useStore();
    const { user } = userStore;
    const { tagsTable, loadTags } = tagStore;

    if (user?.role !== "Administrator") {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (tagsTable.length < 1) {
            loadTags();
        }
    }, [tagsTable, loadTags]);

    if (tagStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading tags..." />;
    }

    return (
        <>
             <h2>Tags</h2>
            {tagsTable.map((tag) => (
                <Segment key={tag.id}>
                    <strong>ID:</strong> {tag.id} <br />
                    <strong>Name:</strong> {tag.name} <br />
                </Segment>
            ))}
        </>
    );
});
