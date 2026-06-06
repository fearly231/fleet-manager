"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { makeApi } from "@/lib/api/make";
import { vehmodelApi } from "@/lib/api/vehmodel";

export default function AdminModelsPage() {
  const [modelName, setModelName] = useState("");
  const [makes, setMakes] = useState<any[]>([]);
  const [selectedMakeId, setSelectedMakeId] = useState("");
  const [newMakeName, setNewMakeName] = useState("");
  const [useNewMake, setUseNewMake] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadMakes = async () => {
      setLoading(true);
      try {
        const result = await makeApi.getAll();
        setMakes(result.items || []);
      } catch (err) {
        console.error(err);
        setMessage("Nie udało się pobrać marek.");
      } finally {
        setLoading(false);
      }
    };
    loadMakes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!modelName.trim()) {
      setMessage("Podaj nazwę modelu.");
      return;
    }

    if (!useNewMake && !selectedMakeId) {
      setMessage("Wybierz markę lub dodaj nową.");
      return;
    }

    if (useNewMake && !newMakeName.trim()) {
      setMessage("Podaj nazwę nowej marki.");
      return;
    }

    setSaving(true);
    try {
      let makeId = Number(selectedMakeId);

      if (useNewMake) {
        const newMake = await makeApi.create({ name: newMakeName.trim() });
        makeId = newMake.id;
      }

      await vehmodelApi.create({
        name: modelName.trim(),
        make_id: makeId,
      });

      setModelName("");
      setNewMakeName("");
      setSelectedMakeId("");
      setUseNewMake(false);
      setMessage("Model został dodany.");
    } catch (err) {
      console.error(err);
      setMessage("Błąd przy dodawaniu modelu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dodaj nowy model</h1>
          <Link
            href="/dashboard/admin/vehicles"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            &larr; Powrót do zarządzania pojazdami
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nazwa modelu</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="np. A4"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Wybierz markę</label>
                <button
                  type="button"
                  onClick={() => setUseNewMake(false)}
                  className={`px-3 py-1 rounded ${!useNewMake ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  Istniejąca
                </button>
                <button
                  type="button"
                  onClick={() => setUseNewMake(true)}
                  className={`px-3 py-1 rounded ${useNewMake ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  Nowa marka
                </button>
              </div>

              {!useNewMake ? (
                <select
                  value={selectedMakeId}
                  onChange={(e) => setSelectedMakeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  disabled={loading}
                >
                  <option value="">Wybierz istniejącą markę</option>
                  {makes.map((make) => (
                    <option key={make.id} value={make.id}>
                      {make.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={newMakeName}
                  onChange={(e) => setNewMakeName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Nazwa nowej marki"
                />
              )}
            </div>

            {message && (
              <div className="rounded-md border p-3 text-sm text-gray-800 bg-gray-50">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Zapisuję..." : "Zapisz model"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}