import { WebSocket } from "ws";

export type ClientState = {
    currentScreen: string;
    socket: WebSocket | null;
};

export type State = Map<number, ClientState>;

export const defaultClientState = { currentScreen: "/blank", socket: null };

export const scenario: Map<number, number[]> = new Map([
    [0, [1, 2]],
    [1, [3, 3]],
    [2, [3, 3]],
    [3, [0, 0]],
]);

export const getActionIdFromLastActionId = (
    scenario: Map<number, number[]>,
    lastChoice: number,
    inputChoice: 0 | 1,
) => {
    return scenario.get(lastChoice)![inputChoice];
};

export const state = new Map<number, ClientState>([
    [1, { ...defaultClientState, currentScreen: "/salutcava" }],
    [2, { ...defaultClientState, currentScreen: "/oui" }],
    [3, { ...defaultClientState, currentScreen: "/non" }],
    [4, defaultClientState],
    [5, defaultClientState],
    [6, defaultClientState],
    [7, defaultClientState],
    [8, defaultClientState],
    [9, defaultClientState],
    [10, defaultClientState],
]);
