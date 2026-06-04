"use client";

import { useEffect, useState } from "react";
import { actionApi } from "@/lib/api/action";
import { equipmentApi } from "@/lib/api/equipment";
import { makeApi } from "@/lib/api/make";
import { vehicleApi } from "@/lib/api/vehicle";
import { workerApi } from "@/lib/api/worker";
import { setofequipmentApi } from "@/lib/api/set_of_equipment";
import { vehmodelApi } from "@/lib/api/vehmodel";
import { versionApi } from "@/lib/api/version";
import { reservationApi } from "@/lib/api/reservation";
import { caretakerApi } from '@/lib/api/caretaker';
import { INITIAL_STATES } from "@/lib/forms";
import type { EntityType } from "@/types";
import { useToast } from "@/components/ui/Toast";
import DataTable from "./DataTable";
import AddModal from "./modals/AddModal";
import DeleteModal from "./modals/DeleteModal";
import EditModal from "./modals/EditModal";

type EntityTab = {
  key: EntityType;
  label: string;
  count?: number;
};

const ENTITY_TABS: EntityTab[] = [
  { key: "Makes", label: "Marki" },
  { key: "Vehicles", label: "Pojazdy" },
  { key: "Workers", label: "Pracownicy" },
  { key: "Reservations", label: "Rezerwacje" },
  { key: "Models", label: "Modele" },
  { key: "Actions", label: "Akcje" },
  { key: "Equipments", label: "Wyposażenie" },
  { key: "SetOfEquipments", label: "Zestawy" },
  { key: "Versions", label: "Wersje" },
];

