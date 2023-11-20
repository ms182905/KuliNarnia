import { Button, Icon } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import {useEffect} from 'react';

export default observer(function MenuButton () {
    const {menuHideStore, userStore} = useStore();
    const {state} = menuHideStore;

    useEffect(() =>{}, [state])

    return (
        <> 
            <Button className={`menuButton`} circular onClick={() => menuHideStore.change()}>
                <Icon className={`${state ? "rotatedbars" : ""}`} inverted size='big' name='bars'/>
            </Button>
        </>  
    )
})