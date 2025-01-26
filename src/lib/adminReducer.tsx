import React from "react";
import { add, sub } from "date-fns";
import { booking } from "./client";
import getCurrentUTCDate from "./getCurrentUTCDate";

export interface AdminState {
    events: booking.Booking[];
    displayedDay: Date;
    modalEvent?: booking.Booking;
}

export type AdminAction =
    | {
          type: "setEvents";
          value: booking.Booking[];
      }
    | {
          type: "goToNextDay";
      }
    | {
          type: "goToPrevDay";
      }
    | {
          type: "goToToday";
      }
    | {
          type: "showScheduledEventModal";
          value: booking.Booking;
      }
    | {
          type: "hideScheduledEventModal";
      }
    | {
          type: "setDay";
          value: Date;
      };

export type AdminDispatch = React.Dispatch<AdminAction>;

export type AdminReducerProps = {
    state: AdminState;
    dispatch: AdminDispatch;
};

export function adminReducer(
    state: AdminState,
    action: AdminAction
): AdminState {
    switch (action.type) {
        case "setEvents": {
            return { ...state, events: action.value };
        }

        case "goToNextDay": {
            const displayedDay = add(state.displayedDay, { days: 1 });
            return { ...state, displayedDay };
        }

        case "goToPrevDay": {
            const displayedDay = sub(state.displayedDay, { days: 1 });
            return { ...state, displayedDay };
        }

        case "goToToday": {
            // Add 5 hours and 30 minutes to the current UTC date
            const displayedDay = add(getCurrentUTCDate(), {
                hours: 5,
                minutes: 30,
            });
            return { ...state, displayedDay };
        }

        case "showScheduledEventModal": {
            return { ...state, modalEvent: action.value };
        }

        case "hideScheduledEventModal": {
            return { ...state, modalEvent: undefined };
        }

        case "setDay": {
            // Add 5 hours and 30 minutes to the selected date
            const displayedDay = add(action.value, { hours: 5, minutes: 30 });
            return { ...state, displayedDay };
        }
    }
}

export const useAdminReducer = () => {
    const [state, dispatch] = React.useReducer(adminReducer, {
        // Add 5 hours and 30 minutes to the initial displayedDay
        displayedDay: add(getCurrentUTCDate(), { hours: 5, minutes: 30 }),
        events: [],
    });

    return { state, dispatch };
};
