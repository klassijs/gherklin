 Feature: One Feature Per File

   Scenario: Single Feature passes
     Given the following feature file
      """
 Feature: Only one
   Scenario: Bar
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                      |
      | {"one-feature-per-file": "on"} |
     Then there are 0 files with errors





