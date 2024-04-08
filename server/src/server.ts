import express from "express";
import { createServer } from "http";
import { WebSocket, Server as WebSocketServer } from "ws";
import cors from "cors";
import path from "path";

import { defaultClientState, state, scenario } from "./constants";
import { handleMessage, handleRegistration } from "./handlers";
import { isSocketAlreadyRegistered, sendActiveClient } from "./utils";

import type { Message } from "./interfaces";

const app = express();
const port = 3000;

let lastStep = 0;
const getLastStep = () => lastStep;
const setLastStep = (callback: (old: number) => number) => {
    lastStep = callback(lastStep);
};

// Create a HTTP server
const server = createServer(app);

// Create a WebSocket server
const wss = new WebSocketServer({ noServer: true });

app.use(cors()); // Enable CORS for all routes

// Serve static files from the "public" directory
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "index.html")),
);

wss.on("connection", (ws) => {
    handleRegistration(state, ws);

    ws.on("message", (data) => {
        const message: Message = JSON.parse(data.toString());
        handleMessage(
            wss,
            ws,
            message,
            state,
            scenario,
            getLastStep,
            setLastStep,
        );
    });

    ws.on("close", () => {
        const [isRegistered, id] = isSocketAlreadyRegistered(state, ws);

        if (isRegistered) {
            state.set(id, defaultClientState);
        }
    });
});

// Handle upgrade requests from Express
server.on("upgrade", (request, socket, head) => {
    console.log(
        "Client connected to http server asking for upgrade to WebSocket",
    );
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
