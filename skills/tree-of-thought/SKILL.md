---
name: tree-of-thought
description: Use ONLY for Opus-routed high-stakes decisions where the reverse-decision cost is high. Explores N parallel branches of reasoning, evaluates each on shared criteria, picks the winner with explicit rationale. Adds ~2× cost for ~2× decision quality on the tasks where it matters. Don't use for code, content, or routine analysis.
---

# Tree of Thought

Linear reasoning is the default for a reason: it's cheap and usually right. Branching is for the decisions where being wrong is more expensive than being slow.

## When to use

- Architecture decisions with long-tail consequences (DB choice, service split, auth model)
- Strategic product decisions (pricing model, market entry, MVP scope cut)
- Hard tradeoff analyses where the answer genuinely depends on weighting
- Reversibility-low calls where the user is unsure

## When NOT to use

- Code generation (just write the code)
- Content drafts (just write the draft)
- Routine analysis (Sonnet does this fine linearly)
- Anything where 3 branches would all converge on the same answer

The test: would you pay 2× the tokens to be 20% more confident? If no, don't branch.

## The protocol

### Step 1 — Frame the decision

```
DECISION: <one sentence>
CRITERIA (3-5, weighted):
  C1. <criterion> (weight: 0-1)
  C2. <criterion> (weight: 0-1)
  C3. <criterion> (weight: 0-1)
  C4. ...
HARD CONSTRAINTS (must hold for any branch):
  - <constraint>
REVERSE-DECISION COST: $<n> or <effort>
```

If you can't write the criteria, you can't tree-of-thought. Sharpen the decision first.

### Step 2 — Generate N branches (3-5)

For each branch:

```
BRANCH B<n>: <name>
PROPOSAL: <one paragraph>
KEY DESIGN CHOICES:
  - <choice>
  - <choice>
SCORES:
  C1: <0-10>  reasoning: <one sentence>
  C2: <0-10>  reasoning: <one sentence>
  C3: <0-10>  reasoning: <one sentence>
WEIGHTED TOTAL: <number>
FAILURE MODES OF THIS BRANCH:
  - <mode>
  - <mode>
EVIDENCE BASE:
  - <source / past decision / cited fact>
```

### Step 3 — Compare and pick

```
SCORE TABLE:
| Branch | C1 (w) | C2 (w) | C3 (w) | Total |
|--------|--------|--------|--------|-------|
| B1     | 8 (0.4)| 6 (0.3)| 7 (0.3)| 7.1   |
| B2     | 7 (0.4)| 8 (0.3)| 6 (0.3)| 7.0   |
| B3     | 5 (0.4)| 9 (0.3)| 8 (0.3)| 7.1   |

WINNER: B1
WHY THIS BRANCH WINS:
  - <reason>
WHY NOT B3 (the close second):
  - <reason>

CONFIDENCE: <high / medium / low>
WHAT WOULD FLIP THE DECISION:
  - <criterion weight change> → B3 wins
  - <new evidence> → B2 wins

SENSITIVITY ANALYSIS:
  - Most decision-sensitive criterion: <which one>
  - Robustness: branches are within <%> of each other → low-stakes (any could work) | high-stakes (this criterion matters)
```

### Step 4 — Decision artifact

Hand back to the CEO:

```
═══ TREE-OF-THOUGHT DECISION ═══

DECISION: <one sentence>
RATIONALE: <2-3 sentences pulling from winner's reasoning>

CHOSEN: <branch>
REJECTED: <other branches, with one-line reason each>

CONFIDENCE: <high/medium/low>
ASSUMPTIONS: <explicit list>
WHAT WOULD MAKE THIS WRONG: <falsifiability>
REVISIT WHEN: <trigger event>

NEXT TASK: <handoff to Sonnet/Haiku for implementation>
```

## Anti-patterns

- ❌ 2 branches (not enough exploration to be worth the cost)
- ❌ > 5 branches (analysis paralysis, plus weight noise dominates signal)
- ❌ Branches that aren't genuinely different (re-wordings of one approach)
- ❌ Scoring without explicit reasoning per score
- ❌ Equal weights on all criteria (says you haven't actually thought about what matters)
- ❌ No sensitivity analysis (you don't know if the decision is robust)
- ❌ "All branches are roughly equal" winner reasoning — pick one, name what would flip it

## Worked example

Decision: "Which DB should we use for our 5-tenant multi-tenant CRM at year 1, scaling to 5K tenants by year 3?"

Criteria:
- C1 (0.35): cost at 5K tenants
- C2 (0.30): operational simplicity for 2-person team
- C3 (0.20): RLS / multi-tenancy primitives built-in
- C4 (0.15): vendor lock-in risk

Branches:
- B1: Postgres + RLS on Supabase
- B2: Postgres self-hosted + RLS
- B3: PlanetScale + app-layer tenancy
- B4: DynamoDB single-table

Each gets scored on the four criteria, winner emerges, sensitivity analysis shows "if op-simplicity weight drops below 0.2, B2 becomes competitive."

Decision lands. CEO writes B1 into the belief register. Sonnet implements.

## Routing

- **Opus default** — the whole point is high-stakes reasoning
- This skill never routes to Sonnet (Sonnet does the implementation after the decision)

## Verification

The verifier (class: strategy) will:
1. Confirm criteria with explicit weights are present.
2. Confirm N branches with per-criterion scoring + reasoning.
3. Confirm the chosen branch is justified vs the close second specifically.
4. Confirm a sensitivity analysis section exists.
5. Confirm falsifiability ("what would make this wrong") is stated.

Fail if any branch lacks evidence base, or if scoring has no reasoning per score.
