# Ethos Calendar

[![Validate Calendar](https://github.com/Ethosism/ethos-calendar/actions/workflows/validate.yml/badge.svg)](https://github.com/Ethosism/ethos-calendar/actions/workflows/validate.yml)

The Ethos Calendar is the time layer of Ethosism.

Ethos gives the creed: what is true, good, owed, repairable, and worth carrying forward.
Ethra gives the language: what can be named clearly enough to notice and preserve.
The calendar gives recurrence: what the community and the individual return to until it forms conduct.

This repository defines a secular, theology-compatible rule of time for Ethosism: daily, weekly, monthly, seasonal, annual, and life-stage practices organized around attention, duty, repair, stewardship, service, learning, remembrance, and future responsibility.

## Purpose

The calendar exists to make Ethos visible in ordinary life before crisis forces moral attention.

It should help a person or group ask:

- What must be noticed today?
- What duty is real this week?
- What harm needs repair this month?
- What must be remembered this season?
- What should be handed forward this year?
- What rite marks this life transition truthfully?

## Core Principle

Formation follows recurrence.

A creed without recurrence becomes opinion. A language without recurrence becomes artifact. A calendar creates repeated contact between belief, speech, action, memory, and consequence.

## Repository Structure

```text
package.json              validation entrypoint
scripts/
  validate-calendar.mjs   local and CI validation
spec/
  calendar.yaml        machine-readable calendar structure
  calendar.schema.json JSON Schema for the calendar source
docs/
  adoption-guide.md    individual, household, and group use
  daily-weekly-rule.md daily and weekly rhythm
  year-cycle.md        monthly, seasonal, and annual cycle
  life-rites.md        rites for life transitions
  governance.md        change rules for calendar practices
  release-checklist.md production and release gate
```

## Validation

Run the repository gate before changing public calendar material:

```bash
npm install
npm run validate
```

The validator checks the YAML source against the JSON Schema, enforces unique IDs, verifies that required docs exist, checks local Markdown links, and confirms that core boundaries remain present.

## First Version

This first version is a conceptual seed, not a finished ritual system. It establishes:

- a daily rule
- a weekly rule
- monthly observances
- seasonal themes
- annual days
- life rites
- governance constraints

The next development step is to test these rhythms against existing Ethos practice material and create beginner-ready session formats.

## Production Gate

The calendar is production ready when:

- the source spec validates
- all core docs are present
- local links resolve
- governance boundaries remain visible
- CI passes on `main`
- changes are committed and pushed

## Relationship To Ethos And Ethra

The calendar is subordinate to the Ethos canon and should not invent doctrine that contradicts it.

Ethra may name recurring practices compactly, but Ethra fluency must never be required for participation. The calendar should use Ethra as a clarifying hinge, not as a barrier.

## License

No public reuse license has been granted in this repository yet. Until a `LICENSE` file is added, all rights are reserved by the repository owner.
