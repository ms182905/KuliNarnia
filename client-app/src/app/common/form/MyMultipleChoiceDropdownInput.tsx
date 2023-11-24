import { useField } from 'formik';
import React from 'react';
import { Dropdown, Form, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
}

export default function MyMultipleChoiceDropdownInput(props: Props) {
    const [field, meta, helpers] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Dropdown
                clearable
                options={props.options}
                value={field.value || []}
                onChange={(_, d) => helpers.setValue(d.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
                multiple
                selection
                style={{ fontFamily: 'Andale Mono, monospace', borderRadius: '1em' }}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">
                    {meta.error}
                </Label>
            ) : null}
        </Form.Field>
    );
}
