 Feature: No Consecutive Empty Lines

   Scenario: Fails by design - consecutive empty lines
     Given the following feature file
      """
 Feature: Foo


   Scenario: Bar
     Given a
      """
     When Gherklin is ran with the following configuration
      | rules                                |
      | {"no-consecutive-empty-lines": "on"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                         | message                                |
      | {"line": 3, "column": 1} | warn     | no-consecutive-empty-lines   | Consecutive empty lines are not allowed. |

   Scenario: Passes by design - no consecutive empty lines
     Given the following feature file
      """
 Feature: Foo

   Scenario: Bar
     Given a
      """
     When Gherklin is ran with the following configuration
      | rules                                |
      | {"no-consecutive-empty-lines": "on"} |
     Then there are 0 files with errors


















