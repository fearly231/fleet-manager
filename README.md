# 🚗 FleetFlow | Enterprise Fleet Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.14+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A robust, enterprise-grade, dockerized full-stack application designed to optimize corporate vehicle fleet utilization, automate reservation workflows, track custodian assignments, and log maintenance/exploitation activities. 

Built with a modern **React 19 / Next.js 16 App Router** frontend, a scalable **FastAPI** REST API backend, and orchestrated via **Docker Compose** with a dedicated **PostgreSQL** database.

---

## 🛠️ System Architecture

The application is split into a multi-tier architecture with a strict separation of concerns, communicating via a secured JSON REST API:

```mermaid
graph TD
    Client[Next.js Web Frontend <br> React 19, Tailwind CSS v4, TS]
    API_Gateway[FastAPI Web Server <br> Routing, Dependency Injection]
    Auth_Middleware[JWT Auth Middleware <br> Bcrypt, python-jose]
    ORM[SQLAlchemy 2.0 <br> Mapped Models]
    DB[(PostgreSQL Database <br> Version 15)]

    Client -- HTTP Requests + JWT Bearer --> API_Gateway
    API_Gateway --> Auth_Middleware
    Auth_Middleware -- Authorized Requests --> ORM
    ORM --> DB
```

---

## ✨ Key Features & Business Logic

### 🔐 1. Role-Based Access Control (RBAC)
The system supports three user levels to match organizational structures:
*   **Administrator (Superuser):** Complete access to manage vehicle makes, models, equipment sets, register new workers, manage vehicle allocations, and review system logs.
*   **Caretaker (Opiekun Pojazdu):** Acts as the custodian of assigned vehicles. Responsible for signing off on rentals, approving vehicle status, and logging exploitation events (cleaning, refueling) or servicing.
*   **Employee (Pracownik):** Regular corporate user who can browse available vehicles, place reservations for business/private/service purposes, and log start/end odometer states.

### 📅 2. Advanced Reservation Lifecycle
The core business flow manages rentals with strict validation:
1.  **Creation (`created`):** Employee requests a vehicle for specific dates and purposes.
2.  **Approval (`accepted`):** Caretaker/Admin reviews and approves the booking.
3.  **In Progress (`in_progress`):** Employee picks up the vehicle, logging the starting condition (`state_start`).
4.  **Completion (`completed`):** Vehicle returned, ending odometer reading logged, final price computed, and `state_end` documented.
5.  **Cancellation (`canceled`):** Allowed before the trip begins.

### 🔌 3. Custom Equipment Bundles
*   Dynamic equipment dictionary (e.g., GPS, Air Conditioning, Heated Seats, Cruise Control).
*   Create reusable **Equipment Sets** (e.g., *Premium Pack*, *Standard Winter Pack*).
*   Link Equipment Sets to specific **Vehicle Versions** (e.g., specific engine sizes or trim levels) to automate inventory tracking.

### 🛢️ 4. Maintenance & Operations Tracking
Logs all actions performed on vehicles:
*   **Exploitation:** Refueling, exterior washing, interior vacuuming, tyre replacement.
*   **Service:** Technical inspections, oil changes, mechanical repairs.
*   Linked to reservations to track which employee or caretaker authorized the maintenance cost.

---

## 💻 Tech Stack

