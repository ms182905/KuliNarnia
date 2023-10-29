import { Measurement } from './measurement';

export interface Ingredient {
    id: string;
    name: string;
    amount: string;
    measurement: Measurement;
}
