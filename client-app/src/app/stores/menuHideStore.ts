import { makeAutoObservable } from 'mobx';

export default class MenuHideStore {
    state: boolean =  true

    constructor() {
        makeAutoObservable(this);
    }

    change = () => {
        this.state = !this.state;
    };
}
