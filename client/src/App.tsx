import React, { useEffect } from "react";
import "./style/main.scss";
import { useWebSocket } from "./utils/customHooks";
import { Outlet, useNavigate } from "react-router-dom";

const App = () => {
    const { status, clientId, isActive, message, sendMessage } = useWebSocket(
        "ws://localhost:3000",
    );

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = ((e.target as HTMLFormElement)[0] as HTMLInputElement).value;
        sendMessage({ type: "set-id", id });
    };

    useEffect(() => {
        if (message?.type === "reset") {
            if (clientId) {
                navigate(`/${clientId}`);
            } else navigate("/");
        }
    }, [clientId, message, navigate]);

    return (
        <main className={isActive ? "active" : ""}>
            {clientId ? (
                <Outlet />
            ) : (
                <div id="client-id-selector">
                    <form action="submit" onSubmit={handleSubmit}>
                        <select name="client-id">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                        <button type="submit">Confirm</button>
                    </form>
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
