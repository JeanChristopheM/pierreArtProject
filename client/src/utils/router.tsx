import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import One from "../pages/One";
import Oui from "../pages/Oui";
import Non from "../pages/Non";
import Pierre from "../pages/Pierre";
import Four from "../pages/Four";
import Blank from "../pages/Blank";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>404 Route Not Found</div>,
        children: [
            {
                path: "/salutcava",
                element: <One />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/oui",
                element: <Oui />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/non",
                element: <Non />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/video1",
                element: <Four />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/pierre",
                element: <Pierre />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/blank",
                element: <Blank />,
                errorElement: <div>404 Route Not Found</div>,
            },
        ],
    },
]);

export default router;
