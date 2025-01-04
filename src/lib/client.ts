export type BaseURL = string;

export const Local: BaseURL = "http://localhost:3690";

export function Environment(name: string): BaseURL {
    return `https://${name}-my-app-name-f28i.encr.app`;
}

export function PreviewEnv(pr: number | string): BaseURL {
    return Environment(`pr${pr}`);
}

export default class Client {
    public readonly booking: booking.ServiceClient;
    public readonly frontend: frontend.ServiceClient;

    constructor(target: BaseURL, options?: ClientOptions) {
        const base = new BaseClient(target, options ?? {});
        this.booking = new booking.ServiceClient(base);
        this.frontend = new frontend.ServiceClient(base);
    }
}

export interface ClientOptions {
    fetcher?: Fetcher;

    requestInit?: Omit<RequestInit, "headers"> & {
        headers?: Record<string, string>;
    };

    auth?: user.AuthParams | AuthDataGenerator;
}

export namespace booking {
    export interface Availability {
        weekday: number;
        start_time?: string;
        end_time?: string;
        venue_id: number;
    }

    export interface BookParams {
        start: string;
        Email: string;
    }

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

    export interface Booking {
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

    export interface GetAvailabilityResponse {
        Availability: Availability[];
    }

    export interface ListBookingsResponse {
        bookings: Booking[];
    }

    export interface SetAvailabilityParams {
        Availability: Availability[];
    }

    export interface SlotsResponse {
        Slots: BookedSlot[];
    }

    export class ServiceClient {
        private baseClient: BaseClient;

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient;
        }

        public async Book(params: BookParams): Promise<void> {
            await this.baseClient.callAPI(
                "POST",
                `/booking`,
                JSON.stringify(params)
            );
        }

        public async DeleteBooking(id: number): Promise<void> {
            await this.baseClient.callAPI(
                "DELETE",
                `/booking/${encodeURIComponent(id)}`
            );
        }

        public async GetAvailability(
            venueId: number | null
        ): Promise<GetAvailabilityResponse> {
            const resp = await this.baseClient.callAPI(
                "GET",
                `/availability?venue_id=${venueId?.toString() ?? ""}`
            );
            const responseData = await resp.json();
            console.log("API Response:", responseData);
            console.log(responseData.GetAvailabilityResponse);
            return responseData as GetAvailabilityResponse;
        }

        public async GetBookedSlots(
            _from: string,
            venueId: number
        ): Promise<ListBookingsResponse> {
            const resp = await this.baseClient.callAPI(
                "GET",
                `/approve?venue_id=${venueId?.toString() ?? ""}`
            );
            return (await resp.json()) as ListBookingsResponse;
        }

        public async ListBookings(
            venueId: number | null
        ): Promise<ListBookingsResponse> {
            const resp = await this.baseClient.callAPI(
                "GET",
                `/approve?venue_id=${venueId?.toString() ?? ""}`
            );
            console.log("API Response:", resp);
            return (await resp.json()) as ListBookingsResponse;
        }

        public async SetAvailability(
            params: SetAvailabilityParams
        ): Promise<void> {
            await this.baseClient.callAPI(
                "POST",
                `/availability`,
                JSON.stringify(params)
            );
        }
    }
}

export namespace frontend {
    export class ServiceClient {
        private baseClient: BaseClient;

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient;
        }

        public async Serve(
            method: string,
            path: string[],
            body?: BodyInit,
            options?: CallParameters
        ): Promise<Response> {
            return this.baseClient.callAPI(
                method,
                `/frontend/${path.map(encodeURIComponent).join("/")}`,
                body,
                options
            );
        }
    }
}

export namespace user {
    export interface AuthParams {
        Authorization: string;
    }
}

function encodeQuery(parts: Record<string, string | string[]>): string {
    const pairs: string[] = [];
    for (const key in parts) {
        const val = (
            Array.isArray(parts[key]) ? parts[key] : [parts[key]]
        ) as string[];
        for (const v of val) {
            pairs.push(`${key}=${encodeURIComponent(v)}`);
        }
    }
    return pairs.join("&");
}

function makeRecord<K extends string | number | symbol, V>(
    record: Record<K, V | undefined>
): Record<K, V> {
    for (const key in record) {
        if (record[key] === undefined) {
            delete record[key];
        }
    }
    return record as Record<K, V>;
}

type CallParameters = Omit<RequestInit, "method" | "body" | "headers"> & {
    headers?: Record<string, string>;

    query?: Record<string, string | string[]>;
};

