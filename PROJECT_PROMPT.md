# Creative Hub Showcase - Project Prompt

## 📋 Project Overview

**Creative Hub Showcase** is a full-stack, type-safe web application that serves as a modern portfolio and project showcase platform. It demonstrates a complete software development solution with contact form handling, file upload capabilities, and responsive UI design.

The project is built as a **monorepo** using pnpm workspaces, featuring a React frontend with a Node.js/Express backend, all written in TypeScript with a focus on type safety and maintainability.

---

## 🎯 Core Purpose

- **Portfolio Platform**: Showcase software projects and development work with detailed descriptions and categorization
- **Professional Contact Channel**: Enable visitors to submit contact inquiries and project requests
- **File Management**: Handle file uploads and manage submissions with secure backend processing
- **Modern UX**: Deliver a responsive, animated, and visually appealing user interface
- **Deployment Flexibility**: Support both static hosting and full-stack deployment options

---

## 🏗️ Architecture Overview

### Monorepo Structure (pnpm workspaces)

```
Creative-Hub-Showcase/
├── artifacts/
│   ├── api-server/          # Express.js backend server
│   ├── creative-hub/        # React + Vite frontend
│   └── mockup-sandbox/      # Additional React app for mockups
├── lib/
│   ├── api-client-react/    # Type-safe API client for React
│   ├── api-spec/            # OpenAPI specification & code generation
│   ├── api-zod/             # Zod validation schemas
│   └── db/                  # Database config with Drizzle ORM
├── scripts/                 # Build & deployment automation
└── package.json            # Workspace root configuration
```

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Vite (build tool)
- Framer Motion (animations)
- Tailwind CSS (styling)
- shadcn/ui (component library)
- Lucide Icons (icon library)
- React Query/hooks (state management)

**Backend:**
- Express.js (REST API server)
- Node.js + TypeScript
- Pino (structured logging)
- CORS enabled for cross-origin requests
- Multer integration (file uploads)

**Database & ORM:**
- Drizzle ORM (type-safe SQL queries)
- PostgreSQL-ready schema definitions
- Zod schemas for validation

**API & Code Generation:**
- OpenAPI 3.1.0 specification
- Orval (generates TypeScript API clients from OpenAPI)
- Type-safe API client auto-generated from spec

**DevOps & Deployment:**
- pnpm (package manager)
- TypeScript strict mode
- Render.yaml (deployment configuration)
- Static site publishing support

---

## 🔧 Key Features & Functionality

### 1. **Frontend (creative-hub)**
- **Hero Section**: Eye-catching landing page with animations
- **Projects Showcase**: Displays portfolio projects with categories:
  - E-Commerce Web Application
  - School Management System
  - Additional projects (categorized)
- **Contact Form**: Visitor inquiries with EmailJS integration
- **File Upload Demo**: Upload interface for demos
- **Responsive Design**: Mobile-first, fully responsive layout
- **Navigation**: Dynamic menu with smooth scrolling

### 2. **API Server (api-server)**

#### Available Endpoints:
- `GET /api/healthz` - Health check status
- `POST /api/contact` - Submit contact form inquiries
- `POST /api/upload` - Handle file uploads
- `GET /uploads/*` - Serve uploaded files
- `/` - Serve creative-hub static frontend

#### Capabilities:
- Request logging with structured Pino logger
- CORS support for cross-origin requests
- JSON/URL-encoded body parsing
- Static file serving (uploads & frontend build)
- Contact form submission storage (JSONL format)

### 3. **Database Layer (lib/db)**
- **Drizzle ORM**: Type-safe SQL query builder
- **Schema-first approach**: Define tables in TypeScript
- **Extensible**: Ready for PostgreSQL or other SQL databases
- **Zod Integration**: Automatic validation schemas from table definitions

### 4. **API Client (lib/api-client-react)**
- Auto-generated from OpenAPI spec
- Type-safe React hooks for API calls
- Supports custom fetch implementation
- Fully typed request/response handling

### 5. **API Specification (lib/api-spec)**
- OpenAPI 3.1.0 compliant
- Orval configuration for code generation
- Serves as single source of truth for API contract
- Auto-generates TypeScript types and client methods

---

## 📦 Shared Libraries

### api-zod
- Pre-defined Zod validation schemas
- Auto-generated types from database schemas
- Used for frontend and backend validation consistency

### api-client-react
- Pre-configured fetch client for React
- TypeScript-first API interactions
- Supports custom headers and authentication

---

## 🚀 Development Workflow

