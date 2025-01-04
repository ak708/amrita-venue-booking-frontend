import { FC, useEffect } from "react";
import {
    format,
    getDay,
    getHours,
    getMinutes,
    intervalToDuration,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { scheduledEventsQuery } from "../../lib/api";
import { booking } from "../../lib/client";
import { BookingReducerProps } from "../../lib/bookingReducer";
import getUTCDateFromISO from "../../lib/getUTCDateFromISO";

const BookedEvents: FC<
    BookingReducerProps & { selectedVenueId: number | null }
> = ({ state, dispatch, selectedVenueId, setSelectedVenueId }) => {
    const { data: bookedSlots = { bookings: [] } } = useQuery(
        scheduledEventsQuery(selectedVenueId)
    );
    const bookings = bookedSlots.bookings || [];

    useEffect(() => {
        console.log("bookedSlots", bookedSlots);
        console.log("bookings", bookings);
    }, [selectedVenueId, bookedSlots]);

    return (
        <>
            {bookings.map((slot: booking.Booking) => {
                try {
                    const start = getUTCDateFromISO(slot.start_time);
                    const end = getUTCDateFromISO(slot.end_time);

                    if (
                        !start ||
                        !end ||
                        isNaN(start.getTime()) ||
                        isNaN(end.getTime())
                    ) {
                        console.error("Invalid start or end date", {
                            start,
                            end,
                        });
                        return null;
                    }

                    const minutesFromMidnight =
                        getHours(start) * 60 + getMinutes(start);
                    const duration = intervalToDuration({ start, end });
                    const minutesDuration =
                        (duration.hours || 0) * 60 + (duration.minutes || 0);
                    const weekDay = getDay(start);

                    return (
                        <li
                            key={slot.id}
                            className={`relative mt-[5px] flex col-start-${
                                weekDay ? weekDay : 7
                            }`}
                            style={{
                                gridRow:
                                    minutesFromMidnight +
                                    " / span " +
                                    minutesDuration,
                            }}
                        >
                            <Event
                                event={slot}
                                state={state}
                                dispatch={dispatch}
                                selectedVenueId={selectedVenueId}
                                setSelectedVenueId={setSelectedVenueId}
                            />
                        </li>
                    );
                } catch (error) {
                    console.error("Error processing slot", slot, error);
                    return null;
                }
            })}
        </>
    );
};

export default BookedEvents;
const Event: FC<BookingReducerProps & { event: booking.Booking }> = ({
    event,
    dispatch,
}) => {
    const start = getUTCDateFromISO(event.start_time);
    const color = "green";
    const title = "Booked";

    return (
        <div
            onClick={() => dispatch({ type: "showBookingModal", value: event })}
            className={`
                group absolute inset-1 flex flex-col overflow-y-auto rounded-lg h-20
                bg-${color}-50 p-2 text-xs leading-5 hover:bg-${color}-100 cursor-pointer
            `}
        >
            <p className={`order-1 font-semibold text-${color}-700`}>{title}</p>
            <p className={`text-${color}-500 group-hover:text-${color}-700`}>
                <time dateTime={start.toString()}>
                    {format(start, "HH:mm")}
                </time>
            </p>
        </div>
    );
};
