import { Button, Icon, SemanticICONS } from 'semantic-ui-react';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export default observer(function PageOptionButton() {
    const { pageOptionButtonStore } = useStore();
    const { visible, text, loading, callback } = pageOptionButtonStore;

    useEffect(() => {}, [visible, text, loading, callback]);

    if (!visible) {
        return <></>;
    }

    return (
        <>
            <Button
                className={`pageOptionButton`}
                circular
                onClick={callback}
                style={{ backgroundColor: getColorFromText(text) }}
                loading={loading}
            >
                <Button.Content>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon inverted size="big" name={getIconFromText(text)} />
                        <p style={{ marginLeft: '8px' }}>{text}</p>
                    </div>
                </Button.Content>
            </Button>
        </>
    );
});

function getIconFromText(text: string): SemanticICONS {
    if (text === 'Add to favourites') {
        return 'heart outline';
    }
    if (text === 'Remove from favourites') {
        return 'heart';
    }
    if (text === 'Add new recipe') {
        return 'add';
    }
    if (text === 'Manage recipe') {
        return 'cog';
    }
    if (text === 'Delete recipe') {
        return 'delete';
    }
    if (text === 'Delete user account') {
        return 'delete';
    }
    return 'bar';
}

function getColorFromText(text: string): string {
    if (text === 'Add to favourites') {
        return 'green';
    }
    if (text === 'Remove from favourites') {
        return 'red';
    }
    if (text === 'Add new recipe') {
        return 'green';
    }
    if (text === 'Manage recipe') {
        return 'orange';
    }
    if (text === 'Delete recipe') {
        return 'red';
    }
    if (text === 'Delete user account') {
        return 'red';
    }
    return 'blue';
}
