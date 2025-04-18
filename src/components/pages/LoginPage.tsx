import toast from "react-hot-toast";
import React, { FC } from "react";
import { Form, LoaderFunctionArgs, redirect } from "react-router-dom";
import { BsMicrosoft } from "react-icons/bs";

import MicrosoftLogin from "react-microsoft-login";

import Cookies from "js-cookie";

export const action = async ({ request }: LoaderFunctionArgs) => {
    let formData = await request.formData();
    let email = formData.get("email");
    let password = formData.get("password");

    try {
        const response = await fetch("http://localhost:3690/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Invalid credentials");
        }

        const data = await response.json();

        Cookies.set("auth-token", data.token, {
            secure: true,
            sameSite: "strict",
        });
        Cookies.set("approver-id", data.approver_id, {
            secure: true,
            sameSite: "strict",
            path: "/",
        });
        console.log(Cookies.get("approver-id"));

        toast.success("Logged in");
        return redirect("/admin");
    } catch (error: any) {
        return { error: error.message };
    }
};

const LoginPage: FC = () => {
    const authHandler = (err: any, data: any): void => {
        console.log(err, data);
    };

    const handleMicrosoftLogin = () => {
        window.location.href = "http://localhost:3690/auth/microsoft";
    };
    return (
        <div className="flex-1">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                {/* <div className="flex sm:mx-auto sm:w-full sm:max-w-sm justify-center p-2">
                    <MicrosoftLogin
                        clientId={"64ebfb6c-e85c-46c5-bda0-10d06d0ee2d3"}
                        authCallback={authHandler}
                    >
                        <button className="rounded-md bg-blue-600 px-4 py-2 text-white flex flex-row items-center justify-center gap-2 hover:bg-blue-500">
                            <BsMicrosoft className="text-white" />
                            Sign in with Microsoft
                        </button>
                    </MicrosoftLogin>
                </div> */}

                <div className="flex sm:mx-auto sm:w-full sm:max-w-sm justify-center p-2">
                    <button
                        onClick={handleMicrosoftLogin}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white flex flex-row items-center justify-center gap-2 hover:bg-blue-500"
                    >
                        <BsMicrosoft className="text-white" />
                        Sign in with Microsoft
                    </button>
                </div>

                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="flex w-full justify-center">
                        <span className="mb-5 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            Negces Lab Booking System
                        </span>
                    </div>

                    <Form className="space-y-6" method="post">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
