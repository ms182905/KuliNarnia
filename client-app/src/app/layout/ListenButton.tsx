import { Button, Icon } from 'semantic-ui-react';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import determinePattern from '../voiceRecognition/utterancePatterns';
import { router } from '../router/Routes';
import LoginOrRegister from '../common/modals/LoginOrRegister';

export default observer(function ListenButton() {
    const { listenButtonStore, userStore, modalStore } = useStore();
    const { visible, listening, setListening } = listenButtonStore;
    const { logout, user } = userStore;

    const recognition = useMemo(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.lang = 'pl-PL';
        recognitionInstance.interimResults = true;
        return recognitionInstance;
    }, []);

    function doActionOnPattern(pattern: string | null, transcript: string) {
        if (pattern !== null) {
            switch (pattern) {
                case "favourites":

                    router.navigate(`/favouriteRecipes`);
                    break;
                case "browser":
                    if (listenButtonStore.clearCriteriaCallback) {
                        listenButtonStore.clearCriteriaCallback();
                    }
                    router.navigate(`/recipes`);
                    break;
                case "recommendations":

                    router.navigate(`/recommendations`);

                    break;
                case "logout":

                    logout();

                    break;
                case "category": {
                    router.navigate(`/recipes`);
                    const words = transcript.split(" ");
                    let lastWord = words[words.length - 1];
                    if (lastWord === "główne" && words[words.length - 2] === "dania") {
                        lastWord = "dania główne";
                    }
                    if (listenButtonStore.categoryCallback) {
                        listenButtonStore.categoryCallback(lastWord);
                    }
                    break;
                }
                case "tag": {
                    router.navigate(`/recipes`);
                    const words = transcript.split(" ");
                    let lastWord = words[words.length - 1];
                    if (lastWord === "polska" && words[words.length - 2] === "kuchnia") {
                        lastWord = "kuchnia polska";
                    }
                    if (lastWord === "morza" && words[words.length - 2] === "owoce") {
                        lastWord = "owoce morza";
                    }
                    if (lastWord === "słodko" && words[words.length - 2] === "na") {
                        lastWord = "na słodko";
                    }
                    if (lastWord === "kuchnia" && words[words.length - 2] === "zdrowa") {
                        lastWord = "zdrowa kuchnia";
                    }
                    if (listenButtonStore.tagCallback) {
                        listenButtonStore.tagCallback(lastWord);
                    }
                    break;
                }
                case "search": {
                    router.navigate(`/recipes`);
                    const words = transcript.split(" ");
                    const phrase = words.slice(1).join(" ");
                    if (listenButtonStore.phraseCallback) {
                        listenButtonStore.phraseCallback(phrase);
                    }
                    break;
                }
                case "my_profile": {
                    router.navigate(`/userPage/${user?.username}`);
                    break;
                }
                case "my_recipes": {
                    router.navigate(`/userRecipes`);
                    break;
                }
                case "add_recipe": {
                    router.navigate(`/createRecipe`);
                    break;
                }
                default:
                    console.log("No matching pattern found or navigation necessary.");
            }
        }
    }

    useEffect(() => {
        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onresult = (event) => {
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    const transcript = result[0].transcript;
                    const pattern = determinePattern(transcript);
                    doActionOnPattern(pattern, transcript);  // Use the function to handle navigation
                    console.log(transcript);
                    console.log(pattern);
                    setListening(false);
                    recognition.stop();
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
            console.log("Started");
        }
    };

    if (!visible) {
        return <>
            <Button
                className="listenButton"
                circular
                onClick={() => modalStore.openModal(<LoginOrRegister />)}
            >
                <Button.Content>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon className={"listenIconNotListening"} inverted size="big" name="assistive listening systems" />
                        <p style={{ margin: 'auto' }}>{'Słuchaj'}</p>
                    </div>
                </Button.Content>
            </Button>
        </>;
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
                        <Icon className={listening ? "listenIconListening" : "listenIconNotListening"} inverted size="big" name="assistive listening systems" />
                        <p style={{ margin: 'auto' }}>{listening ? 'Zakończ' : 'Słuchaj'}</p>
                    </div>
                </Button.Content>
            </Button>
        </>
    );
});
