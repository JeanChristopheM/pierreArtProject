import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./utils/router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />,
);
