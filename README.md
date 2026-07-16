# ⚡ ApproveFlow — AI-Powered Approval Workflow Platform

> A next-generation, full-stack platform to automate hierarchical approval workflows with a premium dark-themed UI, real-time dashboards, and a robust Spring Boot backend.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Workflow Categories](#-workflow-categories)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ApproveFlow** is an enterprise-grade approval workflow management system designed to streamline organizational decision-making. It features a **premium glassmorphism dark-themed UI** built with React and a **Spring Boot REST API backend** with an H2 in-memory database. The platform supports multi-step approval chains, role-based routing, real-time analytics dashboards, and PDF report generation.

---

## ✨ Features

### 🎨 Frontend
- **Premium Dark UI** — Glassmorphism design with animated gradients, 3D tilt effects, and micro-animations
- **Interactive Dashboard** — Real-time stats cards, bar charts (monthly trends), and pie charts (department distribution) powered by Recharts
- **Workflow Designer** — Visual workflow builder with step-by-step approval chain configuration using React Flow
- **Request Management** — Create, track, filter, search, and export approval requests
- **PDF Export** — Generate detailed PDF reports of requests using jsPDF
- **User Approvals Panel** — Dedicated view for approvers to review and act on pending requests
- **Admin Panel** — Manage users, roles, and system configuration
- **Responsive Design** — Fully responsive layout with collapsible sidebar navigation
- **Live Activity Ticker** — Real-time activity feed on the landing page
- **Firebase Integration** — Authentication and real-time capabilities

### ⚙️ Backend
- **RESTful API** — Full CRUD operations for requests, workflows, users, and dashboard data
- **Multi-Step Workflows** — Configurable approval chains with SLA deadlines per step
- **Role-Based Routing** — Automatic request routing based on workflow rules
- **Data Seeding** — Auto-populates 342 sample requests and 6 workflow categories on startup
- **CORS Configured** — Pre-configured for local development (ports 5173, 3000, 8080)
- **H2 Database** — In-memory database with JPA/Hibernate ORM
- **Validation** — Request validation using Spring Boot Starter Validation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library with hooks & functional components |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Lightning-fast build tool & dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Premium Radix-based UI components |
| **Recharts** | Charts & data visualization |
| **React Flow** | Visual workflow diagram builder |
| **Framer Motion** | Smooth animations & transitions |
| **React Router v6** | Client-side routing |
| **React Hook Form + Zod** | Form handling & validation |
| **TanStack Query** | Server state management |
| **jsPDF** | Client-side PDF generation |
| **Firebase** | Authentication & backend services |
| **Lucide React** | Modern icon library |
| **Sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 3.3** | Java backend framework |
| **Spring Data JPA** | ORM & database access |
| **H2 Database** | In-memory relational database |
| **Spring Validation** | Request body validation |
| **Maven** | Build & dependency management |
| **Java 17** | Programming language |

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│         React Frontend          │
│   (Vite + TypeScript + Tailwind)│
│         Port: 5173              │
└────────────┬────────────────────┘
             │  REST API (HTTP)
             │  /api/*
┌────────────▼────────────────────┐
│      Spring Boot Backend        │
│     (Java 17 + Spring 3.3)      │
│         Port: 8080              │
├─────────────────────────────────┤
│     H2 In-Memory Database       │
│       (JPA / Hibernate)         │
└─────────────────────────────────┘
```

---

## 📁 Project Structure

```
approval-flow-ai-main/
│
├── 📂 src/                          # Frontend Source
│   ├── 📂 api/
│   │   └── client.ts                # API client for backend communication
│   ├── 📂 components/
│   │   └── 📂 layout/
│   │       └── AppSidebar.tsx       # Collapsible sidebar navigation
│   ├── 📂 pages/
│   │   ├── landing.tsx              # Landing page with 3D tilt card
│   │   ├── Auth.tsx                 # Login / Register page
│   │   ├── Dashboard.tsx            # Analytics dashboard with charts
│   │   ├── NewRequest.tsx           # Create new approval request
│   │   ├── RequestHistory.tsx       # View & filter all requests
│   │   ├── Approvals.tsx            # Approver's action panel
│   │   ├── Workflows.tsx            # Workflow designer & viewer
│   │   ├── AdminPanel.tsx           # Admin management panel
│   │   └── userapprovals.tsx        # User-specific approvals view
│   ├── 📂 hooks/                    # Custom React hooks
│   ├── 📂 test/                     # Frontend tests
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
│
├── 📂 backend/                      # Backend Source
│   ├── pom.xml                      # Maven configuration
│   └── 📂 src/main/java/com/approvalflow/
│       ├── ApprovalFlowApplication.java  # Main app + CORS + data seeder
│       ├── 📂 controller/
│       │   ├── AuthController.java       # Authentication endpoints
│       │   ├── DashboardController.java  # Dashboard stats endpoints
│       │   ├── RequestController.java    # Approval request CRUD
│       │   ├── UserController.java       # User management
│       │   └── WorkflowController.java   # Workflow rule endpoints
│       ├── 📂 model/
│       │   ├── ApprovalRequest.java      # Request entity
│       │   ├── User.java                 # User entity
│       │   ├── WorkflowRule.java         # Workflow rule entity
│       │   └── WorkflowStep.java         # Workflow step entity
│       ├── 📂 repository/
│       │   ├── ApprovalRequestRepository.java
│       │   ├── UserRepository.java
│       │   └── WorkflowRuleRepository.java
│       └── 📂 service/
│           ├── AuthService.java          # Auth business logic
│           ├── DashboardService.java     # Dashboard aggregations
│           ├── RequestService.java       # Request business logic
│           └── WorkflowService.java      # Workflow business logic
│
├── 📂 public/                       # Static assets
├── 📂 dist/                         # Production build output
├── index.html                       # HTML entry point
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Node.js dependencies
└── .gitignore                       # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ & **npm** — [Install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Java 17** — [Download OpenJDK](https://adoptium.net/)
- **Maven** — [Install Maven](https://maven.apache.org/install.html)

### 1. Clone the Repository

```bash
git clone https://github.com/aravinth081/approval-work-flow-.git
cd approval-work-flow-
```

### 2. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on **http://localhost:8080** and auto-seed the database with demo data.

### 3. Start the Frontend

```bash
# From the project root
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**.

### 4. Open the Application

Navigate to **http://localhost:5173** in your browser to see the ApproveFlow landing page.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |

### Approval Requests
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/requests` | Get all approval requests |
| `POST` | `/api/requests` | Create a new request |
| `PUT` | `/api/requests/{id}` | Update a request |
| `DELETE` | `/api/requests/{id}` | Delete a request |

### Workflows
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workflows` | Get all workflow rules |
| `POST` | `/api/workflows` | Create a new workflow |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Get all users |
| `POST` | `/api/users` | Create a new user |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Get dashboard statistics |

---

## 📋 Workflow Categories

The platform comes pre-configured with **6 workflow categories**:

| Category | Type | Steps | SLA |
|---|---|---|---|
| 🏢 **Infrastructure & Resources** | Standard | Employee → IT Helpdesk → MD | 24h |
| 💰 **Financial Approval** | Standard | Employee → Team Lead → Accountant → CFO | 48h |
| 👥 **Hiring & Recruitment** | Standard | Employee → Team Lead → HR Team | 48h |
| 📊 **Project Approval** | Standard | Employee → Team Lead → CFO | 24h |
| 🗓️ **Leave Approval** | Fast-Track | Employee → Reporting Manager | Instant |
| 🚨 **Emergency Approval** | Critical | Employee → Team Lead → MD | 2h |

---

## 🧪 Running Tests

### Frontend Tests
```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Backend Tests
```bash
cd backend
mvn test
```

---

## 📦 Build for Production

### Frontend
```bash
npm run build
```

The production build will be output to the `dist/` directory.

### Backend
```bash
cd backend
mvn clean package
java -jar target/approval-flow-backend-1.0.0.jar
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Aravinth** — [@aravinth081](https://github.com/aravinth081)

---

<div align="center">

**⚡ Built with passion for modern enterprise workflows ⚡**

</div>
