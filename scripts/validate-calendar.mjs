import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";
import YAML from "yaml";

const root = process.cwd();
const errors = [];

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function fail(message) {
  errors.push(message);
}

function uniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item?.id) {
      fail(`${label} item is missing id`);
      continue;
    }
    if (seen.has(item.id)) {
      fail(`${label} has duplicate id: ${item.id}`);
    }
    seen.add(item.id);
  }
}

function requireDocContains(relativePath, needles) {
  if (!exists(relativePath)) {
    fail(`Missing doc: ${relativePath}`);
    return;
  }
  const text = readText(relativePath).toLowerCase();
  for (const needle of needles) {
    if (!text.includes(needle.toLowerCase())) {
      fail(`${relativePath} does not mention "${needle}"`);
    }
  }
}

function markdownFiles(dir = root) {
  const output = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...markdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      output.push(path.relative(root, fullPath));
    }
  }
  return output;
}

function validateMarkdownLinks() {
  const localLinkPattern = /\[[^\]]+\]\((?!https?:\/\/|mailto:|#)([^)]+)\)/g;
  for (const file of markdownFiles()) {
    const text = readText(file);
    for (const match of text.matchAll(localLinkPattern)) {
      const rawTarget = match[1].split("#")[0].trim();
      if (!rawTarget) continue;
      const decodedTarget = decodeURIComponent(rawTarget);
      const target = path.normalize(path.join(path.dirname(file), decodedTarget));
      if (!exists(target)) {
        fail(`${file} links to missing local target: ${rawTarget}`);
      }
    }
  }
}

function validateCalendar() {
  const calendar = YAML.parse(readText("spec/calendar.yaml"));
  const annual = YAML.parse(readText("spec/annual-observances.yaml"));
  const schema = JSON.parse(readText("spec/calendar.schema.json"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  if (!validate(calendar)) {
    for (const error of validate.errors ?? []) {
      fail(`schema ${error.instancePath || "/"} ${error.message}`);
    }
  }

  for (const doc of Object.values(calendar.source_docs ?? {})) {
    if (!exists(doc)) {
      fail(`source_docs target missing: ${doc}`);
    }
  }

  uniqueIds(calendar.daily_rule?.practices ?? [], "daily_rule.practices");
  uniqueIds(calendar.weekly_rule?.days ?? [], "weekly_rule.days");
  uniqueIds(calendar.monthly_observances ?? [], "monthly_observances");
  uniqueIds(calendar.seasonal_cycle ?? [], "seasonal_cycle");
  uniqueIds(calendar.annual_days ?? [], "annual_days");
  uniqueIds(calendar.life_rites ?? [], "life_rites");

  const weeklyIds = (calendar.weekly_rule?.days ?? []).map((day) => day.id);
  const expectedWeekly = ["attention", "duty", "repair", "stewardship", "service", "learning", "review"];
  for (const expected of expectedWeekly) {
    if (!weeklyIds.includes(expected)) {
      fail(`weekly_rule.days is missing ${expected}`);
    }
  }

  requireDocContains("docs/daily-weekly-rule.md", [
    "Attention",
    "Duty",
    "Repair",
    "Stewardship",
    "Service",
    "Learning",
    "Review",
    "forced confession"
  ]);
  requireDocContains("docs/annual-observance-calendar.md", [
    "Day of First Truth",
    "Day of Vows",
    "Festival of First Truth",
    "Commons Festival",
    "Festival of Future Generations",
    "Day of Remembrance",
    "Long Night of Review",
    "First Sunday",
    "No observance may require public confession"
  ]);
  requireDocContains("docs/year-cycle.md", [
    "Truth Audit",
    "Household Review",
    "Stewardship Review",
    "Repair Day",
    "Day of Future Generations"
  ]);
  requireDocContains("docs/life-rites.md", [
    "Naming",
    "Coming Of Age",
    "Vocation",
    "Marriage",
    "Reconciliation",
    "Death Remembrance"
  ]);
  requireDocContains("docs/governance.md", [
    "coercion",
    "professional",
    "surveillance",
    "Ethra fluency",
    "Review Method"
  ]);
  requireDocContains("docs/adoption-guide.md", [
    "individual",
    "household",
    "group",
    "privacy",
    "stop conditions"
  ]);
  requireDocContains("docs/release-checklist.md", [
    "npm run validate",
    "production ready",
    "release"
  ]);

  const boundaryText = [
    ...(calendar.non_goals ?? []),
    ...(calendar.quality_gates ?? []),
    ...(annual.boundaries ?? []),
    readText("docs/governance.md")
  ].join("\n").toLowerCase();
  for (const boundary of ["confession", "coercion", "medical", "legal", "surveillance", "ethra fluency"]) {
    if (!boundaryText.includes(boundary)) {
      fail(`boundary text is missing "${boundary}"`);
    }
  }

  validateMarkdownLinks();

  uniqueIds(annual.seasons ?? [], "annual.seasons");
  uniqueIds(annual.high_observances ?? [], "annual.high_observances");
  uniqueIds(annual.festivals ?? [], "annual.festivals");
  uniqueIds(annual.monthly_observances ?? [], "annual.monthly_observances");
  for (const required of ["day-first-truth", "day-vows", "day-remembrance", "long-night-review", "closing-record"]) {
    if (!(annual.high_observances ?? []).some((item) => item.id === required)) {
      fail(`annual.high_observances is missing ${required}`);
    }
  }
  for (const required of [
    "festival-first-truth",
    "vow-week",
    "festival-formation",
    "commons-festival",
    "festival-mercy-repair",
    "festival-measure",
    "remembrance-tide",
    "festival-future-generations",
    "long-night",
    "closing-of-record"
  ]) {
    if (!(annual.festivals ?? []).some((item) => item.id === required)) {
      fail(`annual.festivals is missing ${required}`);
    }
  }
  for (const festival of annual.festivals ?? []) {
    for (const field of ["name", "date_rule", "tone", "theme", "gathering", "children", "public_act"]) {
      if (!festival[field]) {
        fail(`annual.festivals.${festival.id} is missing ${field}`);
      }
    }
    for (const field of ["customs", "foods", "symbols"]) {
      if (!Array.isArray(festival[field]) || festival[field].length === 0) {
        fail(`annual.festivals.${festival.id} needs ${field}`);
      }
    }
  }
}

validateCalendar();

if (errors.length > 0) {
  console.error(`Ethos Calendar validation failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Ethos Calendar validation passed.");
