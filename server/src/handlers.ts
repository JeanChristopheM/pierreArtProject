import { WebSocket, WebSocketServer } from "ws";

import {
    broadcast,
    isSocketAlreadyRegistered,
    sendError,
    sendNavigate,
} from "./utils";

import type { Message } from "./interfaces";
import { getActionIdFromLastActionId, type State } from "./constants";
import { actions } from "./actions";

/**
 * Handles incoming messages from WebSocket clients.
 *
 * @param wss - The WebSocket server instance.
 * @param ws - The WebSocket client instance.
 * @param message - The incoming message.
 * @param clients - A map of client IDs and their corresponding WebSocket instances.
 * @param getActiveClient - A function that returns the ID of the active client.
 * @param setActiveClient - A function that sets the active client ID.
 */
export const handleMessage = (
    wss: WebSocketServer,
    ws: WebSocket,
    message: Message,
    state: State,
    scenario: Map<number, number[]>,
    getLastStep: () => number,
    setLastStep: (callback: (old: number) => number) => void,
) => {
    switch (message.type) {
        case "set-id":
            const id = Number(message.id);
            handleRegistration(state, ws, id);
            break;
        // User makes a choice
        case "arrow-key":
            console.log(`Received arrow key press: ${message.key}`);
            for (const [id, clientState] of state) {
                clientState.currentScreen = "/blank";
            }
            const actionId = getActionIdFromLastActionId(
                scenario,
                getLastStep(),
                message.key === "1" ? 0 : 1,
            );
            actions.find((a) => a.id === actionId)!.fn(wss, state);
            setLastStep((old) => actionId);
            for (const [id, clientState] of state) {
                clientState.socket?.send(
                    JSON.stringify({
                        type: "navigate",
                        url: clientState.currentScreen,
                    }),
                );
            }
            break;
        case "navigate":
            wss.clients.forEach((client) => {
                sendNavigate(client, message.url!);
            });
            break;
        case "reset":
            broadcast(wss, JSON.stringify({ type: "reset" }));
            break;
        default:
            console.log("Unknown message type:", message.type);
    }
};

/**
 * Handles the registration of clients and assigns them an ID.
 * @param clients - A map of client IDs to WebSocket instances.
 * @param ws - The WebSocket instance of the client being registered.
 * @param id - Optional ID to assign to the client.
 */
export const handleRegistration = (
    state: State,
    ws: WebSocket,
    id?: number,
) => {
    const [socketAlreadyRegistered, socketId] = isSocketAlreadyRegistered(
        state,
        ws,
    );

    if (!id) {
        if (socketAlreadyRegistered) {
            ws.send(
                JSON.stringify({
                    type: "set-id-confirmation",
                    message: `Client set to ID-${socketId}`,
                    id: socketId,
                }),
            );
            sendNavigate(ws, `/${state.get(socketId)?.currentScreen}`);
        }
    } else {
        const slotContent = state.get(id);

        if (socketAlreadyRegistered) {
            sendError(ws, `Client already registered under ${socketId}`);
            console.log(
                `Client tried to register with ID-${id} but already in use on ID-${socketId}`,
            );
            sendNavigate(ws, `/${state.get(socketId)?.currentScreen}`);
        }
        // else if (slotContent && slotContent !== ws) {
        //     sendError(ws, `ID-${id} is already in use`);
        //     console.log(
        //         `Client tried to register on ID-${id} but already in use`,
        //     );
        // }
        else {
            state.set(id, {
                currentScreen: slotContent?.currentScreen || "/",
                socket: ws,
            });
            ws.send(
                JSON.stringify({
                    type: "set-id-confirmation",
                    message: `Client set to ID-${id}`,
                    id,
                }),
            );
            sendNavigate(ws, `${state.get(id)?.currentScreen}`);
            console.log(`Client set to ID-${id}`);
        }
    }
};
