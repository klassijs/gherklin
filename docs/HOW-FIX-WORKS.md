# How `--fix` is implemented

## Overview

When you run Gherklin with **`fix: true`** in config (or equivalent), the runner **applies fixes before running rules** on each file. Only rules that implement a `fix` method can change the file; others just run as usual.

## Flow

1. **Config**  
   `fix` is read from your config and stored on `Config` (and in `GherklinConfiguration.fix`).

2. **Runner → RuleLoader**  
   For each feature file, the runner loads the document, then calls `ruleLoader.runRules(document)`.

3. **RuleLoader.runRules()** (in `src/rule_loader.ts`)  
   For each rule and each document:

   ```ts
   // 1. Fix first (if global fix is on and this rule has a fix)
   if (this.config.fix === true && rule.fix !== undefined) {
       await rule.fix(document)
   }
   // 2. Then run the rule (so run() can see the fixed content)
   await rule.run(document)
   ```

   So: **fix runs once per rule per file, then `run()` runs.** That way the linter sees the file after the fix.

4. **Rule interface** (`src/rule.ts`)  
   Fix is optional:

   ```ts
   public abstract run(document: Document): Promise<void>
   public abstract fix?(document: Document): Promise<void>
   ```

   If a rule doesn’t define `fix`, it’s simply not called when `fix: true`; only `run()` runs.

## How to implement a fix in a rule

### 1. Mutate `document.lines`

The file is represented as **`document.lines`**: an array of **`Line`** objects. Each `Line` has:

- **`indentation`** – number of leading spaces
- **`keyword`** – e.g. `'Given '`, `'When '`, `''` for non-step lines
- **`text`** – rest of the line (after the keyword)

So a line like `    When I do something` is one `Line`: `indentation: 4`, `keyword: 'When '`, `text: 'I do something'`.

Your `fix` should change `document.lines` in place (replace lines or edit `line.keyword` / `line.text`).

### 2. Call `document.regenerate()`

After mutating `document.lines`, you **must** call:

```ts
await document.regenerate()
```

`regenerate()`:

- Writes the file to disk from `document.lines` (using `indentation`, `keyword`, `text` per line).
- Re-parses the file into the Gherkin AST (`document.feature`, etc.) so later rules and `run()` see the updated content.

So the pattern is: **mutate `document.lines` → `await document.regenerate()`**.

### 3. Examples

**no-trailing-spaces** – trim end of each line, then regenerate:

```ts
public async fix(document: Document): Promise<void> {
  document.lines.forEach((line: Line, index: number) => {
    const joined = `${line.keyword}${line.text.trimEnd()}`
    document.lines[index] = new Line(joined)
  })
  await document.regenerate()
}
```

**no-full-stop** – remove trailing full stop from `line.text`:

```ts
public async fix(document: Document): Promise<void> {
  document.lines.forEach((line: Line, index: number) => {
    const trimmed = line.text.trimEnd()
    if (trimmed[trimmed.length - 1] === '.') {
      document.lines[index].text = trimmed.substring(0, trimmed.length - 1)
    }
  })
  await document.regenerate()
}
```

**new-line-at-eof** – add one blank line at the end:

```ts
public async fix(document: Document): Promise<void> {
  document.lines.push(new Line(''))
  await document.regenerate()
}
```

## Important details

- **Line constructor**  
  `new Line(fullLineString)` parses one physical line (e.g. `"    Given foo"`) into `indentation`, `keyword`, and `text`. Use it when you want to replace a whole line.

- **Order of execution**  
  Fixes are applied **rule by rule**, then **run()** for that rule. So if rule A and rule B both have `fix`, the order is: A.fix → A.run → B.fix → B.run. The next rule always sees the result of the previous rule’s fix.

- **No `fix`**  
  If your rule doesn’t implement `fix`, nothing special happens; it only runs `run()` when the rule is enabled. The README “Fixable” column is just documentation.

## Adding fix to a new or existing rule

1. Add an optional method to your rule class:

   ```ts
   public async fix(document: Document): Promise<void> {
     // 1. Mutate document.lines (edit or replace Line objects)
     // 2. Must call:
     await document.regenerate()
   }
   ```

2. Ensure the rule is still enabled when `fix: true` (it’s the same config; you’re just adding a `fix` implementation).

3. Optionally add an acceptance scenario that runs with `fix: true` and asserts the file content or 0 errors (see e.g. `no-full-stop.feature` “Auto fix” scenario).

That’s the full picture of how `--fix` is implemented and how to add to what can be fixed.
