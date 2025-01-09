import { useEffect, useRef, useState } from "react";
import { useBookingReducer } from "../../lib/bookingReducer";
import WeekViewHeader from "../calendar/WeekViewHeader";
import WeekViewDaysRow from "../calendar/WeekViewDaysRow";
import CalendarHourRows from "../calendar/CalendarHourRows";
import WeekViewDayDividers from "../calendar/WeekViewDayDividers";
import WeekViewEventGrid from "../calendar/WeekViewEventGrid";
import WeekViewAvailability from "../calendar/WeekViewAvailability";
import { BookingCalendarTimeIndicator } from "../calendar/CalendarTimeIndicator";
import BookingModal from "../BookingModal";
import scrollToTime from "../../lib/scrollToTime";
import WeekViewBookings from "../calendar/WeekViewBookings";

export default function BookingCalendarPage() {
    const { state, dispatch } = useBookingReducer();
    const container = useRef<HTMLDivElement>(null);
    const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
    const reducerProps = {
        state,
        dispatch,
        selectedVenueId,
        setSelectedVenueId,
    };
    useEffect(() => {
        const fetchApprovedBookings = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3690/approve?venue_id=${selectedVenueId}`,
                    {
                        method: "GET",
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch bookings");
                const bookings = await response.json();
                console.log(bookings.bookings);
                dispatch({ type: "setEvents", value: bookings.bookings });
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchApprovedBookings();
    }, [dispatch, selectedVenueId]);

    useEffect(() => {
        scrollToTime(container, 7);
    }, [state.displayedDays]);
    return (
        <div className="p-4 h-[calc(100vh-80px)] overflow-hidden">
            <BookingModal
                booking={state.modalEvent}
                setClose={() => dispatch({ type: "hideBookingModal" })}
            />
            <div className="flex flex-col h-full border border-gray-300">
                <WeekViewHeader
                    {...reducerProps}
                    selectedVenueId={selectedVenueId}
                    setSelectedVenueId={setSelectedVenueId}
                />
                <div
                    ref={container}
                    className="isolate flex flex-auto flex-col overflow-auto bg-white"
                >
                    <div
                        style={{ width: "165%" }}
                        className="flex flex-none flex-col max-w-none md:max-w-full"
                    >
                        <WeekViewDaysRow
                            {...reducerProps}
                            selectedVenueId={selectedVenueId}
                            setSelectedVenueId={setSelectedVenueId}
                        />
                        <div className="flex flex-auto">
                            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
                            <div className="grid flex-auto grid-cols-1 grid-rows-1">
                                <CalendarHourRows />
                                <WeekViewDayDividers />
                                <WeekViewEventGrid>
                                    <WeekViewAvailability
                                        {...reducerProps}
                                        venueId={selectedVenueId}
                                    />
                                    <WeekViewBookings
                                        {...reducerProps}
                                        venueId={selectedVenueId}
                                        setSelectedVenueId={setSelectedVenueId}
                                    />
                                    <BookingCalendarTimeIndicator
                                        displayedDays={state.displayedDays}
                                    />
                                </WeekViewEventGrid>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
