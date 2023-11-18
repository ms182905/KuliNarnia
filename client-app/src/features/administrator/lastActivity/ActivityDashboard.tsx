import { useEffect } from 'react';
import { Grid, Pagination } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const {
        loadActivities,
        activityTable,
        activitiesNumber,
        handlePageChange,
        pageCapacity,
        activityDashboardPageNumber,
    } = activityStore;

    useEffect(() => {
        if (activityTable.length < 1) {
            loadActivities(activityDashboardPageNumber);
        }
    }, [loadActivities, activityTable.length, activityDashboardPageNumber]);

    if (activityStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading activities..." />;
    }

    return (
        <>
            <Grid>
                <Grid.Column width="16">
                    <ActivityList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={activityDashboardPageNumber}
                pointing
                secondary
                totalPages={Math.ceil(activitiesNumber / pageCapacity)}
                size="huge"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2em',
                    paddingBottom: '1em',
                }}
                onPageChange={(_event, data) => {
                    handlePageChange(Number(data.activePage));
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
