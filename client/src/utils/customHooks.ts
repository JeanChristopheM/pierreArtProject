import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export type MessageType =
    | "set-id"
    | "message"
    | "navigate"
    | "error"
    | "set-id-confirmation"
    | "arrow-key"
    | "reset"
    | "activeClient";

export type Message = {
    type: MessageType;
    id?: string;
    message?: string;
    key?: string;
    url?: string;
};

export const useWebSocket = (url: string) => {
    const [message, setMessage] = useState<Message | null>(null);
    const [status, setStatus] = useState<"disconnected" | "connected">(
        "disconnected",
    );
    const [clientId, setClientId] = useState<number | null>(null);
    const [activeClient, setActiveClient] = useState<number | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const socketRef = useRef<WebSocket | null>(null);

    const navigate = useNavigate();

    const connect = useCallback(() => {
        // If there's an existing WebSocket connection that's open or connecting, don't create a new one
        if (
            socketRef.current &&
            (socketRef.current.readyState === WebSocket.OPEN ||
                socketRef.current.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            console.log("Connected to WebSocket server");
            setStatus("connected");
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessage(message);
            switch (message.type) {
                case "set-id-confirmation":
                    setClientId(message.id);
                    console.log(
                        "Received set-id-confirmation message:",
                        message.message,
                    );
                    break;
                case "error":
                    console.error("Received error message:", message.message);
                    break;
                case "navigate":
                    console.log("Received navigate message:", message.url);
                    navigate(message.url);
                    break;
                case "activeClient":
                    setActiveClient(message.id);
                    break;
                default:
                    console.log("Received message:", message);
            }
        };

        socketRef.current.onclose = () => {
            console.log("Disconnected from WebSocket server");
            setStatus("disconnected");
            // Try to reconnect after a delay
            setTimeout(connect, 3000);
        };

        socketRef.current.onerror = (error) => console.log(error);
    }, [navigate, url]);

    useEffect(() => {
        connect();

        // Clean up function to close the connection when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connect, url]); // Re-run effect if URL changes

    useEffect(() => {
        if (activeClient && clientId) {
            setIsActive(activeClient === clientId);
        }
    }, [activeClient, clientId]);

    const sendMessage = (data: unknown) => {
        if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
        ) {
            socketRef.current.send(JSON.stringify(data));
        }
    };

    return { status, clientId, isActive, message, sendMessage };
};