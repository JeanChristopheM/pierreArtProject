export type MessageType =
    | "set-id"
    | "message"
    | "navigate"
    | "error"
    | "set-id-confirmation"
    | "arrow-key"
    | "activeClient"
    | "reset";

export type Message = {
    type: MessageType;
    id?: string;
    message?: string;
    key?: string;
    url?: string;
};
