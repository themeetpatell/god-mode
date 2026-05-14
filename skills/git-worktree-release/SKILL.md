---
name: git-worktree-release
description: Use for safe parallel development, branch isolation, release flow, changelog generation, and merge/rollback workflows.
---

# Git Worktree Release

## Workflow
1. Define branch/worktree purpose.
2. Create isolated worktree plan.
3. Implement or review changes in slices.
4. Run tests and generate changelog.
5. Prepare merge and rollback notes.

## Output
```
BRANCH PLAN:
WORKTREE COMMANDS:
CHANGE SLICES:
TESTS:
CHANGELOG:
MERGE / ROLLBACK:
```

## Rules
- Keep risky changes isolated.
- Never overwrite uncommitted work.
