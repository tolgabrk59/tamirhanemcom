# Verification Before Completion

**Evidence before claims, always.**

Never assert work is complete without running fresh verification commands.

## The Gate Function

Before claiming ANY status, follow this 5-step process:

### Step 1: Identify
What command proves your claim?
```bash
# "Tests pass" → npm test
# "Build succeeds" → npm run build
# "Types correct" → npx tsc --noEmit
# "No lint errors" → npm run lint
```

### Step 2: Run Fresh
Execute the command NOW (not from memory):
```bash
npm test
# or
npm run build
```

### Step 3: Read Complete Output
- Check exit code (0 = success)
- Read all warnings
- Note any skipped tests
- Verify test count matches expected

### Step 4: Verify
Does output actually support your claim?
```
✓ 47 tests passed → Claim "tests pass" is valid
✗ 46 passed, 1 skipped → Claim is INVALID (skipped ≠ passed)
```

### Step 5: Claim with Evidence
```
Tests pass:
✓ 47/47 tests passed
✓ Exit code: 0
✓ No warnings
```

## What Doesn't Count as Verification

| Not Valid | Why |
|-----------|-----|
| Previous test run | Need FRESH execution |
| "I'm confident" | Confidence ≠ evidence |
| Linter passed | Doesn't prove build works |
| Code changes made | Doesn't prove bug fixed |
| Agent reports success | Need independent verification |
| Partial output | Need complete results |

## Red Flags - About to Violate Rule

Watch for these patterns:
- Using "should", "probably", "seems to"
- Expressing satisfaction before verification
- Trusting agent success reports
- Relying on partial verification
- Committing without fresh evidence
- Creating PRs without verification

## Required Verification Points

### Before Commit
```bash
# All must pass
npm run lint          # No lint errors
npx tsc --noEmit      # No type errors
npm test              # All tests pass
npm run build         # Build succeeds
```

### Before PR
```bash
# Fresh verification
git status            # Expected files staged
npm run build         # Production build works
npm test              # All tests pass
```

### Before Claiming "Fixed"
```bash
# Reproduce original bug → Fails
# Apply fix
# Reproduce again → Passes
# Run full test suite → All pass
```

## Evidence Format

When claiming completion:
```
## Verification Results

### Build
✓ `npm run build` completed successfully
✓ Exit code: 0
✓ Output: .next directory created

### Tests
✓ `npm test` passed
✓ 47/47 tests passed
✓ No skipped tests

### Types
✓ `npx tsc --noEmit` passed
✓ No type errors

### Lint
✓ `npm run lint` passed
✓ No warnings
```

## Anti-Patterns

### "It Should Work"
```
❌ "I made the changes, it should work now"
✓ "I ran npm test, all 47 tests pass (output attached)"
```

### Trusting Memory
```
❌ "Tests passed when I ran them earlier"
✓ "Running tests now... [fresh output]"
```

### Partial Verification
```
❌ "TypeScript compiles" (doesn't mean tests pass)
✓ "TypeScript compiles AND tests pass AND build succeeds"
```
