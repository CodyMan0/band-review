## Architecture Overview

This is a monorepo following Feature Sliced Design (FSD) architecture with three main applications.

### FSD Layer Dependencies

Follow strict dependency rules (upper layers can only depend on lower layers):

```
app → widgets → features → entities → shared
```

Within packages that implement FSD:

- **entities**: Business entities with Read operations only
  - Use view-specific types (ViewModels) for display/read components
  - CAN import Supabase database types for read operations only
  - Use `action/` folder for server actions (read operations like get*, fetch*, load\*)
  - Structure: `model/`, `action/`, `ui/`, `lib/`
  - **IMPORTANT**: All read operations (GET/SELECT) must be in entities layer
- **features**: Business logic with CUD operations
  - Use Supabase database types for server actions and mutations
  - Use `action/` folder for server actions (CUD operations like create*, update*, delete\*)
  - Handle data transformation between database and view models
  - **IMPORTANT**: Features can import from entities for read operations
- **widgets**: Composed UI blocks combining different slices(domain) features or entities
- Each slice exports through `index.ts` for clean public API

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Package Manager**: pnpm with workspaces
- **Build Tool**: Turborepo
- **Database & Auth**: Supabase
- **UI**: shadcn/ui + Tailwind CSS
- Can add new UI component with shadcn - Move to packages/ui, then `pnpm add-component button`
- **State**: React hooks + server state
- **Language**: TypeScript

## Development Guidelines

### Execute all database jobs with supabase mcp

**MANDATORY**: After editing any table structure, you MUST update types.ts using the following command:

```bash
cd supabase
npx supabase gen types typescript --project-id qpvjugixsdmljedveiqg --schema public > types.ts
```

### Server Components First

- Default to server components unless client interaction is required
- Use `'use client'` directive only when necessary
- Handle data fetching in server components or server actions

### Supabase Development Guidelines

- ✅ **Use `await getSupabaseServerClient()`** - Always initialize Supabase server client using `await getSupabaseServerClient()` function (note: this is an async function)
- ✅ **Type Safety** - Use type definitions from `@packages/supabase/src/types.ts` for all Supabase operations
- Implement Row Level Security (RLS) policies for data access control

### FSD Import Rules

- Import from package public APIs: `@packages/<name>` e.g. @packages/ui
- No cross-layer imports within same level
- No direct internal imports - use index.ts exports

### Server Actions Rules

- **Always declare 'use server' directive** - Must be the first line in any server action file
- This applies to all files in `action/` folders across entities and features layers
- Required for Next.js to properly identify and handle server-side code

### Code Style

- All apps use consistent ESLint + Prettier configuration
- Simple import sorting with eslint-plugin-simple-import-sort
- Tailwind CSS with typography plugin

### Layout Guidelines

- **Use Flexbox over Grid**: Always prefer `flex` over `grid` for layouts, even for responsive design
- **Responsive Design**: Implement responsive layouts using Flexbox with Tailwind CSS classes

### Package Management

- `pnpm install` - Install dependencies (uses pnpm workspaces)

### Modal Implementation

- **Use Next.js Parallel Routes**: Implement modals using Next.js parallel routes pattern
- Structure: `@modal` folder with `default.tsx` for non-modal states
- **Concrete Example**: `app/(manager)/setting/org/@modal/(.)create/page.tsx` for company creation modal
- **Route Interception**: Use `(.)` prefix for intercepting parallel routes
- **Modal Management**: Control open state with `router.back()` for closing

## F.S.D Implementation Guidelines

### Entities Layer

- **React Server Components First**: Default to server components for data display
- **Read Operations Only**: Use `get*` server actions with Supabase query logic
- **Loading States**: Implement Suspense for loading states (outside of RSC)
- **Type Safety**: Use view models and DTOs for immutable data representation

### Features Layer

#### Form Implementation

##### Type System Design

- Create type definitions corresponding to FormData (e.g., `PartnerFormData`)
- Define enum types as union types (e.g., `PartnerKind`)
- Clearly distinguish between required and optional fields in type definitions

##### Code Structure Improvement

- `parseFormData()`: Separate function to convert FormData to type-safe objects
- `validateFormData()`: Separate validation logic into dedicated functions
- Integrate individual variables into structured objects for processing

##### Modularization and Reusability

- Separate parsing logic into independent files (`parse-*-form-data.ts`)
- Centralize exports through `index.ts` in model folder
- Clearly separate type definitions and utility functions for better management

##### React 19 Form Implementation

- Use `useActionState` hook for form state management with server actions
  - use isPending for loading status and disabled sepecific ui(e.g. submit button)
