import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Availability {
    weekday: number;
    start_time: string;
    end_time: string;
    venue_id: number;
    is_open: boolean;
}

interface VenueType {
    type_id: number;
    type_name: string;
}

interface Venue {
    venue_id: number;
    name: string;
    type_id: number;
}

export const AvailabilitySettingsPage: React.FC = () => {
    const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenueType, setSelectedVenueType] = useState<number | null>(
        null
    );
    const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [updatedItems, setUpdatedItems] = useState<Availability[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const venueResponse = await fetch(
                    "http://localhost:3690/venue",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!venueResponse.ok) throw new Error("Error fetching Venues");
                const venuesData = await venueResponse.json();
                setVenues(venuesData);

                const typeResponse = await fetch(
                    "http://localhost:3690/venuetype",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!typeResponse.ok)
                    throw new Error("Error fetching VenueTypes");
                const typesData = await typeResponse.json();
                setVenueTypes(typesData);
            } catch (error) {
                toast.error((error as Error).message);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        if (selectedVenueId) {
            const getAvailabilityByVenue = async (id: number) => {
                try {
                    const response = await fetch(
                        `http://localhost:3690/availability?venue_id=${id}`,
                        {
                            method: "GET",
                        }
                    );
                    if (!response.ok)
                        throw new Error("Error fetching availability");
                    const data = await response.json();
                    setAvailability(data.Availability);
                    console.log(data.Availability);
                    setUpdatedItems([]);
                } catch (error) {
                    toast.error((error as Error).message);
                }
            };
            getAvailabilityByVenue(selectedVenueId);
        }
    }, [selectedVenueId, selectedVenueType]);

    const handleToggle = (weekday: number) => {
        const updatedAvailability = availability.map((item) =>
            item.weekday === weekday
                ? { ...item, is_open: !item.is_open }
                : item
        );
        setAvailability(updatedAvailability);
        const updatedItem = updatedAvailability.find(
            (item) => item.weekday === weekday
        );
        if (updatedItem) {
            setUpdatedItems((prev) => {
                const exists = prev.find((item) => item.weekday === weekday);
                return exists
                    ? prev.map((item) =>
                          item.weekday === weekday ? updatedItem : item
                      )
                    : [...prev, updatedItem];
            });
        }
    };

    const handleTimeChange = (
        weekday: number,
        field: "start_time" | "end_time",
        value: string
    ) => {
        const updatedAvailability = availability.map((item) =>
            item.weekday === weekday ? { ...item, [field]: value } : item
        );
        setAvailability(updatedAvailability);

        const updatedItem = updatedAvailability.find(
            (item) => item.weekday === weekday
        );
        if (updatedItem) {
            setUpdatedItems((prev) => {
                const exists = prev.find((item) => item.weekday === weekday);
                return exists
                    ? prev.map((item) =>
                          item.weekday === weekday ? updatedItem : item
                      )
                    : [...prev, updatedItem];
            });
        }
    };

    const handleSave = async () => {
        try {
            const promises = updatedItems.map((item) => {
                fetch("http://localhost:3690/availability", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                });
                console.log(item);
            });
            await Promise.all(promises);
            toast.success("Changes saved successfully!");
            setUpdatedItems([]);
        } catch (error) {
            toast.error("Failed to save changes");
        }
    };

    return (
        <div className="space-y-4 p-2">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Venue Type:
                </label>
                <select
                    value={selectedVenueType || ""}
                    onChange={(e) => {
                        setSelectedVenueType(Number(e.target.value));
                        setSelectedVenueId(null);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="" disabled>
                        Select Venue Type
                    </option>
                    {venueTypes.map((type) => (
                        <option key={type.type_id} value={type.type_id}>
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
                    onChange={(e) => setSelectedVenueId(Number(e.target.value))}
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
                            <option key={venue.venue_id} value={venue.venue_id}>
                                {venue.name}
                            </option>
                        ))}
                </select>
            </div>

            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Day</th>
                        <th className="border px-4 py-2">Available</th>
                        <th className="border px-4 py-2">Start Time</th>
                        <th className="border px-4 py-2">End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ].map((day, index) => {
                        const available = availability.find(
                            (item) => item.weekday === index
                        );
                        return (
                            <tr key={index}>
                                <td className="border px-4 py-2">{day}</td>
                                <td className="border px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={available?.is_open || false}
                                        onChange={() => handleToggle(index)}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    {available?.is_open ? (
                                        <input
                                            type="time"
                                            value={available.start_time}
                                            onChange={(e) =>
                                                handleTimeChange(
                                                    index,
                                                    "start_time",
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded px-2 py-1"
                                        />
                                    ) : (
                                        "--"
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {available?.is_open ? (
                                        <input
                                            type="time"
                                            value={available.end_time}
                                            onChange={(e) =>
                                                handleTimeChange(
                                                    index,
                                                    "end_time",
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded px-2 py-1"
                                        />
                                    ) : (
                                        "--"
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Save
            </button>
        </div>
    );
};
