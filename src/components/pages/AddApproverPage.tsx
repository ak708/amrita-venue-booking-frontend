import React, { FC } from "react";
import { Form, Link, LoaderFunctionArgs, redirect } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
export const action = async ({ request }: LoaderFunctionArgs) => {
    let formData = await request.formData();
    let title = formData.get("title")?.toString().trim();
    let name = formData.get("name")?.toString().trim();

    let email = formData.get("email")?.toString().trim();
    let password = formData.get("password")?.toString().trim();

    if (!name || !email || !password) {
        throw new Error("Missing required fields: name, email, or password.");
    }

    const newApprover = {
        name,
        email,
        password,
    };

    console.log("New Approver:", newApprover);
    try {
        const response = await fetch("http://localhost:3690/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newApprover),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating approver:", errorData);
            return new Response("Failed to create approver", { status: 500 });
        }
        toast.success("Approver created!");
        return redirect("/admin/approvers");
    } catch (error) {
        console.error("Error occurred while creating approver:", error);
        return new Response("Error creating approver", { status: 500 });
    }
};

const AddApproverPage: FC = () => {
    return (
        <div className="flex-1">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register New Approver
                    </h2>
                </div>

                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="flex w-full justify-center">
                        <span className="mb-5 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                            Approver Registration
                        </span>
                    </div>

                    <Form className="space-y-6" method="post">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Title
                            </label>
                            <div className="mt-2">
                                <select
                                    id="title"
                                    name="title"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="Mr">Mr</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Mrs">Mrs</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

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
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
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
                                Create
                            </button>
                        </div>
                        <div className="pt-1">
                            <Link
                                to="/admin/approvers"
                                className="text-blue-500 hover:text-blue-700 underline "
                            >
                                Back...
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AddApproverPage;
