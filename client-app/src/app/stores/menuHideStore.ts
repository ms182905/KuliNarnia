import { makeAutoObservable } from 'mobx';

export default class MenuHideStore {
    state: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    change = () => {
        this.state = !this.state;
    };
}
