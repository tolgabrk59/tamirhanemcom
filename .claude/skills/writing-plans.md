# Writing Plans

Create detailed implementation plans for multi-step tasks.

## Core Principle
Write plans assuming the implementer has ZERO context and limited domain knowledge.

## Key Characteristics

### Granularity
- Each task: 2-5 minutes
- One action per task
- No ambiguity

### Approach
- Follow TDD (test first)
- Apply DRY and YAGNI
- Frequent commits

### Audience
- Skilled developer
- Minimal toolset knowledge
- No project context

## Plan Structure

### Header
```markdown
# Feature: User Authentication

## Goal
Allow users to log in with email/password and receive JWT token.

## Architecture
- POST /api/auth/login endpoint
- JWT-based authentication
- Zod validation

## Tech Stack
- Next.js 14 App Router
- NextAuth.js
- Zod for validation
- Prisma for database
```

### Task Format
```markdown
## Task 1: Create login schema

### File
`src/lib/validations/auth.ts`

### Steps
1. Create file if not exists
2. Add Zod schema for login:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### Test
```bash
npx tsc --noEmit
# Expected: No errors
```

### Commit
```bash
git add src/lib/validations/auth.ts
git commit -m "feat(auth): add login validation schema"
```
```

### Complete Task Example
```markdown
## Task 2: Write login schema tests

### File
`src/__tests__/auth.test.ts`

### Steps
1. Create test file
2. Add tests:

```typescript
import { loginSchema } from '@/lib/validations/auth';

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});
```

### Verification
```bash
npm test -- auth.test.ts
# Expected: 3 tests passed
```

### Commit
```bash
git add src/__tests__/auth.test.ts
git commit -m "test(auth): add login schema tests"
```
```

## Plan File Location

Save to: `docs/plans/YYYY-MM-DD-<feature-name>.md`

```
docs/
└── plans/
    ├── 2026-01-01-user-authentication.md
    ├── 2026-01-02-vehicle-search.md
    └── ...
```

## Execution Options

### Option A: Subagent-Driven
- Use `subagent-driven-development` skill
- Fresh subagent per task
- Two-stage review after each

### Option B: Parallel Session
- Use `executing-plans` skill
- Separate session with plan file
- Execute tasks sequentially

## Documentation Requirements

Every task must include:
- [ ] Exact file paths
- [ ] Complete code samples (no placeholders)
- [ ] Precise commands with expected output
- [ ] Git commit message

## Quality Checklist

Before finalizing plan:
- [ ] Each task is 2-5 minutes
- [ ] No dependencies on future tasks
- [ ] All code samples are complete
- [ ] Verification commands included
- [ ] TDD approach (tests before implementation)
