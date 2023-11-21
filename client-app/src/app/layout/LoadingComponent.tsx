import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({ inverted = true, content = 'Loading...' }: Props) {
    return (
            <Dimmer active={true} inverted={inverted} style={{ zIndex: 1000 /* Set your desired z-index value */ }}>
                <Loader content={content} />
            </Dimmer>
    );
}
