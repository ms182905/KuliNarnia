import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Header, Icon, Item, Segment, Pagination } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';

interface Props {
    username: string;
}

export default observer(function AnotherUserRecipeList({ username }: Props) {
    const { userRecipesStore } = useStore();
    const {
        loadAnotherUserRecipes,
        anotherUserRecipes,
        handleAnotherUserPageChange,
        anotherUserRecipeDashboardPageNumber,
        changingAnotherUserRecipes,
        anotherUserRecipesNumber,
    } = userRecipesStore;

    useEffect(() => {
        if (userRecipesStore.anotherUserUsername !== username) loadAnotherUserRecipes(username, 0);
    }, [loadAnotherUserRecipes, userRecipesStore.anotherUserUsername, username]);

    return (
        <Segment attached loading={changingAnotherUserRecipes}>
            {anotherUserRecipes.length !== 0 || { changingAnotherUserRecipes } ? (
                <>
                    <Segment.Group>
                        {anotherUserRecipes.map((recipe) => (
                            <Segment key={recipe.id}>
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
                                            <Item.Description>
                                                <span>
                                                    <Icon name="clock" /> {recipe.date}
                                                </span>
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            </Segment>
                        ))}
                    </Segment.Group>
                    {Math.ceil(anotherUserRecipesNumber / userRecipesStore.pageCapacity) > 1 && (
                        <Pagination
                            activePage={anotherUserRecipeDashboardPageNumber + 1}
                            totalPages={Math.ceil(anotherUserRecipesNumber / userRecipesStore.pageCapacity)}
                            size="huge"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '0.5em',
                                fontFamily: 'Andale Mono, monospace',
                                borderRadius: '1em',
                            }}
                            onPageChange={(_event, data) => {
                                handleAnotherUserPageChange(Number(data.activePage) - 1);
                            }}
                        />
                    )}
                </>
            ) : (
                <Header textAlign="center" attached="bottom" style={{ border: '10px' }}>
                    No recipes yet!
                </Header>
            )}
        </Segment>
    );
});
