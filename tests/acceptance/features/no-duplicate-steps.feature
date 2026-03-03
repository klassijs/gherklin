Feature: No Duplicate Steps

  Scenario: Fails by design - duplicate step in scenario
    Given the following feature file
      """
      Feature: Foo
        Scenario: Bar
          Given I am logged in
          When I do something
          Given I am logged in
          Then I see result
      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"no-duplicate-steps": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule               | message                                                       |
      | {"line": 5, "column": 5} | error    | no-duplicate-steps | Duplicate step in same scenario: "Given I am logged in".      |

  Scenario: Passes by design - no duplicate steps
    Given the following feature file
      """
      Feature: Foo
        Scenario: Bar
          Given I am logged in
          When I do something
          Then I see result
      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"no-duplicate-steps": "error"} |
    Then there are 0 files with errors
