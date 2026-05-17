---
name: git-worktree-release
description: Use for safe parallel development with git worktrees, branch isolation, release flow, changelog generation, merge/rollback workflows, and avoiding "I lost my work because I rebased the wrong branch" disasters. Ships actual shell commands, not just principles.
---

# Git Worktree Release

The point of worktrees: work on three things at once without `git stash` lottery and without dirty-tree merge surprises.

## When to use

- Parallel features / experiments on the same repo
- Long-running migration alongside daily feature work
- Reviewing a PR locally without disrupting your in-progress branch
- Release prep (cut a release branch, keep developing on main)
- Hot-fix on production while a refactor sits in another worktree
- Hand-off where you want someone else to take your tree without disturbing your local

## When NOT to use

- Single-branch workflow with short-lived feature branches (overkill)
- Tiny repo where switching branches is instant and safe
- Anywhere your tooling assumes a single working tree (some IDE plugins, some pre-commit hooks)

## Mental model

A repo has one `.git` and N working trees. Each worktree:
- Lives at its own path
- Has its own checked-out branch (can't share a branch across worktrees — git prevents it)
- Shares the object store and refs with the main repo

Effect: `git fetch` in one worktree updates remotes everywhere. `git stash` is per-worktree. Branches live globally.

## The protocol

### Phase 1 — Plan the worktree layout

```
LAYOUT
======
Primary repo:        /Users/<you>/code/myapp           (main branch)
Worktree: feature-A: /Users/<you>/code/myapp.feat-A    (branch: feat/auth-rewrite)
Worktree: review:    /Users/<you>/code/myapp.review    (branch: pr-1234)
Worktree: release:   /Users/<you>/code/myapp.release   (branch: release/v2.4)
```

Convention: append the purpose with a dot suffix to the same parent dir. Easier to ls.

### Phase 2 — Commands you actually run

```bash
# Add a worktree for a new branch off main
git worktree add ../myapp.feat-A -b feat/auth-rewrite main

# Add a worktree for an existing remote branch (e.g., reviewing someone's PR)
git fetch origin
git worktree add ../myapp.review origin/pr-1234

# Add a worktree for a release branch
git worktree add -b release/v2.4 ../myapp.release main

# List all worktrees
git worktree list

# Remove a worktree (after merging/abandoning the branch)
git worktree remove ../myapp.feat-A

# Prune stale worktree refs (after manual rm)
git worktree prune
```

### Phase 3 — Slicing the change

A "change slice" is the smallest reviewable unit that leaves the codebase green. For each worktree:

```
SLICE PLAN
==========
S1: <change> — reviewable size: ~<lines>, tests: ?, risk: low/med/high
S2: <change>
S3: <change>

DEPENDENCIES: S2 needs S1; S3 independent
```

One commit per slice. Slices ship as one PR or as a series.

### Phase 4 — Tests on every slice

Each slice ends with a green test run, captured:

```bash
npm test --silent 2>&1 | tail -20 > /tmp/test-S1.txt
echo "exit: $?" >> /tmp/test-S1.txt
```

Attach to the PR or include in the brief.

### Phase 5 — Changelog generation

Don't write changelogs by hand. Generate from commits, then edit:

```bash
# Since last tag
git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"- %s (%h)" --no-merges

# Since a specific date
git log --since="2026-04-01" --pretty=format:"- %s (%h)" --no-merges

# Grouped by Conventional Commit type (if you use them)
git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%s (%h)" | sort
```

Then prune duplicates, group by category, and add the "Why it matters" line per group.

### Phase 6 — Merge / release

```bash
# Confirm clean state
git status

# Confirm tests pass
npm test

# Tag the release
git tag -a v2.4.0 -m "Release v2.4.0 — <one-line summary>"
git push origin v2.4.0

# Merge release branch back to main (if you keep release branches)
git checkout main
git pull
git merge --no-ff release/v2.4
git push origin main
```

### Phase 7 — Rollback plan (BEFORE the release goes out)

Every release ships with a rollback note:

```
ROLLBACK
========
Backwards-compatible changes: yes / no
DB migrations in this release:
  - <migration> — reversible: yes (down migration exists) / no
Feature flags:
  - <flag> — default: off
Rollback procedure:
  1. <revert commands>
  2. <verify command>
ETA to rollback: <minutes>
Comms during rollback: <who tells whom>
```

If you can't write the rollback, you can't release.

## The deliverable shape

```
═══ RELEASE BRIEF ═══
Repo: <name>  From: <prev tag>  To: <new tag>  Date: <date>

WORKTREE LAYOUT:
<paths and branches in play>

CHANGE SLICES (and their PRs):
S1: <change> — PR #<n> — merged <date>
S2: <change> — PR #<n>
...

TESTS:
- Unit: <pass count> / <total>
- Integration: <pass count> / <total>
- E2E: <pass count> / <total>
- Coverage: <% on changed files>

CHANGELOG:
### Added
- <thing>
### Changed
- <thing>
### Fixed
- <thing>
### Breaking
- <thing — with migration note>

MIGRATIONS:
- <migration> — reversible: yes/no, run order: N

ROLLBACK:
<as above>

POST-DEPLOY VERIFICATION:
1. <check>
2. <check>

DEPLOY COMMANDS:
$ <command>

STATUS: ready | needs-fix | blocked
```

## Anti-patterns

- ❌ `git push --force` to a shared branch
- ❌ Rebasing a branch others are working on
- ❌ Squash-merge of a PR that includes commit-by-commit logical slices (loses history)
- ❌ Releasing without a tag (rollback nightmare)
- ❌ Releasing without a rollback plan
- ❌ Merging a PR with red CI ("I'll fix it after")
- ❌ Two worktrees on the same branch (git won't let you, but people try via `--force`)
- ❌ Working in `detached HEAD` state and committing
- ❌ `git pull` (use `git pull --rebase` or explicit `fetch + merge`)
- ❌ Long-running branches off non-main (3-way merge nightmare)

## Recovery cheats

```bash
# Lost a commit (recent)
git reflog
git checkout <sha>
git branch recovered-<topic> <sha>

# Reset to clean state without losing uncommitted work
git stash push -m "wip-$(date +%s)"
git reset --hard HEAD
git stash list  # work is in the stash

# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, throw away changes
git reset --hard HEAD~1

# Recover a deleted branch
git reflog
git branch <name> <sha>

# Find when a bug was introduced
git bisect start
git bisect bad
git bisect good <known-good-sha>
# git auto-checks out commits; mark each good/bad
git bisect reset
```

## Worktree + Claude Code pairing

If you're running this plugin inside Claude Code, worktrees are particularly powerful: each worktree can have its own God Mode session, its own routing log, its own roadmap. The CEO doesn't need to know the worktree exists — the file system isolation does the work.

Pattern:
```bash
git worktree add ../myapp.review-pr-1234 origin/pr-1234
cd ../myapp.review-pr-1234
# now run /god-mode "Review this PR for security issues"
# the session is isolated from your main worktree
```

## Routing

- **Haiku**: command generation, changelog formatting
- **Sonnet**: default — release brief, slicing, test verification
- **Opus**: rollback plan for high-stakes releases (money flows, schema changes)

## Verification protocol

The `verifier` (class: code) will:
1. Confirm tests passed on the release commit.
2. Confirm a tag was created.
3. Confirm changelog has entries for the version.
4. Confirm rollback plan exists and includes named commands.
5. For DB migrations, confirm a reversible down migration exists.

Fail if no rollback plan, no tests, or migrations without down scripts.
