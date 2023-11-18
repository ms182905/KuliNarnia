import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { router } from '../../../app/router/Routes';
import { useEffect, useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { Measurement } from '../../../app/models/measurement';

export default observer(function Measurements() {
    const { userStore, measurementStore } = useStore();
    const { user } = userStore;
    const { measurementsTable, loadMeasurements, createMeasurement, updateMeasurement, deleteMeasurement, loading } =
        measurementStore;

    const [measurement, setMeasurement] = useState<Measurement>({
        id: '',
        name: '',
    });

    const [target, setTarget] = useState('');

    if (user?.role !== 'Administrator') {
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

    const measurementValidationSchema = Yup.object({
        name: Yup.string().matches(/^[^\s].*$/, 'Measurement name cannot start with a space'),
    });

    function handleFormSubmit(measurement: Measurement) {
        if (measurement.id) {
            updateMeasurement(measurement);
        } else {
            measurement.id = uuid();
            createMeasurement(measurement);
        }
    }

    return (
        <>
            <Segment clearing>
                <Header content="Measurements" sub color="teal" />
                <Formik
                    validationSchema={measurementValidationSchema}
                    enableReinitialize
                    initialValues={measurement}
                    onSubmit={(values, { resetForm }) => {
                        setMeasurement({
                            id: '',
                            name: '',
                        });
                        resetForm();
                        handleFormSubmit(values);
                    }}
                >
                    {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                            <MyTextInput placeholder="Name" name="name" />
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                floated="right"
                                positive
                                type="submit"
                                content="Submit"
                                loading={loading}
                            />
                            <Button
                                disabled={measurement.name.length === 0}
                                floated="right"
                                positive
                                color="red"
                                content="Cancel"
                                onClick={() => {
                                    setMeasurement({
                                        id: '',
                                        name: '',
                                    });
                                }}
                            />
                        </Form>
                    )}
                </Formik>
            </Segment>

            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                <Header>Existing measurements</Header>
            </Segment>
            <Segment attached>
                {measurementsTable
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((measurement) => (
                        <Segment key={measurement.id}>
                            <strong>ID:</strong> {measurement.id} <br />
                            <strong>Name:</strong> {capitalizeFirstLetter(measurement.name)} <br />
                            <Button.Group style={{ position: 'absolute', top: 10, right: 10 }}>
                                <Button
                                    color="red"
                                    content="Delete"
                                    onClick={() => {
                                        setTarget(measurement.id);
                                        deleteMeasurement(measurement.id);
                                    }}
                                    loading={loading && target === measurement.id}
                                />
                                <Button color="blue" content="Edit" onClick={() => setMeasurement(measurement)} />
                            </Button.Group>
                        </Segment>
                    ))}
            </Segment>
        </>
    );
});

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
