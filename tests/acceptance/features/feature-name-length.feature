 Feature: Feature Name Length

   Scenario: Invalid - feature name too long
     Given the following feature file
      """
 Feature: This is an extremely long feature name that exceeds the limit
   Scenario: One
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                        |
      | {"feature-name-length": 20}  |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                 | message                                                       |
      | {"line": 1, "column": 1} | warn     | feature-name-length  | Feature name is too long. Expected max 20, got 61.           |

   Scenario: Valid
     Given the following feature file
      """
 Feature: Short name
   Scenario: One
     Given x
      """
     When Gherklin is ran with the following configuration
      | rules                                    |
      | {"feature-name-length": ["error", 100]} |
     Then there are 0 files with errors





