import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// const PaginatedTable = ({ records }: { records: any[] }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const rowsPerPage = 10;

//     const indexOfLastRow = currentPage * rowsPerPage;
//     const indexOfFirstRow = indexOfLastRow - rowsPerPage;

//     const currentRows = records.slice(indexOfFirstRow, indexOfLastRow);

//     // Handle page change
//     const handlePageChange = (newPage: number) => {
//         setCurrentPage(newPage);
//     };

//     const handleRemove = (id: number) => {
//         console.log(`Removing venue with ID: ${id}`);
//     };

//     const totalPages = Math.ceil(records.length / rowsPerPage);

//     return (
//         <div>
//             <table className="min-w-full table-auto justify-between">
//                 <thead>
//                     <tr>
//                         <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
//                             Name
//                         </th>
//                         <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
//                             Actions
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentRows.map((record: any) => (
//                         <tr
//                             key={record.id}
//                             className="border-b justify-between"
//                         >
//                             <td className="px-4 py-2">{record.name}</td>
//                             <td className="px-4 py-2">
//                                 <button
//                                     onClick={() => handleRemove(record.id)}
//                                     className="text-red-600 hover:text-red-800"
//                                 >
//                                     Remove
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Pagination Controls */}
//             <div className="mt-4 flex justify-center space-x-2">
//                 <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
//                 >
//                     Previous
//                 </button>
//                 <span className="px-4 py-2 text-sm font-medium text-gray-700">
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };
const PaginatedVenueTable = ({
    records,
    handleRemoveFunction,
}: {
    records: any[];
    handleRemoveFunction: (id: number) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const currentRows = records.slice(indexOfFirstRow, indexOfLastRow);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(records.length / rowsPerPage);

    return (
        <div>
            <table className="min-w-full table-auto justify-between">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((record: any) => (
                        <tr
                            key={record.id}
                            className="border-b justify-between"
                        >
                            <td className="px-4 py-2">{record.name}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() =>
                                        handleRemoveFunction(record.id)
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

            <div className="mt-4 flex justify-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const PaginatedVenueTypeTable = ({
    records,
    handleRemoveFunction,
}: {
    records: any[];
    handleRemoveFunction: (id: number) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const currentRows = records.slice(indexOfFirstRow, indexOfLastRow);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(records.length / rowsPerPage);

    return (
        <div>
            <table className="min-w-full table-auto justify-between">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((record: any) => (
                        <tr
                            key={record.type_id}
                            className="border-b justify-between"
                        >
                            <td className="px-4 py-2">{record.type_name}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() =>
                                        handleRemoveFunction(record.type_id)
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

            <div className="mt-4 flex justify-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const VenuePage = () => {
    const [venues, setVenues] = useState([]);
    const [venuetypes, setVenuetypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenues = async () => {
            const response = await fetch("http://localhost:3690/venue", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setVenues(data);
        };

        fetchVenues();
    }, []);
    useEffect(() => {
        const fetchVenueTypes = async () => {
            const response = await fetch("http://localhost:3690/venuetype", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setVenuetypes(data);
        };

        fetchVenueTypes();
    }, []);

    const handleRemoveVenue = async (id: any) => {
        const resp = await fetch(`http://localhost:3690/venue?venue_id=${id}`, {
            method: "DELETE",
        });

        if (!resp.ok) {
            const errdata = await resp.json();
            console.error("Error removing approver:", errdata);
            toast.error("Error removing Approver");
            return;
        }

        toast.success("Approver removed successfully");

        setVenues(venues.filter((venue: any) => venue.id !== id));
    };

    const handleRemoveVenueType = async (id: any) => {
        const resp = await fetch(`http://localhost:3690/venuetype`, {
            method: "DELETE",
            body: JSON.stringify({ type_id: id }),
        });

        if (!resp.ok) {
            const errdata = await resp.json();
            console.error("Error removing Venue Type:", errdata);
            toast.error("Error removing Venue Type");
            return;
        }

        toast.success("Venue Type removed successfully");

        setVenuetypes(
            venuetypes.filter((venuetype: any) => venuetype.type_id !== id)
        );
    };

    const handleAddVenue = () => {
        navigate("/admin/addvenue");
    };
    const handleAddVenueType = () => {
        navigate("/admin/addvenuetype");
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row pl-3 pt-2">
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Venue Menu
                </h2>
            </div>
            <div className="flex min-h-full flex-1 flex-row justify-center px-6 py-12 lg:px-8">
                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="mb-5 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                        Venue List
                    </div>

                    <div className="mb-5">
                        <button
                            onClick={handleAddVenue}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add New Venue
                        </button>
                    </div>

                    <PaginatedVenueTable
                        records={venues}
                        handleRemoveFunction={handleRemoveVenue}
                    />
                </div>
                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="mb-5 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                        Venue Type List
                    </div>

                    <div className="mb-5">
                        <button
                            onClick={handleAddVenueType}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add New Venue Type
                        </button>
                    </div>

                    <PaginatedVenueTypeTable
                        records={venuetypes}
                        handleRemoveFunction={handleRemoveVenueType}
                    />
                </div>
            </div>
        </div>
    );
};

export default VenuePage;

{
    /* <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                                    Name
                                </th>

                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {venues.map((venue: any) => (
                                <tr key={venue.id} className="border-b">
                                    <td className="px-4 py-2">{venue.name}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() =>
                                                handleRemoveVenue(venue.id)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */
}
