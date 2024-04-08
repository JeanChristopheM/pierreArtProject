import React, { useEffect } from "react";
import "./style/main.scss";
import { useWebSocket } from "./utils/customHooks";
import { Outlet, useNavigate } from "react-router-dom";

const App = () => {
    const { status, clientId, message, sendMessage } = useWebSocket(
        `ws://${
            window.location.href.includes("localhost")
                ? "localhost"
                : "192.168.0.32"
        }:3000`,
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (message?.type === "reset") {
            if (clientId) {
                navigate(`/${clientId}`);
            } else navigate("/");
        }
    }, [clientId, message, navigate]);

    return (
        <main>
            {clientId ? (
                <Outlet />
            ) : (
                <div id="client-id-selector">
                    {Array.from(new Array(10)).map((c, i) => (
                        <button
                            key={i}
                            onClick={() =>
                                sendMessage({ type: "set-id", id: i + 1 })
                            }
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
            <div id="websocket-status">
                {status} |{" "}
                {clientId ? `client ${clientId}` : "No client ID set"}
            </div>
        </main>
    );
};

export default App;
