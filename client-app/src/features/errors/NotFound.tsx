import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { useEffect } from 'react';

export default observer(function NotFound() {
    const { pageOptionButtonStore } = useStore();
    useEffect(() => {
        if (pageOptionButtonStore.visible) {
            pageOptionButtonStore.setVisible(false);
            pageOptionButtonStore.setLoading(false);
        }
    }, [pageOptionButtonStore]);

    return (
        <Segment placeholder>
            <Header icon style={{ fontFamily: 'Andale Mono, monospace' }}>
                <Icon name="search" />
                Ups - nie udało się znaleźć!
            </Header>
            <Segment.Inline>
                <Button as={Link} to="/recipes" style={{ fontFamily: 'Andale Mono, monospace' }}>
                    Powrót do strony głównej
                </Button>
            </Segment.Inline>
        </Segment>
    );
});
