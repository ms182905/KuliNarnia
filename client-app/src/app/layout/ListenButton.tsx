import { Button, Icon } from 'semantic-ui-react';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import utterancePatterns from '../voiceRecognition/utterancePatterns';

export default observer(function ListenButton() {
    const { listenButtonStore } = useStore();
    const { visible, listening, setListening, callback } = listenButtonStore;

    const [transcript, setTranscript] = useState('');

    const recognition = useMemo(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.lang = 'pl-PL';
        recognitionInstance.interimResults = true;
        return recognitionInstance;
    }, []);
    
        useEffect(() => {
    
            recognition.onstart = () => {
                setListening(true);
            };


        recognition.onresult = (event) => {
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {  // Check if the result is final
                    const transcript = result[0].transcript;  // Access the first alternative's transcript
                    setTranscript(transcript);
                    if (transcript.toLowerCase().includes("pokaż mi ulubione przepisy")) {
                        //history.push('/favouriteRecipes');
                        console.log(transcript);
                        setListening(false);
                        recognition.stop();
                    }
                }
            }
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.onerror = (event) => {
            console.log("Speech recognition error", event.error);
        };

        return () => {
            recognition.stop();
        };
    }, [recognition]);

    const handleListen = () => {
        if (listening) {
            recognition.stop();
            setListening(false);
            console.log("Stopped");
        } else {
            recognition.start();
            setListening(true);
            console.log("started");
        }
    };

    if (!visible) {
        return <></>;
    }

    return (
        <>
            <Button
                className="listenButton"
                circular
                onClick={handleListen}
            >
                <Button.Content>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon className={listening? "listenIconListening" : "listenIconNotListening"} inverted size="big" name="assistive listening systems" />
                        <p style={{ marginLeft: '8px' }}>{listening ? 'Stop Listening' : 'Listen'}</p>
                    </div>
                </Button.Content>
            </Button>
        </>
    );
});