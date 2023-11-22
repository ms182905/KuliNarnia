import { makeAutoObservable } from 'mobx';

export default class PageOptionButtonStore {
    visible = true;
    text = 'Add to favourites';
    loading = false;
    callback: (() => void) | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    setVisible = (visible: boolean) => {
        this.visible = visible;
    };

    setText = (text: string) => {
        this.text = text;
    };

    setLoading = (loading: boolean) => {
        this.loading = loading;
    };

    setCallback = (callback: () => void) => {
        this.callback = callback;
    };
}
