 Feature: No Punctuation in Titles

   Scenario: Feature title with punctuation
     Given the following feature file
      """
 Feature: Something great!
   Scenario: Bar
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                            |
      | {"no-punctuation-in-titles": "on"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                      | message                                              |
      | {"line": 1, "column": 1} | warn     | no-punctuation-in-titles | Feature title must not end with punctuation (. ! ?).  |

   Scenario: Scenario title with full stop
     Given the following feature file
      """
 Feature: Foo
   Scenario: Doing something.
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                            |
      | {"no-punctuation-in-titles": "on"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                      | message                                               |
      | {"line": 2, "column": 3} | warn     | no-punctuation-in-titles | Scenario title must not end with punctuation (. ! ?). |

   Scenario: No punctuation passes
     Given the following feature file
      """
 Feature: Valid feature
   Scenario: Valid scenario
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                            |
      | {"no-punctuation-in-titles": "on"} |
     Then there are 0 files with errors



















