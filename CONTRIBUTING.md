# Contributing

The Ethos Calendar is the recurrence layer of Ethosism. Contributions should strengthen truthful practice, not add decorative ritual.

## Before Proposing A Change

Ask:

1. What concrete use case does this address?
2. What failure mode does it reduce?
3. What does the practice ask someone to do?
4. What visible conduct, repair, stewardship, or memory should result?
5. What misuse should be prevented?
6. How does this remain subordinate to the Ethos canon?

## Change Types

- Spec changes: edit `spec/calendar.yaml` and update `spec/calendar.schema.json` when the source shape changes.
- Practice docs: edit the relevant file in `docs/`.
- Governance changes: edit `docs/governance.md` and explain the authority or boundary issue.
- Validation changes: edit `scripts/validate-calendar.mjs` and keep CI passing.

## Validation

Run:

```bash
npm install
npm run validate
```

Do not merge changes that weaken the boundaries around coercion, confession, surveillance, professional-process replacement, or Ethra fluency.
