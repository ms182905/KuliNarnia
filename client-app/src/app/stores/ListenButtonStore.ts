import { makeAutoObservable, runInAction } from 'mobx';

export default class ListenButtonStore {
    visible = true;
    listening = false;
    callback: (() => void) | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    setVisible = (visible: boolean) => {
        runInAction(() => {
            this.visible = visible;
        });
    };

    setListening = (listening: boolean) => {
        this.listening = listening;
    };

    setCallback = (callback: () => void) => {
        this.callback = callback;
    };
}
