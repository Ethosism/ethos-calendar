# Release Checklist

Use this checklist before treating a calendar version as production ready.

## Production Ready Gate

1. Run validation.

   ```bash
   npm run validate
   ```

2. Confirm the source spec is current.

   - `spec/calendar.yaml` reflects the intended calendar.
   - `spec/calendar.schema.json` still describes the accepted source shape.
   - All `source_docs` targets exist.

3. Confirm public docs are coherent.

   - [daily-weekly-rule.md](daily-weekly-rule.md)
   - [annual-observance-calendar.md](annual-observance-calendar.md)
   - [year-cycle.md](year-cycle.md)
   - [life-rites.md](life-rites.md)
   - [governance.md](governance.md)
   - [adoption-guide.md](adoption-guide.md)

4. Confirm boundaries are visible.

   - no forced confession
   - no hierarchy of spiritual authority
   - no surveillance
   - no replacement of medical, legal, therapeutic, or emergency processes
   - no Ethra fluency requirement

5. Confirm the working tree is clean.

   ```bash
   git status --short --branch
   ```

6. Commit and push.

   ```bash
   git push
   ```

7. Confirm GitHub Actions passes on `main`.

## Release Notes

Every release should identify:

- calendar version
- commit hash
- major source changes
- practice changes
- governance changes
- known risks or experimental areas

## Versioning

Use semantic versions for the calendar source:

- Major: changes to authority, recurrence structure, or accepted life rites.
- Minor: new observances, docs, adoption paths, or validated source fields.
- Patch: wording, clarification, validation, metadata, or link fixes.
