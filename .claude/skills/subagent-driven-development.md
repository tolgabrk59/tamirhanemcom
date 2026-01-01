# Subagent-Driven Development

Execute implementation plans with fresh subagent per task and two-stage review.

## When to Apply
- Completed implementation plan exists
- Tasks are mostly independent
- Need to stay in current session
- Want fast iteration with quality gates

## Process Overview

```
┌─────────────────────────────────────────────────────────┐
│  For each task in plan:                                 │
│                                                         │
│  1. Implementation  ──► 2. Spec Review ──► 3. Quality   │
│     (Subagent)          (Pass/Fail)        Review       │
│                              │                  │       │
│                              ▼                  ▼       │
│                         Fix Issues          Fix Issues  │
│                              │                  │       │
│                              └────► Resubmit ◄──┘       │
│                                         │               │
│                                         ▼               │
│                                   Mark Complete         │
└─────────────────────────────────────────────────────────┘
```

## Stage 1: Implementation

Dispatch implementer subagent with:
- Full task text from plan
- Relevant context files
- Test requirements

```markdown
## Task: Implement user authentication endpoint

### Context
- File: src/app/api/auth/route.ts
- Uses: NextAuth.js
- Tests: src/__tests__/auth.test.ts

### Requirements
- POST /api/auth/login
- Validate email/password with Zod
- Return JWT on success
- Handle errors gracefully

### Deliverables
- [ ] Route implementation
- [ ] Zod schema
- [ ] Unit tests
- [ ] Integration test
```

## Stage 2: Spec Compliance Review

Verify code matches specifications EXACTLY:

### Checklist
- [ ] All requirements from task implemented
- [ ] No missing functionality
- [ ] No extra functionality (YAGNI)
- [ ] Tests cover all requirements
- [ ] Edge cases handled per spec

### If Issues Found
```markdown
## Spec Compliance Issues

1. Missing: Password validation minimum 8 chars
2. Extra: Added rate limiting (not in spec)
3. Wrong: Returns 401 instead of 403 for invalid token
```

Implementer fixes and resubmits. Loop until approved.

## Stage 3: Code Quality Review

After spec passes, review for quality:

### Checklist
- [ ] Follows project conventions
- [ ] No code smells
- [ ] Proper error handling
- [ ] TypeScript strict compliance
- [ ] No hardcoded values
- [ ] Proper logging
- [ ] Clean, readable code

### If Issues Found
```markdown
## Quality Issues

1. Extract magic number 8 to PASSWORD_MIN_LENGTH constant
2. Missing error logging in catch block
3. Use early return instead of nested if
```

Implementer fixes and resubmits. Loop until approved.

## Critical Rules

1. **Never skip either review stage**
2. **Never proceed with unfixed issues**
3. **Never start quality review before spec passes**
4. **Answer subagent questions completely before proceeding**
5. **Review loops continue until explicit approval**

## Task Completion

Only mark task complete when:
- Spec review: APPROVED
- Quality review: APPROVED
- Tests: PASSING
- No pending questions

## Integration Points

### Before Starting
- Have completed plan from `writing-plans` skill
- Tasks should be 2-5 minutes each
- Dependencies resolved

### During Execution
- Use `test-driven-development` for implementation
- Use `verification-before-completion` after each task
- Use `systematic-debugging` if issues arise

### After Completion
- Run full verification suite
- Document any deviations from plan
- Commit with conventional commit message
