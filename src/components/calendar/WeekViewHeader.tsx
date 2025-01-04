import React, { FC, useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { BookingReducerProps } from "../../lib/bookingReducer";
import getCurrentUTCDate from "../../lib/getCurrentUTCDate";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

interface VenueType {
    type_id: number;
    type_name: string;
}

interface Venue {
    venue_id: number;
    name: string;
    type_id: number;
}

interface WeekViewHeaderProps extends BookingReducerProps {
    selectedVenueId: number | null;
    setSelectedVenueId: (id: number | null) => void;
}

const WeekViewHeader: FC<WeekViewHeaderProps> = ({
    state,
    dispatch,
    selectedVenueId,
    setSelectedVenueId,
}) => {
    const firstDayOfWeek = state.displayedDays[0];
    const monthAndYear = format(firstDayOfWeek, "MMMM yyyy");
    const isDisplayingToday = !!state.displayedDays.find((day) => {
        return isSameDay(getCurrentUTCDate(), day);
    });

    const [selectedVenueType, setSelectedVenueType] = useState<number | null>(
        null
    );
    const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);

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
            let data = await response.json();
            setVenues(data);

            const resp = await fetch("http://localhost:3690/venuetype", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!resp.ok) {
                toast.error("Error Fetching VenueTypes");
                return;
            }
            data = await resp.json();
            setVenueTypes(data);
        };
        getData();
    }, []);

    useEffect(() => {
        if (selectedVenueType !== null) {
            const validVenue = venues.find(
                (venue) =>
                    venue.venue_id === selectedVenueId &&
                    venue.type_id === selectedVenueType
            );
            if (!validVenue) {
                setSelectedVenueId(null);
            }
        }
    }, [selectedVenueType, venues, selectedVenueId]);

    return (
        <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex flex-row gap-5 items-center">
                <div>
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        <time dateTime={firstDayOfWeek.toDateString()}>
                            {monthAndYear}
                        </time>
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">IST</p>
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
                        onChange={(e) =>
                            setSelectedVenueId(Number(e.target.value))
                        }
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
            </div>

            <div className="flex items-center gap-2">
                <div className="border rounded-md hover:bg-gray-50 px-2 py-1.5 bg-white text-black border-gray-300 shadow-sm text-sm font-semibold">
                    <Link to="/addrequest">+ Request</Link>
                </div>
                <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                    <button
                        type="button"
                        disabled={isDisplayingToday}
                        onClick={() => dispatch({ type: "goToPrevWeek" })}
                        className={`flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 focus:relative md:w-9 md:pr-0 ${
                            isDisplayingToday
                                ? "cursor-not-allowed"
                                : "md:hover:bg-gray-50 hover:text-gray-500"
                        }`}
                    >
                        <span className="sr-only">Previous week</span>
                        <ChevronLeftIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "goToToday" })}
                        className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                    >
                        Today
                    </button>
                    <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "goToNextWeek" })}
                        className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                    >
                        <span className="sr-only">Next week</span>
                        <ChevronRightIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default WeekViewHeader;
