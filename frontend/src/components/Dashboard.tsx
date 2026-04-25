"use client";

import { useState, useEffect } from "react";
import { makeApi } from "@/lib/api/make";
import { vehicleApi } from "@/lib/api/vehicle";
import { workerApi } from "@/lib/api/worker";

import AddModal from "./modals/AddModal";
// Entities from DB
type EntityType = "Makes" | "Vehicles" | "Workers" | "Reservations" | "Actions" | "Models";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<EntityType>("Makes");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // Loading data depending on the active tab
    const loadData = async (entity: EntityType) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            let result;
            switch (entity) {
                case "Makes":
                    result = await makeApi.getAll();
                    break;
                default:
                    result = { message: `Data for ${entity} not implemented yet.` };
            }
            setData(result);
        } catch (err: any) {
            setError(err.message || "Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    // changing active tab
    useEffect(() => {
        loadData(activeTab);
    }, [activeTab]);

    const tabs: EntityType[] = ["Makes", "Vehicles", "Workers", "Reservations", "Actions", "Models"];

    const handleAddNewClick = () => {
        if (activeTab === "Makes") {
            setIsAddModalOpen(true);
        } else {
            alert(`Adding new ${activeTab.slice(0, -1)} is not implemented yet.`);
        }
    };


    return (
        <div className="max-w-5xl">
            <h2 className="text-3xl font-bold mb-6">Fleet Data Manager</h2>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === tab
                            ? "bg-blue-600 text-white border-b-4 border-blue-800"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Showing Results */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Viewing: <span className="text-blue-600">{activeTab}</span>
                    </h3>

                    <button
                        onClick={handleAddNewClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                        + Add New {activeTab.slice(0, -1)}
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center gap-2 text-blue-500">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        Loading data...
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded border border-red-200">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {!loading && !error && data && (
                    <div className="space-y-4">
                        {/* Showing results */}
                        {data.total !== undefined && (
                            <p className="text-sm text-gray-500 font-medium">Total records: {data.total}</p>
                        )}

                        <pre className="bg-gray-50 border border-gray-100 p-4 rounded overflow-x-auto text-sm text-gray-800 shadow-inner">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
            <AddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                entityType={activeTab === "Makes" ? activeTab : "Makes"}
                onSuccess={() => {
                    loadData(activeTab);
                }}
            />
        </div>
    );
}
