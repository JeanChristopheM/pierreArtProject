import express from "express";
import { createServer } from "http";
import { WebSocket, Server as WebSocketServer } from "ws";
import cors from "cors";
import { Message } from "./interfaces";
import { handleMessage, handleRegistration } from "./handlers";
import path from "path";
import { isSocketAlreadyRegistered, sendActiveClient } from "./utils";

const app = express();
const port = 3000;

// Create a HTTP server
const server = createServer(app);

// Create a WebSocket server
const wss = new WebSocketServer({ noServer: true });
const clients = new Map<number, WebSocket>();
let activeClient = 1;
const getActiveClient = () => activeClient;
const setActiveClient = (callback: (ac: number) => number) => {
    activeClient = callback(activeClient);
};

app.use(cors()); // Enable CORS for all routes

// Serve static files from the "public" directory
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "index.html")),
);

wss.on("connection", (ws) => {
    handleRegistration(clients, ws);
    ws.on("message", (data) => {
        const message: Message = JSON.parse(data.toString());
        handleMessage(
            wss,
            ws,
            message,
            clients,
            getActiveClient,
            setActiveClient,
        );
        sendActiveClient(ws, activeClient);
    });
    ws.on("close", () => {
        const [isRegistered, id] = isSocketAlreadyRegistered(clients, ws);
        if (isRegistered) {
            clients.delete(id);
        }
    });
    sendActiveClient(ws, activeClient);
});

// Handle upgrade requests from Express
server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
