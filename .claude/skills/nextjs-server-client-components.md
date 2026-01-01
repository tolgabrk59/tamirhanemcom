# Next.js Server vs Client Components

> Decision guide for choosing between Server and Client Components

## Core Principle

**Server Components are the default** - no directive needed.
**Client Components require** `'use client'` at top of file.

## Decision Matrix

| Need | Component Type |
|------|----------------|
| Data fetching | Server |
| Database/API access | Server |
| Sensitive data (tokens, keys) | Server |
| Large dependencies | Server |
| Event handlers (onClick) | Client |
| useState/useEffect | Client |
| Browser APIs (localStorage) | Client |
| Third-party client libs | Client |

## Server Component Pattern

```typescript
// No directive needed - default
async function ProductList() {
  const products = await db.products.findMany();

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

## Client Component Pattern

```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

## Composition Pattern

```typescript
// Server Component wrapping Client Component
import { ClientCounter } from './Counter';

export default async function Page() {
  const data = await fetchData(); // Server-side

  return (
    <div>
      <h1>{data.title}</h1>
      <ClientCounter /> {/* Client-side interactivity */}
    </div>
  );
}
```

## useSearchParams with Suspense

```typescript
// Page (Server Component)
import { Suspense } from 'react';
import { SearchResults } from './SearchResults';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}

// SearchResults.tsx (Client Component)
'use client';

import { useSearchParams } from 'next/navigation';

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  return <p>Search: {query}</p>;
}
```

## Parallel Data Fetching

```typescript
// Avoid waterfall - fetch in parallel
async function Dashboard() {
  const [users, orders, stats] = await Promise.all([
    fetchUsers(),
    fetchOrders(),
    fetchStats(),
  ]);

  return <DashboardView users={users} orders={orders} stats={stats} />;
}
```

## Anti-Patterns to Avoid

- Adding `'use client'` to static components
- Data fetching in Client Components with useEffect
- Accessing cookies/headers in Client Components
- Importing Server Components into Client Components

## Pass Server to Client

```typescript
// WRONG: Import server component in client
// RIGHT: Pass as children or props

// Server Component
export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />
    </ClientWrapper>
  );
}
```
