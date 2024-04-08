import { WebSocketServer } from "ws";
import { broadcast, sendNavigate } from "./utils";
import { State } from "./constants";

export const actions = [
    {
        id: 0,
        fn: (wss: WebSocketServer, state: State) => {
            state.set(1, { ...state.get(1)!, currentScreen: "/salutcava" });
            state.set(2, { ...state.get(2)!, currentScreen: "/oui" });
            state.set(3, { ...state.get(3)!, currentScreen: "/non" });
        },
    },
    {
        id: 1,
        fn: (wss: WebSocketServer, state: State) => {
            state.set(4, { ...state.get(4)!, currentScreen: "/video1" });
        },
    },
    {
        id: 2,
        fn: (wss: WebSocketServer, state: State) => {
            state.set(4, { ...state.get(4)!, currentScreen: "/pierre" });
        },
    },
    {
        id: 3,
        fn: (wss: WebSocketServer, state: State) => {
            for (const [id, socketState] of state) {
                socketState.currentScreen = "/pierre";
            }
        },
    },
];