function extractItems(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object" && "items" in data) return (data as Record<string, unknown>).items as Record<string, unknown>[];
  if (data && typeof data === "object" && "data" in data) return (data as Record<string, unknown>).data as Record<string, unknown>[];
  return [];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<EntityType>("Makes");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Record<string, unknown> | null>(null);
  const { toast } = useToast();

  const loadData = async (entity: EntityType) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let result: unknown;
      switch (entity) {
        case "Makes": result = await makeApi.getAll(); break;
        case "Vehicles": result = await vehicleApi.getAll(); break;
        case "Workers": result = await workerApi.getAll(); break;
        case "Models": result = await vehmodelApi.getAll(); break;
        case "Actions": result = await actionApi.getAll(); break;
        case "Equipments": result = await equipmentApi.getAll(); break;
        case "SetOfEquipments": result = await setofequipmentApi.getAll(); break;
        case "Versions": result = await versionApi.getAll(); break;
        case "Reservations": result = await reservationApi.getAll(); break;
        default: result = { message: `Dane dla ${entity} nie są jeszcze dostępne.` };
      }
      setData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Nie udało się pobrać danych.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = async (entity: EntityType, id: number, updatedData: any) => {
    setLoading(true);
    setError(null);
    try {
      switch (entity) {
        case "Makes": await makeApi.update(id, updatedData); break;
        case "Vehicles": await vehicleApi.update(id, updatedData); break;
        case "Workers": await workerApi.update(id, updatedData); break;
        case "Models": await vehmodelApi.update(id, updatedData); break;
        case "Actions": await actionApi.update(id, updatedData); break;
        case "Equipments": await equipmentApi.update(id, updatedData); break;
        case "SetOfEquipments": await setofequipmentApi.update(id, updatedData); break;
        case "Versions": await versionApi.update(id, updatedData); break;
        case "Reservations": await reservationApi.update(id, updatedData); break;
        default: return;
      }
      setIsEditModalOpen(false);
      setItemToEdit(null);
      toast("success", "Element został zaktualizowany.");
      loadData(activeTab);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Błąd aktualizacji.";
      toast("error", msg);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addData = async (entity: EntityType, newData: any) => {
    try {
      switch (entity) {
        case "Makes": await makeApi.create(newData); break;
        case "Vehicles": await vehicleApi.create(newData); break;
        case "Workers": await workerApi.create(newData); break;
        case "Models": await vehmodelApi.create(newData); break;
        case "Actions": await actionApi.create(newData); break;
        case "Equipments": await equipmentApi.create(newData); break;
        case "SetOfEquipments": await setofequipmentApi.create(newData); break;
        case "Versions": await versionApi.create(newData); break;
        case "Reservations": await reservationApi.create(newData); break;
        default: return;
      }
      setIsAddModalOpen(false);
      toast("success", "Nowy element został dodany.");
      loadData(activeTab);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Błąd dodawania.";
      toast("error", msg);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      switch (activeTab) {
        case "Makes": await makeApi.delete(itemToDelete.id); break;
        case "Vehicles": await vehicleApi.delete(itemToDelete.id); break;
        case "Workers": await workerApi.delete(itemToDelete.id); break;
        case "Models": await vehmodelApi.delete(itemToDelete.id); break;
        case "Actions": await actionApi.delete(itemToDelete.id); break;
        case "Equipments": await equipmentApi.delete(itemToDelete.id); break;
        case "SetOfEquipments": await setofequipmentApi.delete(itemToDelete.id); break;
        case "Versions": await versionApi.delete(itemToDelete.id); break;
        case "Reservations": await reservationApi.delete(itemToDelete.id); break;
        default: return;
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      toast("success", "Element został usunięty.");
      loadData(activeTab);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Błąd usuwania.";
      toast("error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleEditClick = (item: unknown) => {
    setItemToEdit(item as Record<string, unknown>);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    const items = extractItems(data);
    const item = items.find((i: unknown) => (i as Record<string, unknown>).id === id) as Record<string, unknown> | undefined;
    setItemToDelete({ id, name: item?.name as string | undefined });
    setIsDeleteModalOpen(true);
  };

  const handleAddNewClick = () => {
    if (INITIAL_STATES[activeTab]) {
      setIsAddModalOpen(true);
      return;
    }
    toast("error", `Dodawanie ${activeTab} nie jest jeszcze dostępne.`);
  };

  const items = extractItems(data);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent-soft) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fleet Data Manager
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Zarządzaj wszystkimi encjami systemu
          </p>
        </div>

        <button type="button" onClick={handleAddNewClick} className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Dodaj {ENTITY_TABS.find((t) => t.key === activeTab)?.label?.replace(/i$/, "ę") || activeTab}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 mb-6 pb-px scrollbar-thin" role="tablist">
        {ENTITY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "tab-active text-white"
                : "hover:text-white"
            }`}
            style={{
              color: activeTab === tab.key ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              background: activeTab === tab.key ? "var(--color-overlay)" : "transparent",
            }}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="glass-surface rounded-2xl p-4 sm:p-6 min-h-[24rem]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            {ENTITY_TABS.find((t) => t.key === activeTab)?.label || activeTab}
          </h3>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {items.length} rekordów
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "var(--color-error-soft)" }}
            >
              <svg className="h-6 w-6" style={{ color: "var(--color-error)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: "var(--color-error)" }}>Błąd</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{error}</p>
            <button
              type="button"
              onClick={() => loadData(activeTab)}
              className="btn-ghost mt-2"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "var(--color-accent-glow)" }}
            >
              <svg className="h-6 w-6" style={{ color: "var(--color-accent-soft)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
              Brak danych
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Kliknij &quot;Dodaj&quot;, aby utworzyć pierwszy rekord.
            </p>
          </div>
        )}

        {/* Data */}
        {!loading && !error && items.length > 0 && (
          <DataTable
            items={items}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Modals */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        entityType={activeTab}
        onSuccess={(newData) => addData(activeTab, newData)}
        initialState={INITIAL_STATES[activeTab]}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name}
        isDeleting={isDeleting}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setItemToEdit(null);
        }}
        onSuccess={(updatedData) => {
          if (itemToEdit && typeof itemToEdit === "object" && "id" in itemToEdit) {
            updateData(activeTab, (itemToEdit as Record<string, number>).id, updatedData);
          }
        }}
        entityType={activeTab}
        initialData={itemToEdit}
      />
    </div>
  );
}
