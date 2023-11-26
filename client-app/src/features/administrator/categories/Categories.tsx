import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { router } from '../../../app/router/Routes';
import { useEffect, useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Category } from '../../../app/models/category';
import { v4 as uuid } from 'uuid';
import MyTextInput from '../../../app/common/form/MyTextInput';

export default observer(function Categories() {
    const { userStore, categoryStore, pageOptionButtonStore } = useStore();
    const { user } = userStore;
    const { categoriesTable, loadCategories, createCategory, updateCategory, deleteCategory, loading, categoriesLoaded } = categoryStore;

    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

    const [category, setCategory] = useState<Category>({
        id: '',
        name: '',
    });

    const [target, setTarget] = useState('');

    if (user?.role !== 'Administrator') {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (categoriesTable.length < 1 && !categoriesLoaded) {
            loadCategories();
        }
    }, [categoriesTable, loadCategories]);

    if (categoryStore.loadingInitial) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return <LoadingComponent content="Loading categories..." />;
    }

    const categoryValidationSchema = Yup.object({
        name: Yup.string().matches(/^[^\s].*$/, 'Category name cannot start with a space'),
    });

    function handleFormSubmit(category: Category) {
        if (category.id) {
            updateCategory(category);
        } else {
            category.id = uuid();
            createCategory(category);
        }
    }

    return (
        <>
            <Segment clearing style={{ borderRadius: '1em' }}>
                <Header content="Create or Edit" sub color="black" />
                <Formik
                    validationSchema={categoryValidationSchema}
                    enableReinitialize
                    initialValues={category}
                    onSubmit={(values, { resetForm }) => {
                        setCategory({
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
                                    setCategory({
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
                <Header>Existing categories</Header>
            </Segment>
            <Segment attached style={{ borderBottomLeftRadius: '1em', borderBottomRightRadius: '1em' }}>
                {categoriesTable
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                        <Segment key={category.id} style={{ borderRadius: '1em' }}>
                            <strong>ID:</strong> {category.id} <br />
                            <strong>Name:</strong> {capitalizeFirstLetter(category.name)} <br />
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
                                        setTarget(category.id);
                                        deleteCategory(category.id);
                                    }}
                                    loading={loading && target === category.id}
                                />
                                <Button
                                    className="editPhotoButton"
                                    content="Edit"
                                    onClick={() => setCategory(category)}
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
