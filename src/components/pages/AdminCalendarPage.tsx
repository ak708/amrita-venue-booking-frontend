import React, { FC, useEffect, useRef, useState } from "react";
import MonthViewCalendar from "../calendar/MonthViewCalendar";
import CalendarHourRows from "../calendar/CalendarHourRows";
import { AdminCalendarTimeIndicator } from "../calendar/CalendarTimeIndicator";
import DayViewHeader from "../calendar/DayViewHeader";
import { useAdminReducer } from "../../lib/adminReducer";
import DayViewEventGrid from "../calendar/DayViewEventGrid";
import ScheduledEvents from "../calendar/ScheduledEvents";
import scrollToTime from "../../lib/scrollToTime";
import ScheduledEventModal from "../ScheduledEventModal";

const AdminCalendarPage: FC = () => {
    const { state, dispatch } = useAdminReducer();
    const reducerProps = { state, dispatch };
    const container = useRef<HTMLDivElement>(null);
    const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);

    useEffect(() => {
        scrollToTime(container, 7);
    }, [state.displayedDay]);

    useEffect(() => {
        console.log(selectedVenueId);
    }, [selectedVenueId]);

    return (
        <div className="flex flex-col h-screen">
            <ScheduledEventModal
                event={state.modalEvent}
                setClose={() => dispatch({ type: "hideScheduledEventModal" })}
            />

            <DayViewHeader
                selectedVenueId={selectedVenueId}
                setSelectedVenueId={setSelectedVenueId}
                {...reducerProps}
            />

            <div className="isolate flex flex-auto overflow-hidden bg-white">
                <div
                    ref={container}
                    className="flex flex-auto flex-col overflow-auto"
                >
                    <div className="flex w-full flex-auto">
                        <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
                        <div className="grid flex-auto grid-cols-1 grid-rows-1">
                            <CalendarHourRows />

                            <DayViewEventGrid>
                                <ScheduledEvents
                                    venueId={selectedVenueId}
                                    {...reducerProps}
                                />
                                <AdminCalendarTimeIndicator
                                    displayedDay={state.displayedDay}
                                />
                            </DayViewEventGrid>
                        </div>
                    </div>
                </div>

                <div className="hidden w-1/2 max-w-md flex-none border-l border-gray-100 px-8 py-10 md:block">
                    <MonthViewCalendar
                        venueId={selectedVenueId}
                        {...reducerProps}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminCalendarPage;
