import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity } from '../models/activity';

export default class ActivityStore {
    activityTable: Activity[] = [];
    loading = false;
    loadingInitial = false;
    activitiesNumber = 0;
    pageCapacity = 15;
    activityDashboardPageNumber = 1;

    constructor() {
        makeAutoObservable(this);
    }

    get activities() {
        return this.activityTable.slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }

    loadActivities = async (pageNumber: number) => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activity.list(
                (pageNumber - 1) * this.pageCapacity,
                (pageNumber - 1) * this.pageCapacity + this.pageCapacity
            );
            activities.activities.forEach((activity) => {
                this.setActivity(activity);
            });
            this.setActivitiesNumber(activities.count);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    handlePageChange = async (pageNumber: number) => {
        this.activityTable = [];
        this.activityDashboardPageNumber = pageNumber;
    };

    private setActivity = (activity: Activity) => {
        const dateTimeParts = activity.date.split('T');
        const date = dateTimeParts[0];
        const time = dateTimeParts[1].split('.')[0];
        activity.date = `${date} ${time}`;
        this.activityTable.push(activity);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };

    setActivitiesNumber = (activitiesNumber: number) => {
        this.activitiesNumber = activitiesNumber;
    };

    reset = () => {
        runInAction(() => {
            this.activityDashboardPageNumber = 1;
            this.activityTable = [];
            this.activitiesNumber = 0;
        });
    };
}
