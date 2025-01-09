import React, { FC } from "react";
import { getHours, getMinutes, parse } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { availabilityQuery } from "../../lib/api";
import { BookingReducerProps } from "../../lib/bookingReducer";

const END_OF_DAY = 1440;

type Availability = {
    weekday: number;
    start_time?: string | undefined;
    end_time?: string | undefined;
    venue_id: number;
};

const getMinutesFromMidnight = (time: Date) => {
    return getHours(time) * 60 + getMinutes(time);
};

interface WeekViewAvailabilityProps extends BookingReducerProps {
    venueId: number | null;
}

const WeekViewAvailability: FC<WeekViewAvailabilityProps> = ({
    venueId,
    state,
}) => {
    const { data: availability = [], error: fetchError } = useQuery({
        queryKey: availabilityQuery(venueId).queryKey,
        queryFn: availabilityQuery(venueId).queryFn,
        enabled: !!venueId,
    });
    console.log(availability);

    if (fetchError) {
        console.error("Error fetching availability:", fetchError);
        return null;
    }

    if (!availability) return null;

    return (
        <>
            {Array.from({ length: 7 }, (_, index) => {
                const dayIndex = index;

                const dayAvailability = availability.filter(
                    (slot: Availability) =>
                        slot.weekday === dayIndex && slot.venue_id === venueId
                );

                if (dayAvailability.length === 0) {
                    return (
                        <Unavailable
                            key={`unavailable-all-day-${dayIndex}`}
                            day={dayIndex}
                            gridRow={`1 / span ${END_OF_DAY}`}
                        />
                    );
                }

                return (
                    <React.Fragment key={`day-${dayIndex}`}>
                        {dayAvailability.map(
                            ({
                                weekday,
                                start_time,
                                end_time,
                                venue_id,
                            }: Availability) => {
                                if (!start_time || !end_time) {
                                    return null;
                                }

                                const startDate = parse(
                                    start_time,
                                    "HH:mm:ss",
                                    new Date()
                                );
                                const endDate = parse(
                                    end_time,
                                    "HH:mm:ss",
                                    new Date()
                                );

                                return (
                                    <React.Fragment
                                        key={`slot-${dayIndex}-${index}`}
                                    >
                                        <Unavailable
                                            key={`unavailable-before-start-${dayIndex}-${index}`}
                                            day={dayIndex}
                                            gridRow={`1 / span ${getMinutesFromMidnight(startDate)}`}
                                        />
                                        <Unavailable
                                            key={`unavailable-after-end-${dayIndex}-${index}`}
                                            day={dayIndex}
                                            gridRow={`${getMinutesFromMidnight(endDate)} / span ${END_OF_DAY}`}
                                        />
                                    </React.Fragment>
                                );
                            }
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
};
export default WeekViewAvailability;

interface UnavailableProps {
    day: number;
    gridRow: string;
}

const Unavailable: FC<UnavailableProps> = ({ day, gridRow }) => {
    return (
        <li
            className={`relative mt-px flex col-start-${day}`}
            style={{ gridRow }}
        >
            <div
                className="group absolute inset-1 flex flex-col overflow-y-auto p-2 bg-repeat bg-contain"
                style={{ backgroundImage: "url(/frontend/unavailable-bg.svg)" }}
            />
        </li>
    );
    // };
    // import React, { FC } from "react";
    // import { getHours, getMinutes, parse } from "date-fns";
    // import { useQuery } from "@tanstack/react-query";
    // import { availabilityQuery, bookedSlotsQuery } from "../../lib/api";

    // const END_OF_DAY = 1440;

    // type Availability = {
    //     weekday: number;
    //     start_time?: string | undefined;
    //     end_time?: string | undefined;
    //     venue_id: number;
    // };

    // type BookedSlot = {
    //     id: number;
    //     start_time: string;
    //     end_time: string;
    //     venueId: number;
    // };

    // const getMinutesFromMidnight = (time: Date) =>
    //     getHours(time) * 60 + getMinutes(time);

    // interface WeekViewProps {
    //     venueId: number | null;
    //     date: Date;
    // }

    // const WeekView: FC<WeekViewProps> = ({ date, venueId }) => {
    //     const { data: availability = [], error: fetchError } = useQuery({
    //         queryKey: availabilityQuery(venueId).queryKey,
    //         queryFn: availabilityQuery(venueId).queryFn,
    //         enabled: !!venueId,
    //     });

    //     if (fetchError) {
    //         console.error("Error fetching availability:", fetchError);
    //         return null;
    //     }

    //     const fetchBookings = (date: Date) =>
    //         useQuery({
    //             queryKey: bookedSlotsQuery(date, venueId).queryKey,
    //             queryFn:
    //                 bookedSlotsQuery(date, venueId)?.queryFn ||
    //                 (() => Promise.resolve([])),
    //             enabled: !!venueId,
    //         });

    //     if (!availability) return null;

    //     return (
    //         <>
    //             {Array.from({ length: 7 }, (_, dayIndex) => {
    //                 const dayAvailability = availability.filter(
    //                     (slot: Availability) =>
    //                         slot.weekday === dayIndex && slot.venue_id === venueId
    //                 );

    //                 const { data: bookings = [], error: bookingError } =
    //                     fetchBookings(
    //                         new Date(
    //                             date.getFullYear(),
    //                             date.getMonth(),
    //                             date.getDate() + dayIndex
    //                         )
    //                     );

    //                 if (bookingError) {
    //                     console.error("Error fetching bookings:", bookingError);
    //                     return null;
    //                 }

    //                 return (
    //                     <React.Fragment key={`day-${dayIndex}`}>
    //                         {dayAvailability.length === 0 && (
    //                             <Unavailable
    //                                 key={`unavailable-all-day-${dayIndex}`}
    //                                 day={dayIndex}
    //                                 gridRow={`1 / span ${END_OF_DAY}`}
    //                             />
    //                         )}

    //                         {/* Bookings */}
    //                         {bookings.map(
    //                             ({ id, start_time, end_time }: BookedSlot) => {
    //                                 const startDate = parse(
    //                                     start_time,
    //                                     "HH:mm:ss",
    //                                     new Date()
    //                                 );
    //                                 const endDate = parse(
    //                                     end_time,
    //                                     "HH:mm:ss",
    //                                     new Date()
    //                                 );

    //                                 return (
    //                                     <BookBlocker
    //                                         key={`booking-${id}`}
    //                                         day={dayIndex + 1} // CSS grid-based indexing
    //                                         gridRow={`${getMinutesFromMidnight(startDate)} / span ${
    //                                             getMinutesFromMidnight(endDate) -
    //                                             getMinutesFromMidnight(startDate)
    //                                         }`}
    //                                     />
    //                                 );
    //                             }
    //                         )}

    //                         {/* Unavailability for each slot */}
    //                         {dayAvailability.map(({ start_time, end_time }) => {
    //                             if (!start_time || !end_time) return null;

    //                             const startDate = parse(
    //                                 start_time,
    //                                 "HH:mm:ss",
    //                                 new Date()
    //                             );
    //                             const endDate = parse(
    //                                 end_time,
    //                                 "HH:mm:ss",
    //                                 new Date()
    //                             );

    //                             return (
    //                                 <React.Fragment key={`slot-${dayIndex}`}>
    //                                     <Unavailable
    //                                         key={`unavailable-before-start-${dayIndex}`}
    //                                         day={dayIndex}
    //                                         gridRow={`1 / span ${getMinutesFromMidnight(startDate)}`}
    //                                     />
    //                                     <Unavailable
    //                                         key={`unavailable-after-end-${dayIndex}`}
    //                                         day={dayIndex}
    //                                         gridRow={`${getMinutesFromMidnight(endDate)} / span ${END_OF_DAY}`}
    //                                     />
    //                                 </React.Fragment>
    //                             );
    //                         })}
    //                     </React.Fragment>
    //                 );
    //             })}
    //         </>
    //     );
    // };

    // export default WeekView;

    // interface UnavailableProps {
    //     day: number;
    //     gridRow: string;
    // }

    // const Unavailable: FC<UnavailableProps> = ({ day, gridRow }) => {
    //     return (
    //         <li
    //             className={`relative mt-px flex col-start-${day}`}
    //             style={{ gridRow }}
    //         >
    //             <div
    //                 className="group absolute inset-1 flex flex-col overflow-y-auto p-2 bg-repeat bg-contain"
    //                 style={{ backgroundImage: "url(/frontend/unavailable-bg.svg)" }}
    //             />
    //         </li>
    //     );
    // };

    // interface BookBlockerProps {
    //     day: number;
    //     gridRow: string;
    // }

    // const BookBlocker: FC<BookBlockerProps> = ({ day, gridRow }) => {
    //     return (
    //         <li
    //             className={`relative mt-px flex col-start-${day}`}
    //             style={{ gridRow }}
    //         >
    //             <div className="absolute inset-1 flex flex-col overflow-y-auto p-2 bg-blue-500 text-white">
    //                 <p className="font-semibold">Booked</p>
    //             </div>
    //         </li>
    //     );
    // };
};
