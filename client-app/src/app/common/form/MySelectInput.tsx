import { useField } from 'formik';
import React from 'react';
import { Form, Label, Select } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
}

export default function MySelectInput(props: Props) {
    const [field, meta, helpers] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label
                style={{
                    fontFamily: 'Andale Mono, monospace',
                    borderRadius: '1em',
                    width: '100%',
                    minWidth: '2em',
                    overflow: 'hidden',
                }}
            >
                {props.label}
            </label>
            <Select
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(_, d) => helpers.setValue(d.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
                style={{ fontFamily: 'Andale Mono, monospace', borderRadius: '1em', width: '100%', minWidth: '2em' }}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">
                    {meta.error}
                </Label>
            ) : null}
        </Form.Field>
    );
}
