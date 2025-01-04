import React, { FC } from "react";
import { format, intervalToDuration } from "date-fns";
import {
    CalendarIcon,
    ClockIcon,
    EnvelopeIcon,
    MapPinIcon,
    UserIcon,
    ClipboardDocumentIcon,
    CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import getUTCDateFromISO from "../lib/getUTCDateFromISO";

export interface BookedSlot {
    id: number;
    start_time: string;
    end_time: string;
    venueId: number;
    email: string;
    createdAt: string;
    status: number;
    reason: string;
    approverId: number;
}

const BookingDetails: FC<{ booking: BookedSlot }> = ({ booking }) => {
    const start = getUTCDateFromISO(booking.start_time);
    const end = getUTCDateFromISO(booking.end_time);
    const created = getUTCDateFromISO(booking.createdAt);
    console.log("BookingDetails", { start, end, created });
    const duration = intervalToDuration({ start, end });
    const durationStr =
        (duration.hours || 0) + (duration.minutes || 0) / 60 + "h";
    const dateStr =
        format(start, "HH:mm") +
        " - " +
        format(end, "HH:mm") +
        ", " +
        format(start, "EEEE, LLLL dd, yyyy") +
        " UTC";

    return (
        <ul className="divide-y divide-gray-200 w-full">
            <li className="flex items-center space-x-2 pb-2">
                <CalendarIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">{dateStr}</span>
            </li>

            <li className="flex items-center space-x-2 py-2">
                <ClockIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">{durationStr}</span>
            </li>

            <li className="flex items-center space-x-2 py-2">
                <MapPinIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">
                    Venue ID: {booking.venueId}
                </span>
            </li>

            <li className="flex items-center space-x-2 py-2">
                <EnvelopeIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">{booking.email}</span>
            </li>

            <li className="flex items-center space-x-2 py-2">
                <ClipboardDocumentIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">Reason: {booking.reason}</span>
            </li>

            <li className="flex items-center space-x-2 py-2">
                <UserIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">
                    Approver ID: {booking.approverId}
                </span>
            </li>

            <li className="flex items-center space-x-2 py-2">
                <CheckBadgeIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">Status: {booking.status}</span>
            </li>

            <li className="flex items-center space-x-2 pt-2">
                <CalendarIcon className="h-5 w-5" />{" "}
                <span className="text-gray-500">
                    Created At:{" "}
                    {format(created, "EEEE, LLLL dd, yyyy HH:mm 'UTC'")}
                </span>
            </li>
        </ul>
    );
};

export default BookingDetails;
