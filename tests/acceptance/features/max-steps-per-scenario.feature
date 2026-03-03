Feature: Max Steps Per Scenario

  Scenario: Too many steps
    Given the following feature file
      """
      Feature: Foo
        Scenario: Many steps
          Given one
          And two
          And three
          When four
          Then five
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"max-steps-per-scenario": 3} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                    | message                                    |
      | {"line": 2, "column": 3} | warn     | max-steps-per-scenario  | Scenario has 5 steps. Maximum allowed is 3. |

  Scenario: Within limit
    Given the following feature file
      """
      Feature: Foo
        Scenario: Few steps
          Given one
          When two
          Then three
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"max-steps-per-scenario": 5} |
    Then there are 0 files with errors