### Frontend
*   **Framework:** [Next.js 16.2.4 (App Router)](https://nextjs.org/)
*   **Library:** [React 19](https://react.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Language:** [TypeScript 5](https://www.typescriptlang.org/)
*   **Linter & Formatter:** [BiomeJS](https://biomejs.dev/) (extreme speed linting and code style enforcement)

### Backend
*   **Framework:** [FastAPI 0.136+](https://fastapi.tiangolo.com/) (Asynchronous pythonic web framework)
*   **ORM:** [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (Leverages modern Mapped types and type-hints)
*   **Validation:** [Pydantic v2](https://docs.pydantic.dev/)
*   **Security:** JWT Tokens, `passlib` with `bcrypt` password hashing, `python-jose`
*   **Database:** PostgreSQL 15 (Interfaced via `psycopg` v3 driver)
*   **Package Manager:** [UV](https://github.com/astral-sh/uv) (ultra-fast Python dependency resolver)

---

## 📂 Project Structure

```text
├── backend/                  # FastAPI Python Application
│   ├── api/                  # REST API Endpoints & Routing
│   │   ├── routes/           # Sub-routers (Vehicles, Reservations, etc.)
│   │   └── deps.py           # Dependency Injection (Auth, DB session)
│   ├── core/                 # App Configuration & Security (JWT, bcrypt)
│   ├── database/             # Database Connection & Session Config
│   ├── models/               # SQLAlchemy Relational Models & Pydantic Schemas
│   ├── main.py               # API Entry point & Seeding scripts
│   ├── Dockerfile            # Container definition
│   └── pyproject.toml        # Backend Dependencies
├── frontend/                 # Next.js TypeScript Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (Dashboard, Auth pages)
│   │   ├── components/       # Reusable React UI Elements
│   │   ├── lib/              # API Client & Helper utilities
│   │   └── types/            # TypeScript Interface definitions
│   ├── Dockerfile            # Container definition
│   └── package.json          # Frontend Dependencies
├── dokumentacja/             # Design & Database Architecture Diagrams
│   ├── Database diagram.png
│   └── Use case diagram.png
└── docker-compose.yml        # Multi-container Orchestration
```

---

## 🚀 Quick Start & Installation

Ensure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

### 1. Spin up the infrastructure
Run the following command in the root folder of the repository:

```bash
docker-compose up --build
```

This command spawns:
*   **PostgreSQL Database:** initialized and checked via dynamic healthchecks on port `5432`
*   **Backend REST API:** running on [http://localhost:8000](http://localhost:8000) (waits for database to be healthy before starting)
*   **Frontend Client:** running on [http://localhost:3000](http://localhost:3000)

### 2. Default Credentials (Seeded Automatically)
When the backend container boots up, it automatically registers the database schema and seeds PostgreSQL with default values and a Superuser admin:
*   **Email:** `admin@fleet.pl`
*   **Password:** `admin123`

### 3. Populate Mock Data (Optional)
To instantly populate the database with a set of vehicles, manufacturers (Toyota, VW, Ford), equipment packages, caretakers, and active reservations, execute the seed script:

```bash
# In a new terminal window:
docker-compose exec backend python script.py
```

---

## 🧪 Development Setup (Manual)

If you prefer to run the services outside Docker containers:

### Prerequisites
Make sure you have a local PostgreSQL instance running and a database created. Set the database connection string in your environment:
```bash
export DATABASE_URL="postgresql+psycopg://your_user:your_password@localhost:5432/your_database"
```

### Backend
1.  Navigate to `backend` directory: `cd backend`
2.  Install dependencies using `uv` or `pip`:
    ```bash
    uv venv
    source .venv/bin/activate
    uv pip install -r pyproject.toml
    uv pip install "psycopg[binary]>=3.1.0"
    ```
3.  Start the development server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

### Frontend
1.  Navigate to `frontend` directory: `cd frontend`
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start Next.js dev server:
    ```bash
    npm run dev
    ```

---

## 📖 API Documentation & Swagger UI

Once the backend is running, you can explore and interact with the API endpoints dynamically using the built-in documentation engines:

*   **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Redoc Alternative UI:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📈 System Designs

The architecture plans and relationship mappings are documented under the [dokumentacja](file:///Users/adam/dev/2026_TAB_12_KASPROWSKI/dokumentacja) directory:
*   [Database Entity-Relationship Diagram](file:///Users/adam/dev/2026_TAB_12_KASPROWSKI/dokumentacja/Database%20diagram.png)
*   [Use Case Diagrams](file:///Users/adam/dev/2026_TAB_12_KASPROWSKI/dokumentacja/Use%20case%20diagram.png)
