Feature: Scenario Outline Has Examples

  Scenario: Fails by design - outline without examples
    Given the following feature file
      """
      Feature: Foo
        Scenario Outline: Bar
          Given <x>
          When I do thing
          Then result
      """
    When Gherklin is ran with the following configuration
      | rules                                      |
      | {"scenario-outline-has-examples": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                           | message                                              |
      | {"line": 2, "column": 3} | error    | scenario-outline-has-examples  | Scenario Outline must have at least one Examples block. |

  Scenario: Passes by design - outline with examples
    Given the following feature file
      """
      Feature: Foo
        Scenario Outline: Bar
          Given <x>
          Examples:
            | x   |
            | one |
      """
    When Gherklin is ran with the following configuration
      | rules                                      |
      | {"scenario-outline-has-examples": "error"} |
    Then there are 0 files with errors
