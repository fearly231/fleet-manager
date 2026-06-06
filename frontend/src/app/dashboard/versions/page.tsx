"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { versionApi } from "@/lib/api/version";

export default function AdminVersionsPage() {
  const [destination, setDestination] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!destination.trim()) {
      setMessage("Podaj nazwę wersji.");
      return;
    }

    setSaving(true);

    try {
      await versionApi.create({ destination: destination.trim() });
      setDestination("");
      setMessage("Wersja została dodana.");
    } catch (err) {
      console.error(err);
      setMessage("Błąd przy dodawaniu wersji.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dodaj nową wersję</h1>
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
              <label className="block text-sm font-medium text-gray-700">Nazwa wersji</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="np. Business"
              />
            </div>

            {message && (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Zapisuję..." : "Zapisz wersję"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}