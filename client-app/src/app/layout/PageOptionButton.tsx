import React, { useState } from 'react';
import { Button, Icon, SemanticICONS } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

export default observer(function PageOptionButton() {
    const { pageOptionButtonStore } = useStore();
    const { visible, text, loading, callback } = pageOptionButtonStore;

    const [hover, setHover] = useState(false);

    if (!visible) {
        return null;
    }

    const handleMouseEnter = () => setHover(true);
    const handleMouseLeave = () => setHover(false);

    const buttonStyle = {
        backgroundColor: hover ? getColorFromText(text) : undefined,
        color: hover ? 'white' : getColorFromText(text)
    };

    return (
        <Button
            className="pageOptionButton"
            circular
            onClick={callback}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={buttonStyle}
            loading={loading}
        >
            <Button.Content>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon inverted size="big" name={getIconFromText(text)} style={{ color: buttonStyle.color }} />
                    <p style={{ marginLeft: '8px' }}>{getNameFromText(text)}</p>
                </div>
            </Button.Content>
        </Button>
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

function getNameFromText(text: string): string {
    if (text === 'Add to favourites') {
        return 'Dodaj do ulubionych';
    }
    if (text === 'Remove from favourites') {
        return 'Usuń z ulubionych';
    }
    if (text === 'Add new recipe') {
        return 'Dodaj przepis';
    }
    if (text === 'Manage recipe') {
        return 'Zarządzaj przepisem';
    }
    if (text === 'Delete recipe') {
        return 'Usuń przepis';
    }
    if (text === 'Delete user account') {
        return 'Usuń konto użytkownika';
    }
    return 'blue';
}
