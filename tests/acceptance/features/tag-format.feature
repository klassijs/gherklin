 Feature: Tag Format

   Scenario: Tag does not match format
     Given the following feature file
      """
 Feature: Foo
        @BadTag
   Scenario: Bar
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                              |
      | {"tag-format": ["error", "^@[a-z][a-z0-9-]*$"]} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule       | message                                                          |
      | {"line": 2, "column": 3} | error    | tag-format | Tag "@BadTag" does not match required format: ^@[a-z][a-z0-9-]*$ |

   Scenario: Tag matches format
     Given the following feature file
      """
 Feature: Foo
        @integration
   Scenario: Bar
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                              |
      | {"tag-format": ["error", "^@[a-z][a-z0-9-]*$"]} |
     Then there are 0 files with errors





