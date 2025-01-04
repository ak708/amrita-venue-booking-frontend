import React, { FC } from "react";
import { parse, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { bookedSlotsQuery } from "../../lib/api";
import { BookedSlot } from "../EventDetails";
import { BookingReducerProps } from "../../lib/bookingReducer";

const getMinutesFromMidnight = (time: Date) => {
    return time.getHours() * 60 + time.getMinutes();
};

interface WeekViewBookingsProps extends BookingReducerProps {
    venueId: number | null;
}
const WeekViewBookings: FC<WeekViewBookingsProps> = ({ state, venueId }) => {
    if (!venueId) return null;

    return (
        <>
            {state.displayedDays.map((day, dayIndex) => {
                const { data: bookings = [], error } = useQuery({
                    queryKey: bookedSlotsQuery(day, venueId)?.queryKey || [],
                    queryFn:
                        bookedSlotsQuery(day, venueId)?.queryFn ||
                        (() => Promise.resolve([])),
                });
                if (error) {
                    console.error("Error fetching bookings:", error);
                    return null;
                }

                return bookings.flatMap((booking) => {
                    const segments = splitBookingToDailySegments(
                        booking,
                        day,
                        state.venueAvailability
                    );
                    return segments.map((segment) => (
                        <BookBlocker
                            key={`${booking.id}-${format(segment.start, "HH:mm")}`}
                            day={dayIndex + 1}
                            gridRow={`${getMinutesFromMidnight(segment.start) + 1} / span ${
                                getMinutesFromMidnight(segment.end) -
                                getMinutesFromMidnight(segment.start)
                            }`}
                        />
                    ));
                });
            })}
        </>
    );
};

interface BookBlockerProps {
    day: number;
    gridRow: string;
}

const BookBlocker: FC<BookBlockerProps> = ({ day, gridRow }) => {
    return (
        <li
            className={`relative mt-px flex col-start-${day}`}
            style={{ gridRow }}
        >
            <div className="absolute inset-1 flex flex-col overflow-y-auto p-2 bg-blue-500 text-white">
                <p className="font-semibold">Booked</p>
            </div>
        </li>
    );
};

export default WeekViewBookings;
