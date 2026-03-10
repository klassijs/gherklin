 Feature: Max Background Steps

   Scenario: Background has too many steps
     Given the following feature file
      """
 Feature: Foo
   Background:
     Given one
     And two
     And three
     And four
   Scenario: Bar
     When x
     Then y
      """
     When Gherklin is ran with the following configuration
      | rules                         |
      | {"max-background-steps": 3}    |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                  | message                                       |
      | {"line": 2, "column": 3} | warn     | max-background-steps  | Background has 4 steps. Maximum allowed is 3. |

   Scenario: Background within limit
     Given the following feature file
      """
 Feature: Foo
   Background:
     Given one
     And two
   Scenario: Bar
     When x
     Then y
      """
     When Gherklin is ran with the following configuration
      | rules                         |
      | {"max-background-steps": 5}   |
     Then there are 0 files with errors



















