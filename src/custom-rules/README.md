# Custom rules

This folder is for rules that are not part of the built-in set.

**Feature name length:** The rule that enforced a maximum length for the Feature name/title is now **built-in** as `feature-name-length`. Add it in your config under `rules` (no `customRulesDirectory` needed). See the [Rules README](../rules/README.md#feature-name-length).

To add your own custom rule, implement a class that matches the [Rule](../rule.ts) interface and put it here, then set `customRulesDirectory: './src/custom-rules'` in your config.
