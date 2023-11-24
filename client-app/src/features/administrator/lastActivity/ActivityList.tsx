import { Header, Icon, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';

export default function ActivityList() {
    const { activityStore } = useStore();
    const { activities } = activityStore;

    return (
        <>
            <Segment clearing style={{ borderRadius: '1em' }}>
                {activities.map((activity, index) => (
                    <Segment key={index} raised style={{ borderRadius: '1em' }}>
                        <Header as={Link} to={`/recipes/${activity.recipeId}`} color="black">
                            {activity.type === 'CommentAdded' && <Icon name="comment" color="teal" />}
                            {activity.type === 'RecipeCreated' && <Icon name="add" color="green" />}
                            {activity.type === 'RecipeEdited' && <Icon name="edit" color="blue" />}
                            {activity.text}
                        </Header>
                        <Segment.Group horizontal style={{ borderRadius: '1em' }}>
                            <Segment>
                                <p>Date: {activity.date}</p>
                            </Segment>
                            <Segment>
                                <p>
                                    User: <Link to={`/userPage/${activity.userName}`}>{activity.userName}</Link>
                                </p>
                            </Segment>
                        </Segment.Group>
                    </Segment>
                ))}
            </Segment>
        </>
    );
}
