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
    const { userStore, measurementStore, pageOptionButtonStore } = useStore();
    const { user } = userStore;
    const { measurementsTable, loadMeasurements, createMeasurement, updateMeasurement, deleteMeasurement, loading, measurementsLoaded } =
        measurementStore;

    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

    const [measurement, setMeasurement] = useState<Measurement>({
        id: '',
        name: '',
    });

    const [target, setTarget] = useState('');

    if (user?.role !== 'Administrator') {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (measurementsTable.length < 1 && !measurementsLoaded) {
            loadMeasurements();
        }
    }, [measurementsTable, loadMeasurements]);

    if (measurementStore.loadingInitial) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <Segment clearing style={{ borderRadius: '1em' }}>
                <Header content="Create or Edit" sub color="black" />
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
                    {({ handleSubmit, isValid, isSubmitting, dirty, resetForm }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                            <MyTextInput placeholder="Name" name="name" />
                            <Button
                                className="positiveButton"
                                disabled={isSubmitting || !dirty || !isValid}
                                floated="left"
                                type="submit"
                                content="Submit"
                                loading={loading}
                                style={{ marginTop: '1em', marginBottom: '0.5em', width: '48%' }}
                            />
                            <Button
                                className="negativeButton"
                                floated="right"
                                type="button"
                                onClick={() => {
                                    setMeasurement({
                                        id: '',
                                        name: '',
                                    });
                                    resetForm();
                                }}
                                style={{ marginTop: '1em', marginBottom: '0.5em', width: '48%' }}
                            >
                                Cancel
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Segment>

            <Segment
                textAlign="center"
                attached="top"
                color="black"
                style={{ borderTopLeftRadius: '1em', borderTopRightRadius: '1em' }}
            >
                <Header>Existing measurements</Header>
            </Segment>
            <Segment attached style={{ borderBottomLeftRadius: '1em', borderBottomRightRadius: '1em' }}>
                {measurementsTable
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((measurement) => (
                        <Segment key={measurement.id} style={{ borderRadius: '1em' }}>
                            <strong>ID:</strong> {measurement.id} <br />
                            <strong>Name:</strong> {capitalizeFirstLetter(measurement.name)} <br />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    width: '20%',
                                }}
                            >
                                <Button
                                    className="negativeButton"
                                    content="Delete"
                                    onClick={() => {
                                        setTarget(measurement.id);
                                        deleteMeasurement(measurement.id);
                                    }}
                                    loading={loading && target === measurement.id}
                                />
                                <Button
                                    className="editPhotoButton"
                                    content="Edit"
                                    onClick={() => setMeasurement(measurement)}
                                    style={{ width: '100%', padding: '0', marginTop: '5px' }}
                                />
                            </div>
                        </Segment>
                    ))}
            </Segment>
        </>
    );
});

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
