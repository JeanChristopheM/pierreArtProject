import { WebSocket, WebSocketServer } from "ws";

// Broadcast function to send a message to all connected clients
export const broadcast = (wss: WebSocketServer, data: string) => {
    wss.clients.forEach((client) => {
        client.send(data);
    });
};

export const sendError = (ws: WebSocket, message: string) => {
    ws.send(
        JSON.stringify({
            type: "error",
            message,
        }),
    );
};

export const sendNavigate = (ws: WebSocket, url: string) => {
    ws.send(
        JSON.stringify({
            type: "navigate",
            url,
        }),
    );
};

export const sendActiveClient = (ws: WebSocket, id: number) => {
    ws.send(
        JSON.stringify({
            type: "activeClient",
            id,
        }),
    );
};

/**
 * Checks if the WebSocket instance is already registered and returns the registered ID, if any.
 * @param clients - A map of client IDs to WebSocket instances.
 * @param ws - The WebSocket instance to check.
 * @returns A tuple containing a boolean indicating if the WebSocket is already registered and the registered ID, if any.
 */
export const isSocketAlreadyRegistered = (
    clients: Map<number, WebSocket>,
    ws: WebSocket,
): [boolean, number] => {
    for (const [id, client] of clients) {
        if (client === ws) {
            return [true, id];
        }
    }
    return [false, -1];
};
