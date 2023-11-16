import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { router } from "../../../app/router/Routes";
import { useEffect } from "react";
import { Button, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function Categories() {
    const { userStore, categoryStore } = useStore();
    const { user } = userStore;
    const { categoriesTable, loadCategories } = categoryStore;

    if (user?.role !== "Administrator") {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (categoriesTable.length < 1) {
            loadCategories();
        }
    }, [categoriesTable, loadCategories]);

    if (categoryStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading categories..." />;
    }

    return (
        <>
            <h2>Categories</h2>
            {categoriesTable.map((category) => (
                <Segment key={category.id}>
                    <strong>ID:</strong> {category.id} <br />
                    <strong>Name:</strong> {capitalizeFirstLetter(category.name)} <br />
                    <Button color="red" content="Delete" style={{ position: 'absolute', top: 10, right: 10 }} />
                </Segment>
            ))}
        </>
    );
});

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}