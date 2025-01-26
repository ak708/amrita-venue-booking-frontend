import { useState, useEffect } from "react";
import { format } from "date-fns";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { utcToZonedTime } from "date-fns-tz";

interface Booking {
    id: number;
    start_time: string;
    end_time: string;
    venue_id: number;
    email: string;
    created_at: string;
    status: number;
    reason: string;
    approver_id: number;
}

interface Venue {
    id: number;
    name: string;
    type_id: number;
}

interface VenueType {
    id: number;
    type_name: string;
}

const RequestsPage = () => {
    // const [requests, setRequests] = useState<Booking[]>([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [activeTab, setActiveTab] = useState<
    //     "pending" | "approved" | "rejected"
    // >("pending");
    // const rowsPerPage = 20;

    // useEffect(() => {
    //     const fetchRequests = async () => {
    //         try {
    //             const approverId = Cookies.get("approver-id");
    //             if (!approverId) {
    //                 console.error("Approver ID is not set in cookies.");
    //                 return;
    //             }

    //             const response = await fetch(
    //                 `http://localhost:3690/booking?approver_id=${approverId}`,
    //                 {
    //                     method: "GET",
    //                     headers: { "Content-Type": "application/json" },
    //                 }
    //             );

    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch requests");
    //             }

    //             const data: Booking[] = await response.json();
    //             setRequests(data);
    //         } catch (error) {
    //             console.error("Error fetching requests:", error);
    //         }
    //     };

    //     fetchRequests();
    // }, []);

    // const filteredRequests = requests.filter((request) => {
    //     if (activeTab === "pending") return request.status === 0;
    //     if (activeTab === "approved") return request.status === 1;
    //     if (activeTab === "rejected") return request.status === 2;
    //     return false;
    // });

    // const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
    // const paginatedRequests = filteredRequests.slice(
    //     (currentPage - 1) * rowsPerPage,
    //     currentPage * rowsPerPage
    // );
    const [requests, setRequests] = useState<Booking[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<
        "pending" | "approved" | "rejected"
    >("pending");
    const rowsPerPage = 20;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const approverId = Cookies.get("approver-id");
                if (!approverId) {
                    console.error("Approver ID is not set in cookies.");
                    return;
                }

                const bookingResponse = await fetch(
                    `http://localhost:3690/booking?approver_id=${approverId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!bookingResponse.ok) {
                    throw new Error("Failed to fetch bookings");
                }
                const bookings: Booking[] = await bookingResponse.json();
                setRequests(bookings);

                const venueResponse = await fetch(
                    "http://localhost:3690/venue",
                    { method: "GET" }
                );
                if (!venueResponse.ok) {
                    throw new Error("Failed to fetch venues");
                }
                setVenues(await venueResponse.json());

                const venueTypeResponse = await fetch(
                    "http://localhost:3690/venuetype",
                    { method: "GET" }
                );
                if (!venueTypeResponse.ok) {
                    throw new Error("Failed to fetch venue types");
                }
                setVenueTypes(await venueTypeResponse.json());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const getVenueName = (venueId: number) => {
        const venue = venues.find((v: any) => v.venue_id === venueId);
        console.log(venue);
        return venue ? venue.name : "Unknown Venue";
    };

    const getVenueTypeName = (venueTypeId: number) => {
        const venueType = venueTypes.find(
            (vt: any) => vt.type_id === venueTypeId
        );
        console.log(venueType);
        return venueType ? venueType.type_name : "Unknown Type";
    };

    const filteredRequests = requests.filter((request) => {
        if (activeTab === "pending") return request.status === 0;
        if (activeTab === "approved") return request.status === 1;
        if (activeTab === "rejected") return request.status === 2;
        return false;
    });

    const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleApprove = async (id: number) => {
        try {
            const approverId = Cookies.get("approver-id");
            if (!approverId) {
                alert("Approver ID is missing. Please log in again.");
                return;
            }

            const response = await fetch("http://localhost:3690/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    approver_id: parseInt(approverId, 10),
                    booking_id: id,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to approve booking.");
            }

            toast.success(`Booking ID ${id} approved successfully.`);

            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id ? { ...request, status: 1 } : request
                )
            );
        } catch (error: any) {
            console.error("Error approving booking:", error);
            alert(`Failed to approve Booking ID ${id}: ${error.message}`);
        }
    };

    const handleReject = async (id: number) => {
        try {
            const approverId = Cookies.get("approver-id");
            if (!approverId) {
                alert("Approver ID is missing. Please log in again.");
                return;
            }

            const response = await fetch("http://localhost:3690/reject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    approver_id: parseInt(approverId, 10),
                    booking_id: id,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to reject booking.");
            }

            toast.success(`Booking ID ${id} rejected successfully.`);

            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id ? { ...request, status: 2 } : request
                )
            );
        } catch (error: any) {
            console.error("Error rejecting booking:", error);
            alert(`Failed to reject Booking ID ${id}: ${error.message}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Requests</h1>
            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
                {["pending", "approved", "rejected"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(
                                tab as "pending" | "approved" | "rejected"
                            );
                            setCurrentPage(1); // Reset to first page when switching tabs
                        }}
                        className={`px-4 py-2 rounded ${
                            activeTab === tab
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
                    </button>
                ))}
            </div>

            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Email
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Reason
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Start Time
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            End Time
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Venue Type
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Venue
                        </th>
                        {activeTab === "pending" && (
                            <th className="border border-gray-300 px-4 py-2 text-center">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedRequests.map((request) => {
                        const a = new Date(request.start_time);
                        console.log(a);
                        const b = format(
                            new Date(request.start_time),
                            "yyyy-MM-dd HH:mm"
                        );

                        console.log(b);
                        const utcStartDate = new Date(request.start_time);
                        const utcEndDate = new Date(request.end_time);

                        const utcFormattedEndDate = format(
                            utcToZonedTime(utcEndDate, "UTC"),
                            "yyyy-MM-dd HH:mm"
                        );
                        console.log(utcFormattedEndDate);
                        const utcFormattedStartDate = format(
                            utcToZonedTime(utcStartDate, "UTC"),
                            "yyyy-MM-dd HH:mm"
                        );
                        console.log(utcFormattedStartDate);
                        const venueName = getVenueName(request.venue_id);
                        const venueType = venues.find(
                            (v: any) => v.venue_id === request.venue_id
                        )?.type_id;
                        console.log(venueType);
                        const venueTypeName = venueType
                            ? getVenueTypeName(venueType)
                            : "Unknown Type";

                        return (
                            <tr
                                key={request.id}
                                className="odd:bg-white even:bg-gray-50"
                            >
                                <td className="border border-gray-300 px-4 py-2">
                                    {request.email}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {request.reason}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {format(
                                        utcToZonedTime(utcStartDate, "UTC"),
                                        "yyyy-MM-dd HH:mm"
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {format(
                                        utcToZonedTime(utcEndDate, "UTC"),
                                        "yyyy-MM-dd HH:mm"
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {venueTypeName}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {venueName}
                                </td>
                                {activeTab === "pending" && (
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            onClick={() =>
                                                handleApprove(request.id)
                                            }
                                            className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReject(request.id)
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default RequestsPage;
