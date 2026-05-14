---
name: skill-creator
description: Use to create new Claude skills with SKILL.md, activation criteria, workflow, output format, routing, and optional scripts/references.
---

# Skill Creator

## Workflow
1. Name the capability and trigger.
2. Write YAML frontmatter with name and description.
3. Add workflow, output contract, rules, routing, and examples.
4. Keep the skill narrow enough to load only when relevant.

## Output
```
SKILL NAME:
DESCRIPTION:
SKILL.md:
INSTALL NOTES:
EVAL CASES:
```

## Rules
- One skill = one recurring workflow.
- Keep descriptions specific so progressive loading works well.
