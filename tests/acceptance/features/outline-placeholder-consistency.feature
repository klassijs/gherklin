 Feature: Outline Placeholder Consistency

   Scenario: Placeholder in steps but not in Examples
     Given the following feature file
      """
 Feature: Foo
   Scenario Outline: Bar
     Given I have <X>
     When I use <Y>
     Examples:
            | X   |
            | one |
      """
     When Gherklin is ran with the following configuration
      | rules                                |
      | {"outline-placeholder-consistency": "error"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                           | message                                                         |
      | {"line": 2, "column": 3} | error    | outline-placeholder-consistency | Placeholder "<Y>" is used in steps but not in any Examples header. |

   Scenario: Placeholder in Examples but not in steps
     Given the following feature file
      """
 Feature: Foo
   Scenario Outline: Bar
     Given I have <X>
     Examples:
            | X   | Z   |
            | one | two |
      """
     When Gherklin is ran with the following configuration
      | rules                                |
      | {"outline-placeholder-consistency": "error"} |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                           | message                                                         |
      | {"line": 5, "column": 7} | error    | outline-placeholder-consistency | Placeholder "<Z>" appears in Examples but not in any step.        |

   Scenario: Consistent placeholders
     Given the following feature file
      """
 Feature: Foo
   Scenario Outline: Bar
     Given I have <X>
     When I see <Y>
     Examples:
            | X   | Y   |
            | one | two |
      """
     When Gherklin is ran with the following configuration
      | rules                                |
      | {"outline-placeholder-consistency": "error"} |
     Then there are 0 files with errors


















