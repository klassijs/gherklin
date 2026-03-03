# Rules

Rules can either be specified in your `gherklin.config.ts` file, or inline when you call
the [Runner](../../README.md#api)

Rule configuration takes the form of a `string` key and a value. Every rule supports `off` as a
value,
turning the rule off (which is the same as excluding it from the configuration).

However, depending on the rule, there may be more configuration values.

If a rule does not specify a severity, it will default to `warn`.

The following is a list of rules and whether or not they are fixable with the `fix` configuration
option.

| Name                                                    | Rule                        | Fixable |
|---------------------------------------------------------|-----------------------------|:-------:|
| [Aligned Datatables](#aligned-datatables)               | `aligned-datatables`        |    ❌    | 
| [Allowed Tags](#allowed-tags)                           | `allowed-tags`              |    ❌    | 
| [Disallowed Tags](#disallowed-tags)                     | `disallowed-tags`           |    ❌    | 
| [Indentation](#indentation)                             | `indentation`               |    ✅    |
| [Max Scenarios](#max-scenarios)                         | `max-scenarios`             |    ❌    |
| [New Line at EOF](#new-line-at-eof)                     | `new-line-at-eof`           |    ✅    |
| [No Background Only](#no-background-only)               | `no-background-only`        |    ❌    |
| [No Dupe Features](#no-dupe-features)                   | `no-dupe-features`          |    ❌    |
| [No Dupe Scenarios](#no-dupe-scenarios)                 | `no-dupe-scenarios`         |    ❌    |
| [No Similar Scenarios](#no-similar-scenarios)           | `no-similar-scenarios`      |    ❌    |
| [No Empty File](#no-empty-file)                         | `no-empty-file`             |    ❌    |
| [No Trailing Spaces](#no-trailing-spaces)               | `no-trailing-spaces`        |    ✅    |
| [No Unnamed Scenarios](#no-unnamed-scenarios)           | `no-unnamed-scenarios`      |    ❌    |
| [Keywords in Logical Order](#keywords-in-logical-order) | `keywords-in-logical-order` |    ❌    |
| [No Single Example Outline](#no-single-example-outline) | `no-single-example-outline` |    ❌    |
| [No Full Stop](#no-full-stop)                           | `no-full-stop`              |    ✅    |
| [No Scenario Splat](#no-scenario-splat)                 | `no-scenario-splat`         |    ❌    |
| [No Typographer Quotes](#no-typographer-quotes)         | `no-typographer-quotes`     |    ✅    |
| [Background Setup Only](#background-setup-only)         | `background-setup-only`     |    ❌    |
| [Given After Background](#given-after-background)       | `given-after-background`    |    ❌    |
| [No Inconsistent Quotes](#no-inconsistent-quotes)       | `no-inconsistent-quotes`    |    ✅    |
| [Filename Snake Case](#filename-snake-case)             | `filename-snake-case`       |    ❌    |
| [Filename Kebab Case](#filename-kebab-case)             | `filename-kebab-case`       |    ❌    |
| [Filename Camel Case](#filename-camel-case)             | `filename-camel-case`       |    ❌    |
| [Unique Examples](#unique-examples)                     | `unique-examples`           |    ❌    |
| [Feature Description](#feature-description)             | `feature-description`       |    ❌    |
| [Scenario Action](#scenario-action)                     | `scenario-action`           |    ❌    |
| [Scenario Verification](#scenario-verification)         | `scenario-verification`     |    ❌    |
| [Scenario Name Length](#scenario-name-length)           | `scenario-name-length`      |    ❌    |
| [Steps Length](#steps-length)                           | `steps-length`             |    ❌    |
| [No Consecutive Empty Lines](#no-consecutive-empty-lines) | `no-consecutive-empty-lines` |    ✅    |
| [Scenario Outline Has Examples](#scenario-outline-has-examples) | `scenario-outline-has-examples` |    ❌    |
| [Required Tags](#required-tags)                         | `required-tags`            |    ❌    |
| [No Duplicate Steps](#no-duplicate-steps)               | `no-duplicate-steps`        |    ❌    |
| [Scenario Description](#scenario-description)           | `scenario-description`     |    ❌    |
| [Outline Placeholder Consistency](#outline-placeholder-consistency) | `outline-placeholder-consistency` |    ❌    |
| [Max Steps Per Scenario](#max-steps-per-scenario)       | `max-steps-per-scenario`   |    ❌    |
| [No Empty Scenario](#no-empty-scenario)                 | `no-empty-scenario`        |    ❌    |
| [No Punctuation in Titles](#no-punctuation-in-titles)   | `no-punctuation-in-titles`|    ❌    |
| [Tag Format](#tag-format)                               | `tag-format`               |    ❌    |
| [Max Background Steps](#max-background-steps)           | `max-background-steps`     |    ❌    |
| [No And But First](#no-and-but-first)                   | `no-and-but-first`         |    ❌    |
| [One Feature Per File](#one-feature-per-file)           | `one-feature-per-file`     |    ❌    |

### Aligned Datatables

Enforces that pipes used in data tables are aligned correctly.

**Examples**

Enable the rule and set severity

```typescript
export default {
  rules: {
    'aligned-datatables': 'error',
  }
}
```

<hr>

### Allowed Tags

Restrict which tags are allowed in feature files by specifying a list. This rule
checks for valid tags at the feature level and scenario level.

**Examples**

Enable the rule with arguments

```typescript
export default {
  rules: {
    'allowed-tags': ['@development'],
  },
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'allowed-tags': ['error', '@development'],
  }
}
```

<hr>

### Disallowed Tags

Restrict which tags are **not allowed** in feature files by specifying a list. This rule
checks for invalid tags at both the feature level and the scenario level.

**Examples**

Enable the rule with arguments

```typescript
export default {
  rules: {
    'disallowed-tags': ['@development'],
  },
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'disallowed-tags': ['error', '@development'],
  },
}
```

<hr>

### Indentation

Configure how many spaces are allowed for different Gherkin keywords.

**Examples**

Enable the rule with arguments

```typescript
export default {
  rules: {
    indentation: {
      feature: 1,
      background: 3,
      scenario: 3,
      step: 5,
      examples: 5,
      given: 5,
      when: 5,
      then: 5,
      and: 5,
      but: 5,
      exampleTableHeader: 7,
      exampleTableBody: 7,
      dataTable: 7,
      featureTag: 1,
      scenarioTag: 3,
    }
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    indentation: [
      'error',
      {
        feature: 1,
        background: 3,
        scenario: 3,
        step: 5,
        examples: 5,
        given: 5,
        when: 5,
        then: 5,
        and: 5,
        but: 5,
        exampleTableHeader: 7,
        exampleTableBody: 7,
      }
    ]
  }
}
```

<hr>

### Max Scenarios

Specify the maximum number of scenarios allowed per feature.

**Examples**

Enable the rule with arguments

```typescript
export default {
  rules: {
    'max-scenarios': 2,
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'max-scenarios': [
      'error',
      2,
    ]
  }
}
```

<hr>

### New Line at EOF

Expect a new line at the end of each file.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'new-line-at-eof': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'new-line-at-eof': 'error',
  }
}
```

<hr>

### No Background Only

Don't allow features which only have a background.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-background-only': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-background-only': 'error',
  }
}
```

<hr>

### No Dupe Features

Don't allow features to have the same name across all files.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-dupe-features': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-dupe-features': 'error',
  }
}
```

<hr>

### No Dupe Scenarios

Don't allow scenarios to have the same name across all files.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-dupe-scenarios': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-dupe-scenarios': 'error',
  }
}
```

<hr>

### No Empty File

Don't allow feature files to be empty.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-empty-file': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-empty-file': 'error',
  }
}
```

<hr>

### No Trailing Spaces

Don't allow trailing spaces at the end of lines.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-trailing-spaces': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-trailing-spaces': 'error',
  }
}
```

<hr>

### No Unnamed Scenarios

Expect every scenario to be named.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-unnamed-scenarios': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-unnamed-scenarios': 'error',
  }
}
```

### Keywords in Logical Order

Asserts that keywords follow the logical order or Given, When, Then.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'keywords-in-logical-order': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'keywords-in-logical-order': 'error',
  }
}
```

### No Similar Scenarios

Compares each scenario with each other scenario to see if they are similar.
Compares the Levenshtein distance between one scenarios keyword + text with the other scenarios
keyword + text.
The argument passed to this rule's configuration is the percentage threshold for similarity.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-similar-scenarios': 'on',
  }
}
```

Enable the rule with arguments

```typescript
export default {
  rules: {
    'no-similar-scenarios': 85,
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-similar-scenarios': 'error',
  }
}
```

Set severity and arguments

```typescript
export default {
  rules: {
    'no-similar-scenarios': ['error', 99],
  }
}
```

### No Single Example Outline

Checks Scenario Outlines that only have one example. These should be converted to simple Scenarios.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-single-example-outline': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-single-example-outline': 'error',
  }
}
```

### No Full Stop

Full stops (period) end sentences and don't convey a flow of steps.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-full-stops': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-full-stops': 'error',
  }
}
```

### No Scenario Splat

Splat steps (*) are useful for setup, which should occur in the background

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-scenario-splat': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-scenario-splat': 'error',
  }
}
```

### No Typographer Quotes

"Smart quotes" can be a result of copy/pasting from other programs and may not be intended.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-typographer-quotes': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-typographer-quotes': 'error',
  }
}
```

Enable the rule and set argument.

*The argument is used as a replacement when the `fix` option is specified.*

```typescript
export default {
  rules: {
    'no-typographer-quotes': ['error', "\""],
  }
}
```

### Background Setup Only

Background should be used for set up only, so should only include "Given" or splats (*).

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'background-setup-only': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'background-setup-only': 'error',
  }
}
```

### Given After Background

If you have a background, it should be used to set up scenarios, so there's no need for scenarios to
also use "Given"

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'given-after-background': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'given-after-background': 'error',
  }
}
```

### No Inconsistent Quotes

Prefer consistency with quotes used.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-inconsistent-quotes': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-inconsistent-quotes': 'error',
  }
}
```

Enable the rule and set argument.

*The argument is used as a replacement when the `fix` option is specified.*

```typescript
export default {
  rules: {
    'no-inconsistent-quotes': ['error', "\""],
  }
}
```

### Filename Snake Case

File names should be in snake_case.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'filename-snake-case': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'filename-snake-case': 'error',
  }
}
```

### Filename Kebab Case

File names should be in kebab-case.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'filename-kebab-case': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'filename-kebab-case': 'error',
  }
}
```

### Filename Camel Case

File names should be in camelCase (e.g. `myFeature.feature`, first letter lower, no separators).

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'filename-camel-case': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'filename-camel-case': 'error',
  }
}
```

### Unique Examples

Examples should have a unique name if there are more than 1 in a scenario outline.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'unique-examples': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'unique-examples': 'error',
  }
}
```

### Feature Description

Features should have descriptions to outline what behaviour they are testing. The description must be at least a minimum length (default 40 characters). Minimum length is configurable via the schema.

**Examples**

Enable the rule (default min 40 characters)

```typescript
export default {
  rules: {
    'feature-description': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'feature-description': 'error',
  }
}
```

Set minimum description length (default severity)

```typescript
export default {
  rules: {
    'feature-description': 80,
  }
}
```

Set severity and minimum length

```typescript
export default {
  rules: {
    'feature-description': ['error', 60],
  }
}
```

### Scenario Action

Scenarios should have a "When" to denote an action

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'scenario-action': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'scenario-action': 'error',
  }
}
```

### Scenario Verification

Scenarios should have a "Then" to denote verification of an action

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'scenario-verification': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'scenario-verification': 'error',
  }
}
```

### Scenario Name Length

Scenarios should have a length no longer than specified.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'scenario-name-length': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'scenario-name-length': 'error',
  }
}
```

Enable the rule and set args

```typescript
export default {
  rules: {
    'scenario-name-length': ['error', 99],
  }
}
```

### Steps Length

Step text (the part after Given/When/Then/And/But) should not exceed a maximum length. Applies to background steps and scenario steps. Default max is 80 characters.

**Examples**

Enable the rule (default max 80)

```typescript
export default {
  rules: {
    'steps-length': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'steps-length': 'error',
  }
}
```

Enable the rule with custom max length

```typescript
export default {
  rules: {
    'steps-length': 120,
  }
}
```

Enable the rule with severity and max length

```typescript
export default {
  rules: {
    'steps-length': ['error', 100],
  }
}
```

### No Consecutive Empty Lines

At most one blank line in a row. Consecutive empty lines are reported and can be fixed automatically.

**Examples**

```typescript
export default {
  rules: {
    'no-consecutive-empty-lines': 'on',
  }
}
```

```typescript
export default {
  rules: {
    'no-consecutive-empty-lines': 'error',
  }
}
```

### Scenario Outline Has Examples

Every Scenario Outline must have at least one Examples block.

**Examples**

```typescript
export default {
  rules: {
    'scenario-outline-has-examples': 'on',
  }
}
```

```typescript
export default {
  rules: {
    'scenario-outline-has-examples': 'error',
  }
}
```

### Required Tags

Every scenario must have at least one of the specified tags (e.g. for filtering or layering).

**Examples**

```typescript
export default {
  rules: {
    'required-tags': ['@layer:unit', '@layer:integration'],
  }
}
```

```typescript
export default {
  rules: {
    'required-tags': ['error', ['@smoke', '@regression']],
  }
}
```

### No Duplicate Steps

The same step (keyword + text) must not appear more than once in a single scenario (or background).

**Examples**

```typescript
export default {
  rules: {
    'no-duplicate-steps': 'on',
  }
}
```

```typescript
export default {
  rules: {
    'no-duplicate-steps': 'error',
  }
}
```

### Scenario Description

Scenarios must have a description of at least a minimum length (default 40 characters). Schema: same as feature-description (`on`/`error`/number/`[severity, number]`).

**Examples**

```typescript
export default {
  rules: {
    'scenario-description': 'on',
  }
}
```

```typescript
export default {
  rules: {
    'scenario-description': ['error', 60],
  }
}
```

<hr>

### Outline Placeholder Consistency

For Scenario Outlines, every `<placeholder>` in step text must appear in an Examples header, and every Examples header column must be used in at least one step.

**Examples**

```typescript
export default {
  rules: {
    'outline-placeholder-consistency': 'on',
  }
}
```

<hr>

### Max Steps Per Scenario

Limit the number of steps allowed per scenario. Config: number (e.g. `10` or `['error', 10]`).

**Examples**

```typescript
export default {
  rules: {
    'max-steps-per-scenario': 10,
  }
}
```

<hr>

### No Empty Scenario

Scenarios must have at least one step.

**Examples**

```typescript
export default {
  rules: {
    'no-empty-scenario': 'on',
  }
}
```

<hr>

### No Punctuation in Titles

Feature and scenario titles must not end with `.`, `!`, or `?`.

**Examples**

```typescript
export default {
  rules: {
    'no-punctuation-in-titles': 'on',
  }
}
```

<hr>

### Tag Format

Tags (feature and scenario) must match a regex pattern. Config: `'on'`/`'error'` or `['error', '^@[a-z-]+$']`.

**Examples**

```typescript
export default {
  rules: {
    'tag-format': ['error', '^@[a-z][a-z0-9-]*$'],
  }
}
```

<hr>

### Max Background Steps

Limit the number of steps allowed in a Background. Config: number (e.g. `3` or `['warn', 5]`).

**Examples**

```typescript
export default {
  rules: {
    'max-background-steps': 5,
  }
}
```

<hr>

### No And But First

The first step in a Background or Scenario must be Given, When, or Then—not And or But.

**Examples**

```typescript
export default {
  rules: {
    'no-and-but-first': 'on',
  }
}
```

<hr>

### One Feature Per File

A file must contain at most one `Feature:` declaration. (Note: Gherkin syntax allows only one Feature per file, so the parser will fail on a second `Feature:` before rules run. This rule still runs on valid files and would flag multiple Feature lines if the document were built from raw lines.)

**Examples**

```typescript
export default {
  rules: {
    'one-feature-per-file': 'on',
  }
}
```
