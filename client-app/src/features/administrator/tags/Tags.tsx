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
    const { userStore, tagStore, pageOptionButtonStore } = useStore();
    const { user } = userStore;
    const { tagsTable, loadTags, createTag, updateTag, deleteTag, loading } = tagStore;

    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <Segment clearing style={{ borderRadius: '1em' }}>
                <Header content="Create or Edit" sub color="black" />
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
                                    setTag({
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
                <Header>Existing tags</Header>
            </Segment>
            <Segment attached style={{ borderBottomLeftRadius: '1em', borderBottomRightRadius: '1em' }}>
                {tagsTable
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((tag) => (
                        <Segment key={tag.id} style={{ borderRadius: '1em' }}>
                            <strong>ID:</strong> {tag.id} <br />
                            <strong>Name:</strong> {capitalizeFirstLetter(tag.name)} <br />
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
                                        setTarget(tag.id);
                                        deleteTag(tag.id);
                                    }}
                                    loading={loading && target === tag.id}
                                />
                                <Button
                                    className="editPhotoButton"
                                    content="Edit"
                                    onClick={() => setTag(tag)}
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
