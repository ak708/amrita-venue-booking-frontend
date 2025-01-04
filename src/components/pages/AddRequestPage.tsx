import React, { FC, useEffect, useState } from "react";
import { Form, Link, LoaderFunctionArgs, redirect } from "react-router-dom";
import { toast } from "react-hot-toast";
interface VenueType {
    type_id: number;
    type_name: string;
}

interface Venue {
    venue_id: number;
    name: string;
    type_id: number;
}
interface Approver {
    id: number;
    name: string;
    email: string;
    hashedpassword: string;
}
export const action = async ({ request }: LoaderFunctionArgs) => {
    let formData = await request.formData();

    let start_time = formData.get("start_time")?.toString().trim();
    let end_time = formData.get("end_time")?.toString().trim();
    let venue_id = formData.get("venue_id")?.toString().trim();
    let email = formData.get("email")?.toString().trim();
    let reason = formData.get("reason")?.toString().trim();
    let approver_id = formData.get("approver_id")?.toString().trim();

    if (!start_time || !end_time || !venue_id || !email) {
        toast.error(
            "Missing required fields: start_time, end_time, venue_id, or email."
        );
        return null;
    }

    const startTimeDate = new Date(start_time);
    const endTimeDate = new Date(end_time);

    if (startTimeDate >= endTimeDate) {
        toast.error("Start time must be earlier than end time.");
        return null;
    }

    const newBookingRequest = {
        start_time,
        end_time,
        venue_id: parseInt(venue_id, 10),
        email,
        reason,
        approver_id: approver_id ? parseInt(approver_id, 10) : null,
    };

    try {
        const response = await fetch("http://localhost:3690/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBookingRequest),
        });
        console.log(response);
        console.log(newBookingRequest);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating booking request:", errorData.error);
            toast.error("Failed to create booking request.");
            return null;
        }

        toast.success("Booking request created!");
        return redirect("/");
    } catch (error: any) {
        console.error(
            "Error occurred while creating booking request:",
            error.error
        );
        toast.error("Error creating booking request.");
        return null;
    }
};

const AddRequestPage: FC = () => {
    const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
    const [selectedVenueType, setSelectedVenueType] = useState<number | null>(
        null
    );
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [selectedApproverId, setSelectedApproverId] = useState<number | null>(
        null
    );
    useEffect(() => {
        const getData = async () => {
            const response = await fetch("http://localhost:3690/venue", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                toast.error("Error fetching Venues");
                return;
            }
            let venuedata = await response.json();
            setVenues(venuedata);

            const resp = await fetch("http://localhost:3690/venuetype", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!resp.ok) {
                toast.error("Error Fetching VenueTypes");
                return;
            }
            let venuetypedata = await resp.json();
            setVenueTypes(venuetypedata);

            const approverresponse = await fetch(
                "http://localhost:3690/approver",
                {
                    method: "GET",
                    headers: { "Content-type": "application/json" },
                }
            );
            if (!approverresponse.ok) {
                toast.error("Error fetching approvers");
                return;
            }
            let approverdata = await approverresponse.json();
            console.log(approverdata);
            setApprovers(approverdata);
            console.log(approvers);
        };
        getData();
    }, []);
    return (
        <div className="flex-1">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create New Booking Request
                    </h2>
                </div>

                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="flex w-full justify-center">
                        <span className="mb-5 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20">
                            Booking Request Form
                        </span>
                    </div>

                    <Form className="space-y-6" method="post">
                        <div>
                            <label
                                htmlFor="start_time"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Start Time
                            </label>
                            <div className="mt-2">
                                <input
                                    id="start_time"
                                    name="start_time"
                                    type="datetime-local"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="end_time"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                End Time
                            </label>
                            <div className="mt-2">
                                <input
                                    id="end_time"
                                    name="end_time"
                                    type="datetime-local"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Venue Type:
                            </label>
                            <select
                                value={selectedVenueType || ""}
                                onChange={(e) =>
                                    setSelectedVenueType(Number(e.target.value))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="" disabled>
                                    Select Venue Type
                                </option>
                                {venueTypes.map((type) => (
                                    <option
                                        key={type.type_id}
                                        value={type.type_id}
                                    >
                                        {type.type_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Venue:
                            </label>
                            <select
                                value={selectedVenueId || ""}
                                onChange={(e) =>
                                    setSelectedVenueId(Number(e.target.value))
                                }
                                name="venue_id"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="" disabled>
                                    Select Venue
                                </option>
                                {venues
                                    .filter(
                                        (venue) =>
                                            selectedVenueType === null ||
                                            venue.type_id === selectedVenueType
                                    )
                                    .map((venue) => (
                                        <option
                                            key={venue.venue_id}
                                            value={venue.venue_id}
                                        >
                                            {venue.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Approver:
                            </label>
                            <select
                                value={selectedApproverId || ""}
                                name="approver_id"
                                onChange={(e) => {
                                    setSelectedApproverId(
                                        Number(e.target.value)
                                    );
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="" disabled>
                                    Select Approver
                                </option>
                                {approvers.map((approver) => (
                                    <option
                                        key={approver.id}
                                        value={approver.id}
                                    >
                                        {approver.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email Address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="reason"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Reason for Booking (Optional)
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="reason"
                                    name="reason"
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Submit Request
                            </button>
                        </div>

                        <div className="pt-1">
                            <Link
                                to="/"
                                className="text-blue-500 hover:text-blue-700 underline"
                            >
                                Back to Calendar
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AddRequestPage;
