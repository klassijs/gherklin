 Feature: No Empty Scenario

   Scenario: Empty scenario fails
     Given the following feature file
      """
 Feature: Foo
   Scenario: No steps
      """
     When Gherklin is ran with the following configuration
      | rules                   |
      | {"no-empty-scenario": "on"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule              | message                            |
      | {"line": 2, "column": 3} | warn     | no-empty-scenario | Scenario must have at least one step. |

   Scenario: Scenario with steps passes
     Given the following feature file
      """
 Feature: Foo
   Scenario: Has steps
     Given I do something
     When it happens
     Then I see result
      """
     When Gherklin is ran with the following configuration
      | rules                   |
      | {"no-empty-scenario": "on"} |
     Then there are 0 files with errors
















