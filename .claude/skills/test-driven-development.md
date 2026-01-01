# Test-Driven Development (TDD)

**Write the test first. Watch it fail. Write minimal code to pass.**

## The Iron Law
**No production code without a failing test first.**

Any code written before tests must be deleted entirely. No exceptions for "reference" use.

## Red-Green-Refactor Cycle

### RED Phase
Write a single, minimal failing test:
```typescript
describe('calculateTotal', () => {
  it('sums item prices with tax', () => {
    const items = [{ price: 100 }, { price: 50 }];
    expect(calculateTotal(items)).toBe(177); // 150 * 1.18
  });
});
```

### Verify RED
Run the test:
```bash
npm test -- --watch
```
- Test MUST fail
- Failure must be for expected reason (missing function, not syntax error)
- If test passes → you're testing existing functionality

### GREEN Phase
Write the **simplest** code to pass:
```typescript
function calculateTotal(items: { price: number }[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * 1.18;
}
```

**Rules:**
- No extra features
- No "improvements"
- No refactoring yet
- Minimum code to pass

### Verify GREEN
- Test passes
- All other tests still pass
- Clean output (no warnings)

### REFACTOR Phase
Now improve code quality:
- Remove duplication
- Improve naming
- Extract functions
- Keep tests green throughout

## Good Test Characteristics

### Tests One Behavior
```typescript
// BAD: Multiple behaviors
it('creates user and sends email', () => {
  const user = createUser(data);
  expect(user).toBeDefined();
  expect(emailService.send).toHaveBeenCalled();
});

// GOOD: Separate tests
it('creates user with valid data', () => {
  const user = createUser(data);
  expect(user.email).toBe(data.email);
});

it('sends welcome email after creation', () => {
  createUser(data);
  expect(emailService.send).toHaveBeenCalledWith(expect.objectContaining({
    to: data.email
  }));
});
```

### Clear Names
```typescript
// BAD
it('works', () => {});
it('test 1', () => {});

// GOOD
it('returns empty array when no items match filter', () => {});
it('throws ValidationError when email is invalid', () => {});
```

### Real Code Over Mocks
```typescript
// Prefer real implementations
const result = await userService.create(realData);

// Mock only external dependencies
jest.mock('./emailService');
```

## Why This Order Matters

| Tests First | Tests After |
|-------------|-------------|
| "What should this do?" | "What does this do?" |
| Proves behavior works | Proves existing code runs |
| Catches edge cases | Misses edge cases |
| Documents intent | Documents implementation |

## Critical Red Flags

**DELETE CODE AND RESTART IF:**
- Implementation before tests
- Tests written after code
- Tests passing immediately
- Any rationalization about "this time being different"

## Verification Checklist

Before completing work:
- [ ] Every new function has a test
- [ ] Each test was observed failing first
- [ ] Minimal code written for passing
- [ ] All tests pass with clean output
- [ ] Real code tested (mocks only when unavoidable)
- [ ] Edge cases covered
- [ ] Error paths tested
