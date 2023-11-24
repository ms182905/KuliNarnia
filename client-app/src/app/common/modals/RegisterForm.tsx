import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../form/MyTextInput';
import { Button, Header } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import ValidationErrors from '../../../features/errors/ValidationErrors';
import { AxiosError } from 'axios';

export default observer(function RegisterForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch((error) => setErrors({ error }))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form
                    className="ui form error"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    style={{ fontFamily: 'Andale Mono, monospace' }}
                >
                    <Header
                        as="h2"
                        content="Sign up to KuliNarnia"
                        color="black"
                        textAlign="center"
                        style={{ fontFamily: 'Andale Mono, monospace' }}
                    />
                    <MyTextInput placeholder="Display name" name="displayName" />
                    <MyTextInput placeholder="Username" name="username" />
                    <MyTextInput placeholder="Email" name="email" />
                    <MyTextInput placeholder="Password" name="password" type="password" />
                    <ErrorMessage
                        name="error"
                        render={() => <ValidationErrors errors={errors.error as unknown as AxiosError} />}
                    />
                    <Button
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting}
                        positive
                        content="Register"
                        type="submit"
                        className="editPhotoButton"
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
});
