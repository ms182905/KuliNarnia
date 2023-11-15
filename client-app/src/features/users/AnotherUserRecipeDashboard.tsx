import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Header, Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { Link } from 'react-router-dom';

interface Props {
    username: string;
}

export default observer(function AnotherUserRecipeDashboard({ username }: Props) {
    const { userRecipesStore, userStore } = useStore();
    const { loadAnotherUserRecipes, anotherUserRecipes } = userRecipesStore;

    useEffect(() => {
        if (userRecipesStore.anotherUserUsername !== username) loadAnotherUserRecipes(username);
    }, [loadAnotherUserRecipes, userRecipesStore.anotherUserUsername, username]);

    return (
        <>
            <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                {userStore.user?.username === username ? (
                    <Header>Your recently added recipes</Header>
                ) : (
                    <Header>{username}`s recently added recipes</Header>
                )}
            </Segment>
            <Segment attached>
                {anotherUserRecipes.length !== 0 ? (
                    <>
                        <Segment.Group>
                            {anotherUserRecipes.map((recipe) => (
                                <Segment>
                                    <Item.Group>
                                        <Item>
                                            <Item.Image
                                                size="tiny"
                                                circular
                                                src={recipe.photos?.at(0)?.url || '/assets/placeholder.png'}
                                            />
                                            <Item.Content>
                                                <Item.Header as={Link} to={`/recipes/${recipe.id}`}>
                                                    {recipe.title}
                                                </Item.Header>
                                            </Item.Content>
                                        </Item>
                                    </Item.Group>
                                </Segment>
                            ))}
                        </Segment.Group>
                    </>
                ) : (
                    <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                        No recipes yet!
                    </Header>
                )}
            </Segment>
        </>
    );
});
