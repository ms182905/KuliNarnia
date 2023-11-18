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
import { Tag } from '../../../app/models/tag';

export default observer(function Tags() {
    const { userStore, tagStore } = useStore();
    const { user } = userStore;
    const { tagsTable, loadTags, createTag, updateTag, deleteTag, loading } = tagStore;

    const [tag, setTag] = useState<Tag>({
        id: '',
        name: '',
    });

    const [target, setTarget] = useState('');

    if (user?.role !== 'Administrator') {
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

    const tagValidationSchema = Yup.object({
        name: Yup.string().matches(/^[^\s].*$/, 'Tag name cannot start with a space'),
    });

    function handleFormSubmit(tag: Tag) {
        if (tag.id) {
            updateTag(tag);
        } else {
            tag.id = uuid();
            createTag(tag);
        }
    }

    return (
        <>
            <Segment clearing>
                <Header content="Tags" sub color="teal" />
                <Formik
                    validationSchema={tagValidationSchema}
                    enableReinitialize
                    initialValues={tag}
                    onSubmit={(values, { resetForm }) => {
                        setTag({
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
                                disabled={tag.name.length === 0}
                                floated="right"
                                positive
                                color="red"
                                content="Cancel"
                                onClick={() => {
                                    setTag({
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
                <Header>Existing tags</Header>
            </Segment>
            <Segment attached>
                {tagsTable
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((tag) => (
                        <Segment key={tag.id}>
                            <strong>ID:</strong> {tag.id} <br />
                            <strong>Name:</strong> {capitalizeFirstLetter(tag.name)} <br />
                            <Button.Group style={{ position: 'absolute', top: 10, right: 10 }}>
                                <Button
                                    color="red"
                                    content="Delete"
                                    onClick={() => {
                                        setTarget(tag.id);
                                        deleteTag(tag.id);
                                    }}
                                    loading={loading && target === tag.id}
                                />
                                <Button color="blue" content="Edit" onClick={() => setTag(tag)} />
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
