import { useEffect, useState } from 'react';
import { Button, DropdownProps, Grid, Header, Menu, Pagination, Select } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityList from './ActivityList';
import { router } from '../../../app/router/Routes';

export default observer(function ActivityDashboard() {
    const { activityStore, userStore } = useStore();
    const {
        loadActivities,
        activityTable,
        activitiesNumber,
        handlePageChange,
        pageCapacity,
        activityDashboardPageNumber,
        activitiesLoaded,
    } = activityStore;
    const { usernames, getUsernames } = userStore;

    const [selectedUsername, setSelectedUsername] = useState<string>(activityStore.selectedUser);
    const [usernamesList, setUsernamesList] = useState<{ text: string; value: string }[]>([]);

    if (userStore.user?.role !== 'Administrator') {
        router.navigate('/not-found');
    }

    useEffect(() => {
        if (activityTable.length < 1 && !activitiesLoaded) {
            loadActivities(activityDashboardPageNumber);
        }
    }, [loadActivities, activityTable.length, activityDashboardPageNumber, activityStore.selectedUser, activitiesLoaded]);

    useEffect(() => {
        if (usernames.length < 1 && userStore.user?.role === 'Administrator') {
            getUsernames();
        }
    }, [getUsernames, usernames.length, userStore.user?.role]);

    useEffect(() => {
        if (usernames.length > 0) {
            const tempUsernames: { text: string; value: string }[] = [];
            usernames.forEach((s) => tempUsernames.push({ text: s, value: s }));
            tempUsernames.sort((a, b) => a.text.localeCompare(b.text));
            setUsernamesList(tempUsernames);
        }
    }, [usernames]);

    if (activityStore.loadingInitial) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading activities..." />;
    }

    if (userStore.loading) {
        window.scrollTo(0, 0);
        return <LoadingComponent content="Loading users..." />;
    }

    const handleUsernameSelectChange = (_event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        setSelectedUsername(data.value as string);
    };

    const handleClearFilters = () => {
        setSelectedUsername('');
        activityStore.setSelectedUser('');
        activityStore.reset();
        activityStore.setActivitiesLoaded(false);
    };

    const handleApplyFilters = () => {
        activityStore.setSelectedUser(selectedUsername);
        activityStore.reset();
    };

    return (
        <>
            <Menu fluid vertical size="small" style={{ width: '100%', marginTop: 12 }}>
                <Header icon="filter" attached color="teal" content="Filters" />
                <Menu.Item>
                    <Grid columns={2}>
                        <Grid.Column width={12}>
                            <Select
                                fluid
                                clearable
                                options={usernamesList}
                                placeholder="Select user"
                                value={selectedUsername}
                                onChange={handleUsernameSelectChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid type="button" content="Apply" color="green" onClick={handleApplyFilters} />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid type="button" content="Clear" color="red" onClick={handleClearFilters} />
                        </Grid.Column>
                    </Grid>
                </Menu.Item>
            </Menu>
            <Header />
            <Grid>
                <Grid.Column width="16">
                    <ActivityList />
                </Grid.Column>
            </Grid>
            <Pagination
                defaultActivePage={activityDashboardPageNumber}
                totalPages={Math.ceil(activitiesNumber / pageCapacity)}
                size="huge"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '0.5em',
                    fontFamily: 'Andale Mono, monospace',
                    borderRadius: '1em',
                }}
                onPageChange={(_event, data) => {
                    handlePageChange(Number(data.activePage));
                    window.scrollTo(0, 0);
                }}
            />
        </>
    );
});
