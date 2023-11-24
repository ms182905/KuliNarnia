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
            <Header icon>
                <Icon name="search" />
                Oops - we've looked everywhere but could not find what you are looking for!
            </Header>
            <Segment.Inline>
                <Button as={Link} to="/recipes">
                    Return to Recipes page
                </Button>
            </Segment.Inline>
        </Segment>
    );
});
