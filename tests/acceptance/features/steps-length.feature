Feature: Steps Length

  Scenario: Fails by design - step text exceeds max length
    Given the following feature file
      """
      Feature: Invalid
        Scenario: Foo
          Given short
          When this step is way too long for the limit we set
      """
    When Gherklin is ran with the following configuration
      | rules                    |
      | {"steps-length": 20}     |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule          | message                                              |
      | {"line": 4, "column": 5} | warn     | steps-length  | Step text is too long. Expected max 20, got 46.     |

  Scenario: Passes by design - step text within limit
    Given the following feature file
      """
      Feature: Valid
        Scenario: Foo
          Given short
          When a step under limit
          Then another ok step
      """
    When Gherklin is ran with the following configuration
      | rules                         |
      | {"steps-length": ["error", 80]} |
    Then there are 0 files with errors
