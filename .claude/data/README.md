# Data

Runtime data and state files for the framework.

## Files

| File | Purpose | Updated By |
|------|---------|------------|
| `session-stats.json` | Current session info | session_hooks.py |
| `current-project.json` | Global project reference | session_hooks.py |
| `discovery-report.json` | Project structure analysis | explorer_helper.py |

## Directories

| Directory | Purpose |
|-----------|---------|
| `projects/` | Per-project data |
| `sessions/` | Session history |

## Format Examples

### session-stats.json
```json
{
  "projectPath": "C:/projects/my-app",
  "projectName": "my-app",
  "timestamp": "2025-12-31T09:00:00Z",
  "analysis": {
    "projectType": "node",
    "framework": "nextjs",
    "platform": "web"
  }
}
```

### discovery-report.json
```json
{
  "root": "C:/projects/my-app",
  "tech_stack": {
    "framework": "nextjs",
    "language": "typescript",
    "styling": "tailwind"
  },
  "entry_points": {
    "main": "app/page.tsx",
    "config": "next.config.js"
  },
  "structure": {
    "src": "app/",
    "components": "components/"
  }
}
```

## Notes

- All files are JSON format
- Scripts handle missing files gracefully
- UTF-8-sig encoding for Windows compatibility
