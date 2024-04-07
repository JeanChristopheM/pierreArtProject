import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import One from "../pages/One";
import Two from "../pages/Two";
import Three from "../pages/Three";
import Pierre from "../pages/Pierre";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>404 Route Not Found</div>,
        children: [
            {
                path: "/1",
                element: <One />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/2",
                element: <Two />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/3",
                element: <Three />,
                errorElement: <div>404 Route Not Found</div>,
            },
            {
                path: "/pierre",
                element: <Pierre />,
                errorElement: <div>404 Route Not Found</div>,
            },
        ],
    },
]);

export default router;
