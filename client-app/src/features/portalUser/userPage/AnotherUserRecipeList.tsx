import { observer } from 'mobx-react-lite';
import { Segment, Pagination } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

interface Props {
    username: string;
}

export default observer(function AnotherUserRecipeList({ username }: Props) {
    const { userRecipesStore, userStore } = useStore();
    const {
        anotherUserRecipes,
        handleAnotherUserPageChange,
        anotherUserRecipeDashboardPageNumber,
        changingAnotherUserRecipes,
        anotherUserRecipesNumber,
    } = userRecipesStore;

    return (
        <div className="card__content" style={{ display: 'block', padding: '14px', marginTop: '0.5em' }}>
            <h2 style={{ textAlign: 'center', padding: '0.2em' }}>
                {userStore.user?.username === username
                    ? 'Your recently added recipes'
                    : username + '`s recently added recipes'}
            </h2>

            <Segment
                clearing
                loading={changingAnotherUserRecipes}
                style={{
                    border: 'none',
                    boxShadow: 'none',
                    width: '100%',
                    fontFamily: 'Andale Mono, monospace',
                }}
            >
                <>
                    {anotherUserRecipes !== undefined && anotherUserRecipes.length !== 0 ? (
                        anotherUserRecipes.map((recipe, index) => (
                            <div
                                key={index}
                                style={{
                                    gridTemplateAreas: "'text img'",
                                    width: '70%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                                className="card__content"
                            >
                                <div>
                                    <h2 style={{ fontSize: '1.6em' }}>{recipe.title}</h2>
                                    <p>
                                        <a
                                            href={`/recipes/${recipe.id}`}
                                            className="read-more-button"
                                            style={{ fontSize: '1.6em' }}
                                        >
                                            View
                                        </a>
                                    </p>
                                </div>
                                <figure>
                                    <img
                                        src={
                                            recipe.photos?.at(0) ? recipe.photos.at(0)?.url : '/assets/placeholder.png'
                                        }
                                        alt="Description"
                                    />
                                </figure>
                            </div>
                        ))
                    ) : (
                        <div
                            className="card__content"
                            style={{
                                gridTemplateAreas: "'text'",
                                textAlign: 'center',
                                gridTemplateColumns: '1fr',
                                width: '100%',
                            }}
                        >
                            <h2
                                style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    fontSize: '2em',
                                    fontFamily: 'Andale Mono, monospace',
                                }}
                            >
                                No recipes yet!
                            </h2>
                        </div>
                    )}

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
            </Segment>
        </div>
    );
});
