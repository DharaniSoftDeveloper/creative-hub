# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Creative Hub (`artifacts/creative-hub`)
- **Type**: React + Vite web app (frontend-only)
- **Preview path**: `/`
- **Purpose**: Premium landing page for Creative Hub brand (owner: Dharani)
  - Showcases interactive educational projects for students and small organizations
  - Dark luxurious theme with electric purple/cyan glowing accents
  - Framer Motion scroll animations and parallax effects
  - Sections: Hero, Featured Projects, About, Who We Serve, Contact, Footer
  - Contact: 9786954984 | creativehub2k@gmail.com

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
