import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { router } from "../../../app/router/Routes";
import { useEffect } from "react";
import { Button, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function Measurements() {
    const { userStore, measurementStore } = useStore();
    const { user } = userStore;
    const { measurementsTable, loadMeasurements } = measurementStore;

    if (user?.role !== "Administrator") {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (measurementsTable.length < 1) {
            loadMeasurements();
        }
    }, [measurementsTable, loadMeasurements]);

    if (measurementStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading measurements..." />;
    }

    return (
        <>
            <h2>Categories</h2>
            {measurementsTable.map((measurement) => (
                <Segment key={measurement.id}>
                    <strong>ID:</strong> {measurement.id} <br />
                    <strong>Name:</strong> {capitalizeFirstLetter(measurement.name)} <br />
                    <Button color="red" content="Delete" style={{ position: 'absolute', top: 10, right: 10 }} />
                </Segment>
            ))}
        </>
    );
});

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}