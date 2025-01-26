import { FC, useEffect, useState, useMemo } from "react";
import {
    format,
    getHours,
    getMinutes,
    intervalToDuration,
    isSameDay,
    differenceInMinutes,
    parseISO,
    addDays,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useQuery } from "@tanstack/react-query";
import { scheduledEventsQuery } from "../../lib/api";
import { booking } from "../../lib/client";
import { AdminReducerProps } from "../../lib/adminReducer";
import { stat } from "fs";

interface ScheduledEventsProps extends AdminReducerProps {
    venueId: number | null;
}

// Define the type for an event
interface Event {
    start_time: string;
    end_time: string;
    startTime: Date;
    endTime: Date;
    id: number;
    venueId: number;
    email: string;
    createdAt: string;
    status: number;
    reason: string;
    approverId: number;
}

const ScheduledEvents: FC<ScheduledEventsProps> = ({
    state,
    dispatch,
    venueId,
}) => {
    const { data: scheduledEvents } = useQuery(scheduledEventsQuery(venueId));
    const [eventsToday, setEventsToday] = useState<Event[]>([]); // Initialize with the correct type

    useEffect(() => {
        if (scheduledEvents?.bookings) {
            const computedEvents = scheduledEvents.bookings
                .flatMap((event) => {
                    const start = parseISO(event.start_time);
                    const end = parseISO(event.end_time);

                    if (!isSameDay(start, end)) {
                        const events: Event[] = [];
                        let currentDay = new Date(start);
                        currentDay.setUTCHours(0, 0, 0, 0); // Start of the first day in UTC

                        while (currentDay <= end) {
                            let segmentStart = new Date(currentDay);
                            let segmentEnd = new Date(currentDay);

                            if (isSameDay(currentDay, start)) {
                                segmentStart.setTime(start.getTime());
                            } else {
                                segmentStart.setUTCHours(0, 0, 0, 0);
                            }

                            if (isSameDay(currentDay, end)) {
                                segmentEnd.setTime(end.getTime());
                            } else {
                                segmentEnd.setUTCHours(23, 59, 59, 999);
                            }

                            if (segmentStart < segmentEnd) {
                                console.log(segmentStart, segmentEnd);
                                events.push({
                                    ...event,
                                    start_time: segmentStart.toISOString(),
                                    end_time: segmentEnd.toISOString(),
                                    startTime: segmentStart,
                                    endTime: segmentEnd,
                                });
                            }

                            // Only proceed to the next day if we haven't ended on the start of the next day
                            if (
                                !(
                                    isSameDay(currentDay, end) &&
                                    start.getTime() === end.getTime()
                                )
                            ) {
                                console.log(currentDay);
                                currentDay = addDays(currentDay, 1);
                                currentDay.setUTCHours(0, 0, 0, 0);
                            } else {
                                break; // Stop creating segments if end time is at the start of the day
                            }
                        }
                        console.log(events);
                        return events;
                    } else {
                        return [{ ...event, startTime: start, endTime: end }];
                    }
                })
                .filter((event) => {
                    const eventStart = parseISO(event.start_time);
                    const eventEnd = parseISO(event.end_time);

                    // Convert displayedDay to UTC
                    const displayDayStart = new Date(state.displayedDay);
                    displayDayStart.setUTCHours(0, 0, 0, 0); // Start of the displayed day in UTC

                    const displayDayEnd = new Date(displayDayStart);
                    displayDayEnd.setUTCHours(23, 59, 59, 999); // End of the displayed day in UTC

                    return (
                        (eventStart >= displayDayStart &&
                            eventStart <= displayDayEnd) || // Starts within the displayed day
                        (eventEnd >= displayDayStart &&
                            eventEnd <= displayDayEnd) || // Ends within the displayed day
                        (eventStart <= displayDayStart &&
                            eventEnd >= displayDayEnd) // Spans the entire displayed day
                    );
                });

            setEventsToday(computedEvents);
        } else {
            setEventsToday([]); // Reset if no bookings
        }
        console.log(eventsToday);
        console.log(state.displayedDay);
    }, [scheduledEvents, state.displayedDay, venueId]);

    return (
        <>
            {eventsToday.map((event, index) => {
                const start = utcToZonedTime(event.startTime, "UTC");
                const end = utcToZonedTime(event.endTime, "UTC");
                const minutesFromMidnight =
                    getHours(start) * 60 + getMinutes(start);
                const duration = intervalToDuration({ start, end });
                const minutesDuration =
                    (duration.hours || 0) * 60 + (duration.minutes || 0);

                return (
                    <li
                        key={event.email + event.startTime.toISOString()}
                        className="relative flex col-start-1"
                        style={{
                            gridRow: `${minutesFromMidnight} / span ${minutesDuration}`,
                            marginTop: index > 0 ? "0" : "0",
                        }}
                    >
                        <Event
                            event={event}
                            state={state}
                            dispatch={dispatch}
                        />
                    </li>
                );
            })}
        </>
    );
};

const Event: FC<AdminReducerProps & { event: booking.Booking }> = ({
    event,
    dispatch,
}) => {
    const start = utcToZonedTime(parseISO(event.start_time), "UTC");
    const end = utcToZonedTime(parseISO(event.end_time), "UTC");
    const isCurrentDay = isSameDay(new Date(), start);
    const isPastEvent = start < new Date();

    const color = useMemo(() => {
        if (isPastEvent) return "gray";
        if (isCurrentDay) return "pink";
        return "blue";
    }, [isCurrentDay, isPastEvent]);

    const durationInMinutes = Math.max(30, differenceInMinutes(end, start));

    const heightInPixels = durationInMinutes * 1.2;
    return (
        <div
            onClick={() =>
                dispatch({ type: "showScheduledEventModal", value: event })
            }
            className={`group absolute flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5
                        bg-${color}-50 hover:bg-${color}-100 cursor-pointer`}
            style={{
                top: `${5}px`,
                height: `${heightInPixels}px`,
                left: 0,
                right: 0,
            }}
        >
            <p className={`font-semibold text-${color}-700`}>{event.email}</p>
            <p className={`text-${color}-500 group-hover:text-${color}-700`}>
                <time dateTime={start.toString()}>
                    {format(start, "dd-MM-yyyy HH:mm")} -{" "}
                    {format(end, "dd-MM-yyyy HH:mm")}
                </time>
            </p>
        </div>
    );
};

export default ScheduledEvents;
