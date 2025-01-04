import { FC, useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { AdminReducerProps } from "../../lib/adminReducer";
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

interface DayViewHeaderProps extends AdminReducerProps {
    selectedVenueId: number | null;
    setSelectedVenueId: (id: number | null) => void;
}
const DayViewHeader: FC<DayViewHeaderProps> = ({
    state,
    dispatch,
    selectedVenueId,
    setSelectedVenueId,
}) => {
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
    const [selectedVenueType, setSelectedVenueType] = useState<number | null>(
        null
    );
    const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
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
            <div>
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    <time dateTime={state.displayedDay.toDateString()}>
                        {format(state.displayedDay, "MMMM yyyy")}
                    </time>
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {format(state.displayedDay, "cccc")} - UTC time
                </p>
            </div>
            <div className="flex flex-row gap-5">
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

            <div className="flex items-center">
                <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "goToPrevDay" })}
                        className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                    >
                        <span className="sr-only">Previous day</span>
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
                        onClick={() => dispatch({ type: "goToNextDay" })}
                        className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                    >
                        <span className="sr-only">Next day</span>
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

export default DayViewHeader;
