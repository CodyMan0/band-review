# FSD Boilerplate

This boilerplate project helps learn and implement Feature Sliced Design (FSD) architecture. It includes example implementations of user authentication (sign-up, login) following FSD principles.

## Tech Stack

- **Frontend Framework**: Next.js (App Router)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Database**: Supabase

## Feature Sliced Design Structure

The project follows the FSD architecture layer structure:

```
src/
├── app/ # Global settings (former apps) + pages replacement
├── entities/ # Business entities (User etc.)
├── features/ # Business functionality implementation (auth etc.)
├── shared/ # Shared utilities and UI components
└── widgets/ # Independent UI blocks
```

### Key Features

#### 1. Authentication Features (features/auth)

- Sign Up
  - Email/password-based registration
  - User data validation
- Login
  - Email/password-based authentication
  - Session management (cookie-based)

#### 2. User Management (entities/user)

- User interface definition
- User state management

## Project Setup

1. Environment Setup

```bash
# Clone project
git clone [repository-url]

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
```

2. Environment Variables Configuration

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

3. Run Development Server

```bash
pnpm run dev
```

## FSD Architecture Characteristics

1. **Shared Layer**

   - UI components
   - Utility functions
   - Supabase client configuration

2. **Entities Layer**

   - User interface definitions
   - Base data models

3. **Features Layer**

   - Authentication functionality implementation
   - State management logic

4. **Widgets Layer**

   - LoginForm component
   - Non-reusable, composed UI blocks

5. **Apps Layer**
   - Global configuration
     - Routing setup
     - Global layouts
     - Middleware configuration
   - Page components

## Development Guide

ref .cursor/rules/coding-preferences
