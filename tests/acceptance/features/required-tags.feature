 Feature: Required Tags

   Scenario: Fails by design - scenario without required tag
     Given the following feature file
      """
 Feature: Foo
   Scenario: Bar
     Given a
      """
     When Gherklin is ran with the following configuration
      | rules                              |
      | {"required-tags": ["@smoke"]}     |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule           | message                                                       |
      | {"line": 2, "column": 3} | warn     | required-tags  | Scenario must have at least one of the required tags: @smoke. |

   Scenario: Passes by design - scenario with required tag
     Given the following feature file
      """
 Feature: Foo
        @smoke
   Scenario: Bar
     Given a
      """
     When Gherklin is ran with the following configuration
      | rules                              |
      | {"required-tags": ["@smoke"]}     |
     Then there are 0 files with errors


















