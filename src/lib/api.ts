import getRequestClient from "./getRequestClient";
import { booking } from "./client";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const client = getRequestClient();

export const shiftAvailabilityArray = (arr: booking.Availability[]) => {
    return [...arr.slice(1), arr[0]];
};

export const unshiftAvailabilityArray = (arr: booking.Availability[]) => {
    return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
};

const getAvailability = async (
    venueId: number | null
): Promise<booking.Availability[]> => {
    const resp = await client.booking.GetAvailability(venueId);
    console.log(resp.Availability);
    return resp.Availability;
};

export const setAvailability = async (
    availability: booking.Availability[]
): Promise<void> => {
    return await client.booking.SetAvailability({
        Availability: unshiftAvailabilityArray(availability),
    });
};

export const availabilityQuery = (venueId: number | null) => ({
    queryKey: ["availability"],
    queryFn: async (): Promise<booking.Availability[]> => {
        const data = await getAvailability(venueId);
        console.log("Fetched Availability:", data);
        return data;
    },
});

export const bookedSlotsQuery = async (
    fromdate: Date,
    venueId: number
): Promise<booking.BookedSlot[] | null> => {
    const dateStr = format(fromdate, "yyyy-MM-dd'T'HH:mm:ss'Z'");

    if (venueId === null) {
        throw new Error("venueId cannot be null");
    }
    const resp = await client.booking.GetBookedSlots(dateStr, venueId);
    console.log(resp.bookings);
    return resp.bookings;
};
export const scheduledEventsQuery = (venueId: number | null) => {
    return {
        queryKey: ["scheduledEvents"],
        queryFn: async () => await client.booking.ListBookings(venueId),
    };
};

export const confirmBookingMutation = (onSuccess: () => void) => {
    const queryClient = useQueryClient();

    return {
        mutationFn: (params: booking.BookParams) => {
            return client.booking.Book({ ...params, start: params.start });
        },
        onSuccess: async () => {
            onSuccess();
            await queryClient.invalidateQueries({
                queryKey: ["bookableSlots"],
            });
        },
    };
};

export const deleteBookingMutation = (onSuccess: () => void) => {
    const queryClient = useQueryClient();

    return {
        mutationFn: (id: number) => {
            return client.booking.DeleteBooking(id);
        },
        onSuccess: async () => {
            onSuccess();
            await queryClient.invalidateQueries({
                queryKey: ["scheduledEvents"],
            });
        },
    };
};
