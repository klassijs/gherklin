 Feature: Scenario Description

   Scenario: Fails by design - scenario without description
     Given the following feature file
      """
 Feature: Foo
   Scenario: Bar
     Given a
      """
     When Gherklin is ran with the following configuration
      | rules                             |
      | {"scenario-description": 40}     |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                 | message                        |
      | {"line": 2, "column": 3} | warn     | scenario-description | Scenario is missing a description. |

   Scenario: Passes by design - scenario with long enough description
     Given the following feature file
      """
 Feature: Foo
   Scenario: Bar

          This scenario has a description that meets the minimum length.

     Given a
      """
     When Gherklin is ran with the following configuration
      | rules                                  |
      | {"scenario-description": ["error", 40]} |
     Then there are 0 files with errors



















