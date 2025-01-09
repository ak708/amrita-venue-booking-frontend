import { FC, useMemo } from "react";
import {
    format,
    getHours,
    getMinutes,
    intervalToDuration,
    isSameDay,
    differenceInMinutes,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { scheduledEventsQuery } from "../../lib/api";
import { booking } from "../../lib/client";
import { AdminReducerProps } from "../../lib/adminReducer";
import getCurrentUTCDate from "../../lib/getCurrentUTCDate";
import getUTCDateFromISO from "../../lib/getUTCDateFromISO";

import { startOfDay, endOfDay, addDays } from "date-fns";

interface ScheduledEventsProps extends AdminReducerProps {
    venueId: number | null;
}

const ScheduledEvents: FC<ScheduledEventsProps> = ({
    state,
    dispatch,
    venueId,
}) => {
    const { data: scheduledEvents } = useQuery(scheduledEventsQuery(venueId));
    console.log(scheduledEvents);

    // const eventsToday = useMemo(() => {
    //     return (scheduledEvents?.bookings || [])
    //         .filter((event) => {
    //             const start = getUTCDateFromISO(event.start_time);
    //             const end = getUTCDateFromISO(event.end_time);
    //             return (
    //                 isSameDay(start, state.displayedDay) &&
    //                 isSameDay(end, state.displayedDay)
    //             );
    //         })
    //         .map((event) => {
    //             const start = getUTCDateFromISO(event.start_time);
    //             const end = getUTCDateFromISO(event.end_time);
    //             return { ...event, startTime: start, endTime: end };
    //         });
    // }, [scheduledEvents, state.displayedDay]);

    const eventsToday = useMemo(() => {
        return (scheduledEvents?.bookings || [])
            .flatMap((event) => {
                const start = getUTCDateFromISO(event.start_time);
                const end = getUTCDateFromISO(event.end_time);

                if (!isSameDay(start, end)) {
                    const events = [];
                    let currentDay = startOfDay(start);

                    while (currentDay <= endOfDay(end)) {
                        let segmentStart = currentDay;
                        let segmentEnd = endOfDay(currentDay);

                        if (isSameDay(currentDay, start)) {
                            segmentStart = start;
                        } else {
                            segmentStart = new Date(
                                currentDay.setHours(0, 0, 1, 0)
                            );
                        }
                        if (isSameDay(currentDay, end)) {
                            segmentEnd = end;
                        } else {
                            segmentEnd = new Date(
                                currentDay.setHours(23, 59, 59, 999)
                            );
                        }

                        if (segmentStart < segmentEnd) {
                            events.push({
                                ...event,
                                start_time: segmentStart.toISOString(),
                                end_time: segmentEnd.toISOString(),
                                startTime: segmentStart,
                                endTime: segmentEnd,
                            });
                        }
                        currentDay = addDays(currentDay, 1);
                    }
                    return events;
                } else {
                    return [
                        {
                            ...event,
                            startTime: start,
                            endTime: end,
                        },
                    ];
                }
            })
            .filter((event) => {
                return (
                    isSameDay(event.startTime, state.displayedDay) ||
                    isSameDay(event.endTime, state.displayedDay)
                );
            });
    }, [scheduledEvents, state.displayedDay]);

    return (
        <>
            {eventsToday.map((event, index) => {
                const start = event.startTime;
                const end = event.endTime;
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
    const start = getUTCDateFromISO(event.start_time);
    const end = getUTCDateFromISO(event.end_time);
    const isCurrentDay = isSameDay(getCurrentUTCDate(), start);
    const isPastEvent = start < getCurrentUTCDate();

    const color = useMemo(() => {
        if (isPastEvent) return "gray";
        if (isCurrentDay) return "pink";
        return "blue";
    }, [isCurrentDay, isPastEvent]);

    const minutesFromMidnightStart = start.getHours() * 60 + start.getMinutes();
    const minutesFromMidnightEnd = end.getHours() * 60 + end.getMinutes();
    const durationInMinutes = Math.max(30, differenceInMinutes(end, start));

    const heightInPixels = durationInMinutes * 1.2;
    const topOffset = minutesFromMidnightStart * 1.2;
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
