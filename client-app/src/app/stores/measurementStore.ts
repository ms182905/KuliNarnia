import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Measurement } from '../models/measurement';

export default class MeasurementStore {
    measurementsTable: Measurement[] = [];
    loadingInitial = false;
    loading = false;

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

    createMeasurement = async (measurement: Measurement) => {
        this.setLoading(true);
        try {
            await agent.Measurements.create(measurement);
            runInAction(() => {
                this.measurementsTable.push(measurement);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateMeasurement = async (measurement: Measurement) => {
        this.setLoading(true);
        try {
            await agent.Measurements.update(measurement);
            runInAction(() => {
                this.measurementsTable = this.measurementsTable.filter((m) => m.id !== measurement.id);
                this.measurementsTable.push(measurement);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    deleteMeasurement = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Measurements.delete(id);
            runInAction(() => {
                this.measurementsTable = this.measurementsTable.filter((m) => m.id !== id);
            });
            this.setLoading(false);
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    };
}
