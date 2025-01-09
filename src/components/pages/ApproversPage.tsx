import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ApproversPage = () => {
    const [approvers, setApprovers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApprovers = async () => {
            const response = await fetch("http://localhost:3690/approver", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setApprovers(data);
        };

        fetchApprovers();
    }, []);

    const handleRemoveApprover = async (id: any) => {
        const resp = await fetch(
            `http://localhost:3690/approver?approver_id=${id}`,
            {
                method: "DELETE",
            }
        );

        if (!resp.ok) {
            let errdata;
            try {
                errdata = await resp.json();
            } catch (jsonError) {
                errdata = { message: errdata };
            }
            console.error("Error removing approver:", errdata);
            toast.error(
                "Error removing Approver: " +
                    (errdata.message || "Unknown error")
            );
            return;
        }

        const data = await resp.json();
        toast.success(data.Message || "Approver removed successfully");

        setApprovers(approvers.filter((approver: any) => approver.id !== id));
    };

    const handleAddApprover = () => {
        navigate("/admin/addapprover");
    };

    return (
        <div className="flex-1">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Approver Management
                    </h2>
                </div>

                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="mb-5 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                        Approver List
                    </div>

                    <div className="mb-5">
                        <button
                            onClick={handleAddApprover}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add New Approver
                        </button>
                    </div>

                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvers.map((approver: any) => (
                                <tr key={approver.id} className="border-b">
                                    <td className="px-4 py-2">
                                        {approver.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {approver.email}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() =>
                                                handleRemoveApprover(
                                                    approver.id
                                                )
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApproversPage;
