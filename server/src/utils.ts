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
