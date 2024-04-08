import { WebSocket, WebSocketServer } from "ws";
import { Message } from "./interfaces";
import {
    broadcast,
    isSocketAlreadyRegistered,
    sendError,
    sendNavigate,
} from "./utils";
import { CLIENT_AMOUNT } from "./constants";

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
    clients: Map<number, WebSocket>,
    getActiveClient: () => number,
    setActiveClient: (callback: (ac: number) => number) => void,
) => {
    switch (message.type) {
        case "set-id":
            const id = Number(message.id);
            handleRegistration(clients, ws, id);
            break;
        case "arrow-key":
            console.log(`Received arrow key press: ${message.key}`);
            switch (message.key) {
                case "ArrowUp":
                case "ArrowRight":
                    setActiveClient((old) =>
                        old >= CLIENT_AMOUNT ? 1 : old + 1,
                    );
                    break;
                case "ArrowDown":
                case "ArrowLeft":
                    setActiveClient((old) =>
                        old <= 1 ? CLIENT_AMOUNT : old - 1,
                    );
                    break;
                case "p":
                    broadcast(
                        wss,
                        JSON.stringify({ type: "navigate", url: "/pierre" }),
                    );
                    break;
                case "r":
                    broadcast(wss, JSON.stringify({ type: "reset" }));
                    break;
                default:
                    console.log("Unhandled key:", message.key);
            }
            broadcast(
                wss,
                JSON.stringify({
                    type: "activeClient",
                    id: getActiveClient(),
                }),
            );
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
    clients: Map<number, WebSocket>,
    ws: WebSocket,
    id?: number,
) => {
    const [socketAlreadyRegistered, socketId] = isSocketAlreadyRegistered(
        clients,
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
            sendNavigate(ws, `/${socketId}`);
        }
    } else {
        const slotContent = clients.get(id);

        if (socketAlreadyRegistered) {
            sendError(ws, `Client already registered under ${socketId}`);
            console.log(
                `Client tried to register with ID-${id} but already in use on ID-${socketId}`,
            );
            sendNavigate(ws, `/${socketId}`);
        }
        // else if (slotContent && slotContent !== ws) {
        //     sendError(ws, `ID-${id} is already in use`);
        //     console.log(
        //         `Client tried to register on ID-${id} but already in use`,
        //     );
        // }
        else {
            clients.set(id, ws);
            ws.send(
                JSON.stringify({
                    type: "set-id-confirmation",
                    message: `Client set to ID-${id}`,
                    id,
                }),
            );
            sendNavigate(ws, `/${id}`);
            console.log(`Client set to ID-${id}`);
        }
    }
};
