import { AxiosError } from 'axios';
import { Message } from 'semantic-ui-react';

interface Props {
    errors: AxiosError | null;
}

interface ErrorData {
    code: string;
    description: string;
}

export default function ValidationErrors({ errors }: Props) {
    console.log(errors);
    if (!errors?.response) {
        return (
            <Message error>
                {errors && (
                    <Message.List>
                        {(errors as unknown as string[]).map((error, i) => (
                            <Message.Item key={i}>
                                {error}
                            </Message.Item>
                        ))}
                    </Message.List>
                )}
            </Message>
        );
    }

    return (
        <Message error>
            {errors && (
                <Message.List>
                    {(errors?.response?.data as ErrorData[]).map((error, i) => (
                        <Message.Item key={i}>
                            <strong>{error.code}:</strong> {error.description}
                        </Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    );
}
