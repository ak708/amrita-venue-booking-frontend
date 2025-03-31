import React from "react";
import toast from "react-hot-toast";
import {
    createHashRouter,
    Outlet,
    redirect,
    RouterProvider,
} from "react-router-dom";
import BookingCalendarPage from "./components/pages/BookingCalendarPage";
import HeaderNav from "./components/HeaderNav";
import LoginPage from "./components/pages/LoginPage"; // No action needed
import AdminLayout from "./components/AdminLayout";
import AdminCalendarPage from "./components/pages/AdminCalendarPage";
import AddApproverPage, {
    action as addApproverAction,
} from "./components/pages/AddApproverPage";
import { AvailabilitySettingsPage } from "./components/pages/AvailabilitySettingsPage";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RequestsPage from "./components/pages/RequestsPage";
import ApproversPage from "./components/pages/ApproversPage";
import AddVenuePage, {
    action as addVenueAction,
} from "./components/pages/AddVenuePage";
import VenuePage from "./components/pages/VenuePage";
import AddVenueTypePage, {
    action as addVenueTypeAction,
} from "./components/pages/AddVenueTypePage";
import AddRequestPage, {
    action as addRequestAction,
} from "./components/pages/AddRequestPage";
import HomePage from "./components/pages/HomePage";
import { action as loginAction } from "./components/pages/LoginPage";
import { jwtDecode } from "jwt-decode";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 10,
        },
    },
});

// Define a type for the decoded JWT token
interface DecodedToken {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

// Authentication check function
const checkAuth = (allowedRoles: string[]) => {
    const token = Cookies.get("auth-token");
    if (!token) {
        return redirect("/#/login");
    }

    try {
        const decoded: DecodedToken = jwtDecode(token);
        if (!allowedRoles.includes(decoded.role)) {
            toast.error("Unauthorized access");
            // return redirect("/#/login");
        }
        return null;
    } catch (error) {
        Cookies.remove("auth-token");
        toast.error("Invalid session, please log in again");
        return redirect("/#/login");
    }
};

const router = createHashRouter([
    {
        id: "root",
        path: "/",
        element: (
            <div className="flex flex-col h-screen">
                <HeaderNav />
                <Outlet />
            </div>
        ),
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "login",
                action: loginAction,
                element: <LoginPage />,
            },
            {
                path: "logout",
                loader() {
                    Cookies.remove("auth-token");
                    toast.success("Logged out");
                    return redirect("/#/");
                },
            },
            {
                path: "booking",
                element: <BookingCalendarPage />,
                loader: () => checkAuth(["student"]),
            },
            {
                path: "addrequest",
                action: addRequestAction,
                element: <AddRequestPage />,
                loader: () => checkAuth(["student"]), // Assuming only students can add requests
            },
            {
                path: "admin",
                element: <AdminLayout />,
                loader: () => checkAuth(["faculty", "admin"]),
                children: [
                    {
                        index: true,
                        element: <AdminCalendarPage />,
                    },
                    {
                        path: "availability",
                        element: <AvailabilitySettingsPage />,
                        errorElement: <AvailabilitySettingsPage />,
                    },
                    {
                        path: "approvers",
                        element: <ApproversPage />,
                        errorElement: <ApproversPage />,
                    },
                    {
                        path: "addapprover",
                        action: addApproverAction,
                        element: <AddApproverPage />,
                        errorElement: <AddApproverPage />,
                    },
                    {
                        path: "requests",
                        element: <RequestsPage />,
                        errorElement: <RequestsPage />,
                    },
                    {
                        path: "venue",
                        element: <VenuePage />,
                        errorElement: <VenuePage />,
                    },
                    {
                        path: "addvenue",
                        action: addVenueAction,
                        element: <AddVenuePage />,
                        errorElement: <AddVenuePage />,
                    },
                    {
                        path: "addvenuetype",
                        action: addVenueTypeAction,
                        element: <AddVenueTypePage />,
                        errorElement: <AddVenueTypePage />,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider
                router={router}
                fallbackElement={<p>Initial Load...</p>}
            />
        </QueryClientProvider>
    );
}

export default App;