export type AuthDataGenerator = () => user.AuthParams | undefined;

export type Fetcher = typeof fetch;

const boundFetch = fetch.bind(this);

class BaseClient {
    readonly baseURL: string;
    readonly fetcher: Fetcher;
    readonly headers: Record<string, string>;
    readonly requestInit: Omit<RequestInit, "headers"> & {
        headers?: Record<string, string>;
    };
    readonly authGenerator?: AuthDataGenerator;

    constructor(baseURL: string, options: ClientOptions) {
        this.baseURL = baseURL;
        this.headers = {
            "Content-Type": "application/json",
            "User-Agent":
                "my-app-name-f28i-Generated-TS-Client (Encore/v1.28.0)",
        };
        this.requestInit = options.requestInit ?? {};

        if (options.fetcher !== undefined) {
            this.fetcher = options.fetcher;
        } else {
            this.fetcher = boundFetch;
        }

        if (options.auth !== undefined) {
            const auth = options.auth;
            if (typeof auth === "function") {
                this.authGenerator = auth;
            } else {
                this.authGenerator = () => auth;
            }
        }
    }

    public async callAPI(
        method: string,
        path: string,
        body?: BodyInit,
        params?: CallParameters
    ): Promise<Response> {
        let { query, headers, ...rest } = params ?? {};
        const init = {
            ...this.requestInit,
            ...rest,
            method,
            body: body ?? null,
        };

        init.headers = { ...this.headers, ...init.headers, ...headers };

        let authData: user.AuthParams | undefined;
        if (this.authGenerator) {
            authData = this.authGenerator();
        }

        if (authData) {
            init.headers["authorization"] = authData.Authorization;
        }

        // Make the actual request
        const queryString = query ? "?" + encodeQuery(query) : "";
        const response = await this.fetcher(
            this.baseURL + path + queryString,
            init
        );

        if (!response.ok) {
            let body: APIErrorResponse = {
                code: ErrCode.Unknown,
                message: `request failed: status ${response.status}`,
            };

            try {
                const text = await response.text();

                try {
                    const jsonBody = JSON.parse(text);
                    if (isAPIErrorResponse(jsonBody)) {
                        body = jsonBody;
                    } else {
                        body.message += ": " + JSON.stringify(jsonBody);
                    }
                } catch {
                    body.message += ": " + text;
                }
            } catch (e) {
                body.message += ": " + String(e);
            }

            throw new APIError(response.status, body);
        }

        return response;
    }
}

interface APIErrorResponse {
    code: ErrCode;
    message: string;
    details?: any;
}

function isAPIErrorResponse(err: any): err is APIErrorResponse {
    return (
        err !== undefined &&
        err !== null &&
        isErrCode(err.code) &&
        typeof err.message === "string" &&
        (err.details === undefined ||
            err.details === null ||
            typeof err.details === "object")
    );
}

function isErrCode(code: any): code is ErrCode {
    return code !== undefined && Object.values(ErrCode).includes(code);
}

export class APIError extends Error {
    public readonly status: number;
    public readonly code: ErrCode;
    public readonly details?: any;
    constructor(status: number, response: APIErrorResponse) {
        super(response.message);

        Object.defineProperty(this, "name", {
            value: "APIError",
            enumerable: false,
            configurable: true,
        });
        if ((Object as any).setPrototypeOf == undefined) {
            (this as any).__proto__ = APIError.prototype;
        } else {
            Object.setPrototypeOf(this, APIError.prototype);
        }
        if ((Error as any).captureStackTrace !== undefined) {
            (Error as any).captureStackTrace(this, this.constructor);
        }

        this.status = status;
        this.code = response.code;
        this.details = response.details;
    }
}

export function isAPIError(err: any): err is APIError {
    return err instanceof APIError;
}

export enum ErrCode {
    OK = "ok",
    Canceled = "canceled",
    Unknown = "unknown",
    InvalidArgument = "invalid_argument",
    DeadlineExceeded = "deadline_exceeded",
    NotFound = "not_found",
    AlreadyExists = "already_exists",
    PermissionDenied = "permission_denied",
    ResourceExhausted = "resource_exhausted",
    FailedPrecondition = "failed_precondition",
    Aborted = "aborted",
    OutOfRange = "out_of_range",
    Unimplemented = "unimplemented",
    Internal = "internal",
    Unavailable = "unavailable",
    DataLoss = "data_loss",
    Unauthenticated = "unauthenticated",
}
