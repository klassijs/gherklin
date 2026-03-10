 Feature: No And But First

   Scenario: First step is And
     Given the following feature file
      """
 Feature: Foo
   Scenario: Bar
     And I am logged in
     When I do thing
     Then result
      """
     When Gherklin is ran with the following configuration
      | rules                     |
      | {"no-and-but-first": "on"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule              | message                                                          |
      | {"line": 3, "column": 5} | warn     | no-and-but-first  | First step in Scenario must be Given, When, or Then, not And or But. |

   Scenario: First step is But
     Given the following feature file
      """
 Feature: Foo
   Scenario: Bar
     But I have already done it
     When I do thing
     Then result
      """
     When Gherklin is ran with the following configuration
      | rules                     |
      | {"no-and-but-first": "on"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule              | message                                                          |
      | {"line": 3, "column": 5} | warn     | no-and-but-first  | First step in Scenario must be Given, When, or Then, not And or But. |

   Scenario: First step is Given
     Given the following feature file
      """
 Feature: Foo
   Scenario: Bar
     Given I am ready
     When I do thing
     Then result
      """
     When Gherklin is ran with the following configuration
      | rules                     |
      | {"no-and-but-first": "on"} |
     Then there are 0 files with errors
















