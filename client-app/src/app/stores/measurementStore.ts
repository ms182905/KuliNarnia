import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Measurement } from '../models/measurement';

export default class MeasurementStore {
    measurementsTable: Measurement[] = [];
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get measurements() {
        return this.measurementsTable;
    }

    loadMeasurements = async () => {
        this.setLoadingInitial(true);
        try {
            const measurements = await agent.Measurements.list();
            runInAction(() => {
                this.measurementsTable = measurements;
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };
}
