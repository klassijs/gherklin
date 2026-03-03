# Custom rules

This folder holds rules that are not built into Gherklin.

## feature-name-length

Enforces a maximum length for the **Feature name/title** (the text after `Feature: `).  
Gherklin has no built-in rule for this (only `feature-description` for the description block and `scenario-name-length` for scenario titles).

**Config:** Same as `scenario-name-length`: a number (max length) or `['error', 80]`. Default max is 100.

**Enable:** Point `customRulesDirectory` at this folder and add the rule to your config, for example in `gherklin.config.yaml`:

```yaml
customRulesDirectory: './src/custom-rules'
rules:
  feature-name-length: 80
  # or with severity:
  # feature-name-length: ['warn', 80]
```
