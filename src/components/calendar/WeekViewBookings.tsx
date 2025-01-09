import React, { FC } from "react";
import { parse, format, startOfDay, endOfDay, addDays } from "date-fns";
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

const splitBookingIntoDays = (booking: BookedSlot) => {
    const bookingStart = parse(
        booking.start_time,
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
        new Date()
    );
    const bookingEnd = parse(
        booking.end_time,
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
        new Date()
    );
    const segments = [];

    let currentDay = startOfDay(bookingStart);
    while (currentDay <= endOfDay(bookingEnd)) {
        let segmentStart =
            bookingStart < currentDay ? currentDay : bookingStart;
        let segmentEnd =
            bookingEnd > endOfDay(currentDay)
                ? endOfDay(currentDay)
                : bookingEnd;

        if (segmentStart < segmentEnd) {
            segments.push({
                ...booking,
                start_time: format(segmentStart, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
                end_time: format(segmentEnd, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            });
        }
        currentDay = addDays(currentDay, 1);
    }
    return segments;
};
const WeekViewBookings: FC<WeekViewBookingsProps> = ({ state, venueId }) => {
    if (!venueId) return null;

    const { data: allBookings = [], error } = useQuery<BookedSlot[] | null>({
        queryKey: ["bookableSlots", venueId],
        queryFn: async () => {
            if (venueId === null) {
                throw new Error("venueId cannot be null");
            }
            return await bookedSlotsQuery(state.displayedDays[0], venueId);
        },

        enabled: !!venueId,
    });

    if (error) {
        console.error("Error fetching bookings:", error);
        return <div>Error loading bookings: {error.message}</div>;
    }

    const isWithinDisplayedDays = (date: Date) => {
        const firstDay = startOfDay(state.displayedDays[0]);
        const lastDay = endOfDay(
            state.displayedDays[state.displayedDays.length - 1]
        );
        return date >= firstDay && date <= lastDay;
    };

    const splitAndFilterBookings = (
        bookings: BookedSlot[] | null
    ): BookedSlot[] => {
        if (!bookings) return [];
        return bookings.flatMap((booking) => {
            const bookingStart = parse(
                booking.start_time,
                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                new Date()
            );
            const bookingEnd = parse(
                booking.end_time,
                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                new Date()
            );

            if (
                isWithinDisplayedDays(bookingStart) ||
                isWithinDisplayedDays(bookingEnd)
            ) {
                if (bookingStart.toDateString() !== bookingEnd.toDateString()) {
                    return splitBookingIntoDays(booking);
                } else {
                    return [booking];
                }
            }
            return [];
        });
    };

    const filteredBookings = splitAndFilterBookings(allBookings).flat() || [];

    return (
        <>
            {state.displayedDays.map((day, dayIndex) => {
                const dayBookings = filteredBookings.filter((booking) => {
                    const bookingDate = parse(
                        booking.start_time,
                        "yyyy-MM-dd'T'HH:mm:ss'Z'",
                        new Date()
                    );
                    return (
                        isWithinDisplayedDays(bookingDate) &&
                        bookingDate <= endOfDay(day) &&
                        bookingDate >= startOfDay(day)
                    );
                });

                return (
                    <React.Fragment key={`day-${dayIndex}`}>
                        {dayBookings.map((booking: BookedSlot) => {
                            const bookingStart = parse(
                                booking.start_time,
                                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                                new Date()
                            );
                            const bookingEnd = parse(
                                booking.end_time,
                                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                                new Date()
                            );

                            return (
                                <BookBlocker
                                    key={`booking-${booking.id}-${format(bookingStart, "yyyy-MM-dd")}`}
                                    day={dayIndex + 1}
                                    gridRow={`${getMinutesFromMidnight(bookingStart) + 1} / span ${getMinutesFromMidnight(bookingEnd) - getMinutesFromMidnight(bookingStart)}`}
                                />
                            );
                        })}
                    </React.Fragment>
                );
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