### Build Process
```bash
pnpm run typecheck         # Type check entire workspace
pnpm run typecheck:libs    # Type check lib folder only
pnpm run build             # Build all packages (type-check + build artifacts)
```

### Package Scripts
Each artifact maintains its own build process:
- `creative-hub`: Vite build → `dist/public`
- `api-server`: TypeScript compilation
- `mockup-sandbox`: Vite build

---

## 🌐 Deployment Options

### 1. **Static Site Deployment** (Recommended for frontend-only)
- Build the frontend: `pnpm run build`
- Upload `artifacts/creative-hub/dist/public` to static host
- Use EmailJS for contact form (no backend needed)
- Supported platforms: Render, Netlify, Vercel, GitHub Pages

### 2. **Full-Stack Deployment**
- Deploy both frontend and API server
- Use included `render.yaml` for Render platform
- Backend handles contact submissions with SMTP backup
- Enable file upload persistence

### 3. **Build Package
```bash
powershell -ExecutionPolicy Bypass -File .\scripts\publish-static.ps1
```
- Creates optimized build in `artifacts/creative-hub/dist/public`
- Generates `artifacts/creative-hub/publish/creative-hub-static.zip`

---

## 📊 Data Models

### Contact Submissions
- Stored in `artifacts/api-server/submissions/contact-requests.jsonl`
- JSONL format for streaming data
- Includes timestamp, contact info, and message

### Uploaded Files
- Stored in `artifacts/api-server/uploads/`
- Named with timestamp prefix
- Served via static file endpoint

---

## 🔐 Security & Best Practices

- CORS enabled for safe cross-origin requests
- Express middleware for request parsing
- Pino structured logging for audit trails
- Type safety across frontend and backend
- Input validation with Zod schemas
- Environment-based configuration (`.env.local`)

---

## 🎨 UI/UX Features

- **Smooth Animations**: Framer Motion for scroll effects and transitions
- **Modern Components**: shadcn/ui component library
- **Responsive**: Mobile, tablet, and desktop optimized
- **Accessibility**: Semantic HTML and ARIA considerations
- **Icons**: Lucide icon library for consistent iconography
- **Dark/Light Mode**: Tailwind CSS theme support

---

## 📝 Configuration Files

- `tsconfig.base.json` - Base TypeScript configuration
- `pnpm-workspace.yaml` - Monorepo workspace definition
- `render.yaml` - Render platform deployment config
- `drizzle.config.ts` - Database ORM configuration
- `orval.config.ts` - OpenAPI code generation config
- `vite.config.ts` - Frontend build configuration

---

## 🔄 API Specification

### Current OpenAPI Definition
```yaml
Title: Api
Version: 0.1.0
Base Path: /api
Servers: [/api]

Endpoints:
  GET /healthz
    - Health check endpoint
    - Returns: { status: string }
```

**Extensible**: Ready to add more endpoints (contact, upload, projects API)

---

## 🎯 Development Priorities

1. **Type Safety**: Full TypeScript strict mode across frontend and backend
2. **Modularity**: Shared libraries prevent code duplication
3. **API-First**: OpenAPI specification drives client code generation
4. **Developer Experience**: Clear monorepo structure with shared configs
5. **Performance**: Vite for fast builds, static serving for frontend
6. **Maintainability**: Consistent patterns, centralized configurations

---

## 🚦 Getting Started

1. Install dependencies: `pnpm install`
2. Type-check: `pnpm run typecheck`
3. Build: `pnpm run build`
4. Develop:
   - Frontend: `cd artifacts/creative-hub && pnpm run dev`
   - Backend: `cd artifacts/api-server && pnpm run dev`
5. Deploy: Use `scripts/publish-static.ps1` for static build or `render.yaml` for full-stack

---

## 📋 Key Files to Understand

| File | Purpose |
|------|---------|
| `artifacts/api-server/src/app.ts` | Express server configuration |
| `artifacts/creative-hub/src/App.tsx` | Main React app component |
| `artifacts/api-server/src/routes/` | API endpoints |
| `lib/api-spec/openapi.yaml` | API contract definition |
| `lib/db/src/schema/index.ts` | Database schema definitions |
| `package.json` | Workspace root & scripts |

---

## 🎓 Next Steps for Enhancement

- Expand database schema with project and submission models
- Implement authentication (Entra ID / OAuth)
- Add admin dashboard for submission management
- Integrate CMS for dynamic project content
- Add real-time notifications
- Implement analytics tracking
- Multi-language support (i18n)
- PWA capabilities for offline support

---

**This is a production-ready, scalable foundation for a modern portfolio and contact management platform.**
