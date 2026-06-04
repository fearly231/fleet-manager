"use client";

import Link from "next/link";

const tiles = [
  {
    title: "Mój profil",
    description: "Zarządzaj swoimi danymi osobowymi i ustawieniami konta.",
    href: "/dashboard/profile",
    gradient: "from-violet-600/20 to-purple-500/5",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Flota pojazdów",
    description: "Przeglądaj wszystkie pojazdy i dokonuj nowych rezerwacji.",
    href: "/dashboard/vehicles",
    gradient: "from-emerald-600/20 to-teal-500/5",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: "Moje rezerwacje",
    description: "Sprawdź status swoich obecnych i przeszłych rezerwacji.",
    href: "/dashboard/reservations",
    gradient: "from-amber-600/20 to-orange-500/5",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
          style={{
            background: "linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent-soft) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Menu główne
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }} className="text-sm sm:text-base">
          Wybierz sekcję, aby rozpocząć pracę z systemem
        </p>
      </div>

      {/* Tile Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="glass-elevated rounded-2xl p-6 sm:p-8 group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            {/* Gradient blob on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: "var(--color-accent-glow)",
                  color: "var(--color-accent-soft)",
                }}
              >
                {tile.icon}
              </div>

              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                {tile.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {tile.description}
              </p>

              {/* Arrow indicator on hover */}
              <div className="flex items-center gap-1 mt-5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                style={{ color: "var(--color-accent-soft)" }}
              >
                Otwórz
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
