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
    const { userStore, categoryStore } = useStore();
    const { user } = userStore;
    const { categoriesTable, loadCategories, createCategory, updateCategory, deleteCategory, loading } = categoryStore;

    const [category, setCategory] = useState<Category>({
        id: '',
        name: '',
    });

    const [target, setTarget] = useState('');

    if (user?.role !== 'Administrator') {
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
            <Segment clearing>
                <Header content="Categories" sub color="teal" />
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
                                disabled={category.name.length === 0}
                                floated="right"
                                positive
                                color="red"
                                content="Cancel"
                                onClick={() => {
                                    setCategory({
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
                <Header>Existing categories</Header>
            </Segment>
            <Segment attached>
                {categoriesTable
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                        <Segment key={category.id}>
                            <strong>ID:</strong> {category.id} <br />
                            <strong>Name:</strong> {capitalizeFirstLetter(category.name)} <br />
                            <Button.Group style={{ position: 'absolute', top: 10, right: 10 }}>
                                <Button
                                    color="red"
                                    content="Delete"
                                    onClick={() => {
                                        setTarget(category.id);
                                        deleteCategory(category.id);
                                    }}
                                    loading={loading && target === category.id}
                                />
                                <Button color="blue" content="Edit" onClick={() => setCategory(category)} />
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
