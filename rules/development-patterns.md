---
description: 
globs: 
alwaysApply: true
---
# Development Patterns & Best Practices

## Authentication Flow
When working with authentication, follow these patterns:

### Client-Side Authentication
- Use hooks from /src/features/auth
- Check /src/features/sign-up/ui/SingUpForm.tsx for form patterns

### Server-Side Authentication
- Middleware patterns in middleware.ts
- Supabase actions in /supabase

## UI Component Patterns

### Adding New Components
1. Use shadcn/ui: `pnpm add-component [component]` 
2. Custom components go in appropriate FSD layer
3. Follow patterns in shared/ui

### Styling Conventions
- Use Tailwind CSS classes
- Follow utility-first approach
- Check global.css for global styles
- Use shared/utils for utility functions

## Data Management Patterns

### Database Operations
- Use Supabase client from 
- Server actions pattern: create in `action/` folders within appropriate FSD layers
- Type definitions should match database schema

### File Structure for Features
```
features/[feature-name]/
├── action/          # Server actions
├── api/            # External API calls  
├── model/          # Business logic and types
├── ui/             # UI components
└── index.ts        # Public exports
```

## State Management

### Client State
- Use React hooks for local state
- Shared state through context when needed
- No external state management libraries

### Server State
- Use server actions for mutations
- Fetch data in server components when possible
- Cache appropriately using Next.js patterns