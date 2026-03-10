 Feature: File Name Camel Case

   Scenario Outline: Fails by design - invalid filename
     Given the following feature files
      | name       |
      | <FILENAME> |
     When Gherklin is ran with the following configuration
      | rules                          |
      | {"filename-camel-case": "on"}  |
     Then there is 1 file with errors
     And the errors are
      | location                 | severity | rule                 | message                                                       |
      | {"line": 1, "column": 1} | warn     | filename-camel-case  | File names should be camelCase. Got "<FILENAME>.feature".     |

     Examples:
      | FILENAME            |
      | PascalCase          |
      | snake_case          |
      | kebab-case          |
      | spaces case         |
      | snake_With_capitals  |

   Scenario Outline: Passes by design - valid filename
     Given the following feature files
      | name       |
      | <FILENAME> |
     When Gherklin is ran with the following configuration
      | rules                          |
      | {"filename-camel-case": "on"}  |
     Then there are 0 files with errors

     Examples:
      | FILENAME           |
      | camelCase          |
      | myFeature          |
      | anotherFeatureName |
      | feature            |


