- Accept server action as prop for component flexibility and testability
- Implement uncontrolled forms with HTML form elements and FormData

#### Server Data Mutation

- Use uncontrolled forms with HTML5 validation rules
- Implement `useActionState` for form state management
- Handle server actions with Supabase query logic (create, update, delete)
- Use Suspense and pending states for loading UI

#### Client State Mutation

- Handle filter/sort operations using URL state (searchParams, params)
- Use server actions for query operations
- Implement client-side state management for interactive features

## Clean F.S.D Principles (Next.js + Supabase Implementation)

### Philosophy & Goals

- **Physically** separate **Read (READ)** and **Write (MUTATION)** responsibilities to enforce **one-way dependencies**.
- Align with React's **Server-first** direction and enable **AI "vibe-coding"** collaboration by exposing intent and boundaries through folder structure alone.
- Minimize standalone API Routes—handle everything through **Server Actions** that call Supabase SDK directly.

### Core Axes — Entities vs Features

| Category           | Entities (READ)                                                                           | Features (WRITE)                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Role**           | Provide ViewModel / DTO, **immutable** data                                               | Encapsulate a single user interaction that mutates state                                                                              |
| **Implementation** | - **React Server Components**<br>- `entities/<domain>/action/get*.ts` (SELECT / GET only) | - **Server Actions** for POST/PUT/DELETE<br>- Domain write → `action/submit.ts`<br>- Client-only state write → `model/type.client.ts` |
| **Rules**          | No mutations; cache-friendly                                                              | May **read** Entities, but all writes must go through Features                                                                        |

### Dependency Rules

```
[Widgets / app routes]
        ↓ (READ)
    [Entities]   ←─(READ)─  [Features]   ←─ external write requests
```

- **Entities** depend on nothing.
- **Features** may read from Entities but never vice versa.
- Route/UI layers consume Entities (data) and Features (actions) only.

## Communication Preferences

- 📌 **Summarize** – Briefly summarize each completed task.
- 📏 **Change Scale** – Classify changes as `Small`, `Medium`, or `Large`.
- ❓ **Clarify First** – Ask questions if any instruction is unclear.
- 🧠 **Emoji Check** – Start each response with a random emoji to confirm context.
- ⚠️ **Respect Emotion** – If urgency is signaled (e.g., "This is critical"), increase caution and precision.

### Advanced Communication

- 📘 For `Large` changes, always plan → explain → wait for approval → execute.
- 🧾 Always state what is complete vs. what is pending.

## Code Quality Principles

- **Simplicity**: Prioritize the simplest solution over complex ones.
- **Avoid Redundancy**: Prevent code duplication and reuse existing functionality (**DRY principle**).
- **Guardrails**: Do not use mock data in development or production environments, except in tests.
- **Efficiency**: Optimize output to minimize token usage while maintaining clarity.

## Engineering Excellence Standards

### Professional Mindset

- **Senior Engineer Perspective**: Act as a 15-year senior product engineer with deep expertise in building scalable systems
- **Quality First**: Prioritize high-quality, production-ready implementations over quick fixes
- **Long-term Vision**: Consider maintainability and scalability in every architectural decision
- **Technical Debt Prevention**: Proactively prevent technical debt rather than creating it

### Code Quality Standards

- **Zero Duplication**: Ruthlessly eliminate code duplication through proper abstraction and reusable components
- **Single Source of Truth**: Each piece of logic should exist in exactly one place
- **Composability**: Build small, focused, composable units that work together
- **Consistency**: Maintain consistent patterns, naming conventions, and architectural decisions throughout

### Problem-Solving Methodology

- **Deep Thinking**: Analyze problems thoroughly before implementing solutions
- **Root Cause Analysis**: Always identify and fix the fundamental issue, not just symptoms
- **Minimal Intervention**: Solve problems with the smallest possible code changes
- **Systematic Debugging**: Use systematic approaches to isolate and resolve issues

### Implementation Excellence

- **Completeness**: Every feature must be fully functional, tested, and production-ready
- **Edge Case Handling**: Proactively identify and handle edge cases and error scenarios
- **Performance Conscious**: Consider performance implications from initial design
- **Future-Proof Design**: Build with extension points for predictable future requirements

## Task Execution

- **Parallelize with sub-agents**: Use Task tool for concurrent processing of independent tasks (searches, file reads, layer analysis)
  - **Critical**: Split tasks only when code modification ranges don't overlap (e.g., different domains like book, partner)
- **Batch similar operations**: Group and execute related tasks simultaneously for maximum efficiency
- **Error resolution**: Think deeply to identify root causes, then fix with minimal code changes rather than quick patches

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
