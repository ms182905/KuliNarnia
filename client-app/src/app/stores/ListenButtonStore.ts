import { makeAutoObservable, runInAction } from 'mobx';

export default class ListenButtonStore {
    visible = true;
    listening = false;
    callback: (() => void) | undefined;
    categoryCallback: ((categoryName: string) => void) | undefined;
    phraseCallback: ((categoryName: string) => void) | undefined;
    tagCallback: ((tagName: string) => void) | undefined;
    clearCriteriaCallback: (() => void) | undefined;

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

    setCategoryCallback = (categoryCallback: (categoryName: string) => void) => {
        this.categoryCallback = categoryCallback;
    }

    setPhraseCallback = (phraseCallback: (phrase: string) => void) => {
        this.phraseCallback = phraseCallback;
    }

    setTagCallback = (tagCallback: (tag: string) => void) => {
        this.tagCallback = tagCallback;
    }    
    
    setClearCriteriaCallback = (clearCriteriaCallback: () => void) => {
        this.clearCriteriaCallback = clearCriteriaCallback;
    }
}
