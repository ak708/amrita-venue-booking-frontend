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
import LoginPage, { action as loginAction } from "./components/pages/LoginPage";
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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 10,
        },
    },
});

const router = createHashRouter([
    {
        id: "root",
        path: "",
        children: [
            {
                path: "",
                element: (
                    <div className="flex flex-col h-screen">
                        <HeaderNav />
                        <Outlet />
                    </div>
                ),
                children: [
                    {
                        index: true,
                        element: <BookingCalendarPage />,
                    },
                    {
                        path: "login",
                        action: loginAction,
                        element: <LoginPage />,
                    },
                    {
                        path: "addrequest",
                        action: addRequestAction,
                        element: <AddRequestPage />,
                    },
                ],
            },
            {
                path: "logout",
                loader() {
                    Cookies.remove("auth-token");
                    toast.success("Logged out");
                    return redirect("/");
                },
            },
            {
                path: "admin",
                element: <AdminLayout />,
                loader() {
                    if (!Cookies.get("auth-token")) {
                        return redirect("/login");
                    }
                    return null;
                },
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
