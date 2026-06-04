"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { VehiclePublic } from "@/types/vehicle_types";
import type { Purpose } from "@/types/reservation_types";
import { useToast } from "@/components/ui/Toast";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehiclePublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("business");
  const [price, setPrice] = useState("0");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiclesData = await api.getVehicles();
        setVehicles(vehiclesData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się pobrać pojazdów.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!startDate) errors.startDate = "Data rozpoczęcia jest wymagana.";
    if (!endDate) errors.endDate = "Data zakończenia jest wymagana.";
    if (!selectedVehicle) errors.selectedVehicle = "Wybierz pojazd.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await api.getCurrentUser();

      await api.createReservation({
        vehicle_id: parseInt(selectedVehicle),
        worker_id: user.id,
        date_start_planned: new Date(startDate).toISOString(),
        date_end_planned: new Date(endDate).toISOString(),
        purpose: purpose,
        price: parseFloat(price),
      });

      toast("success", "Rezerwacja została pomyślnie utworzona!");
      setStartDate("");
      setEndDate("");
      setSelectedVehicle("");
      setPrice("0");
      setFieldErrors({});
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Błąd podczas tworzenia rezerwacji.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent-soft) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Pojazdy i rezerwacje
        </h1>
        <Link
          href="/dashboard"
          className="text-sm font-medium hover:underline inline-flex items-center gap-1"
          style={{ color: "var(--color-accent-soft)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Powrót do menu
        </Link>
      </div>

      <div className="glass-surface rounded-2xl p-6">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
              Nowa rezerwacja
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Wybierz pojazd oraz termin, aby zarezerwować samochód z floty.
            </p>
          </div>

          <div className="mt-6 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    Planowane rozpoczęcie
                  </label>
                  <input
                    type="datetime-local"
                    id="start-date"
                    className={`input-dark ${fieldErrors.startDate ? "input-error" : ""}`}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (fieldErrors.startDate) setFieldErrors((p) => ({ ...p, startDate: "" }));
                    }}
                    required
                  />
                  {fieldErrors.startDate && <p className="field-error">{fieldErrors.startDate}</p>}
                </div>

                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    Planowane zakończenie
                  </label>
                  <input
                    type="datetime-local"
                    id="end-date"
                    className={`input-dark ${fieldErrors.endDate ? "input-error" : ""}`}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (fieldErrors.endDate) setFieldErrors((p) => ({ ...p, endDate: "" }));
                    }}
                    required
                  />
                  {fieldErrors.endDate && <p className="field-error">{fieldErrors.endDate}</p>}
                </div>

                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    Cel rezerwacji
                  </label>
                  <select
                    id="purpose"
                    className="input-dark"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as Purpose)}
                  >
                    <option value="business">Służbowy (business)</option>
                    <option value="private">Prywatny (private)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    Szacowany koszt (PLN)
                  </label>
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    className="input-dark"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="vehicle" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    Wybierz samochód
                  </label>
                  <select
                    id="vehicle"
                    className={`input-dark ${fieldErrors.selectedVehicle ? "input-error" : ""}`}
                    value={selectedVehicle}
                    onChange={(e) => {
                      setSelectedVehicle(e.target.value);
                      if (fieldErrors.selectedVehicle) setFieldErrors((p) => ({ ...p, selectedVehicle: "" }));
                    }}
                    required
                    disabled={loading}
                  >
                    <option value="">{loading ? "Ładowanie pojazdów..." : "Wybierz pojazd..."}</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.description || `Pojazd #${v.id}`}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.selectedVehicle && <p className="field-error">{fieldErrors.selectedVehicle}</p>}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg p-3 text-sm"
                  style={{ background: "var(--color-error-soft)", color: "var(--color-error)", border: "1px solid rgba(248, 113, 113, 0.2)" }}
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="btn-primary"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Przetwarzanie...
                    </>
                  ) : (
                    "Potwierdź rezerwację"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
