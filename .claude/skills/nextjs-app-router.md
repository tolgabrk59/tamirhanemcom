# Next.js App Router Fundamentals

> Skill for Next.js 14+ App Router development patterns

## Core File Structure

```
app/
├── layout.tsx       # Shared UI (preserves state)
├── page.tsx         # Route content
├── loading.tsx      # Loading UI
├── error.tsx        # Error boundary
├── not-found.tsx    # 404 UI
└── route.ts         # API endpoint
```

## Root Layout Requirements

```typescript
// app/layout.tsx - MUST include html and body tags
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
```

## Metadata Export Pattern

```typescript
// Replace next/head with metadata export
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

## generateStaticParams (SSG)

```typescript
// Server Components only - no 'use client'
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

## Server vs Client Components

| Use Server Components | Use Client Components |
|-----------------------|-----------------------|
| Data fetching | Event handlers |
| Database access | useState/useEffect |
| Sensitive data | Browser APIs |
| Large dependencies | Interactivity |

## Navigation

```typescript
// Use Next.js Link for internal routes
import Link from 'next/link';

<Link href="/about">About</Link>
```

## API Routes

```typescript
// app/api/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: 'value' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

## Critical Rules

1. Root layout MUST include `<html>` and `<body>` tags
2. No `'use client'` for static/data-fetching components
3. Use `metadata` export, not `next/head`
4. generateStaticParams only in Server Components
5. Avoid `@typescript-eslint/no-explicit-any` - use proper types
