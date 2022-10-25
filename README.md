# cz-conventional-changelog-jira

Part of the [commitizen](https://github.com/commitizen/cz-cli) family. Prompts for [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) standard and also prompts for a mandatory JIRA issue.

<!-- [![npm version](https://img.shields.io/npm/v/@altar-io/cz-conventional-changelog-jira.svg?style=flat-square)](https://www.npmjs.org/package/@altar-io/cz-conventional-changelog-jira) -->
<!-- [![npm downloads](https://img.shields.io/npm/dm/@altar-io/cz-conventional-changelog-jira.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@altar-io/cz-conventional-changelog-jira) -->
<!-- [![Build Status](https://img.shields.io/travis/altar-io/cz-conventional-changelog-jira.svg?style=flat-square)](https://travis-ci.org/altar-io/cz-conventional-changelog-jira) -->

## Features

- Works seamlessly with semantic-release 🚀
- Works seamlessly with Jira smart commits
- Automatically detects the Jira issue from the branch name

## Preview

![preview](/images/demo.gif)

## Quickstart

### Installation

```bash
npm install commitizen @altar-io/cz-conventional-changelog-jira --save-dev
```

and then add the following to package.json:

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/@altar-io/cz-conventional-changelog-jira"
    }
  }
}
```

### Usage

![Gif of terminal when using cz-conventional-changelog-jira](https://raw.githubusercontent.com/altar.io/cz-conventional-changelog-jira/master/images/demo.gif)

## Configuration

Like commitizen, you can specify the configuration of cz-conventional-changelog-jira through the package.json's `config.commitizen` key, or with environment variables.

| Environment variable    | package.json       | Default           | Description                                                                                                                                                             |
| ----------------------- | ------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CZ_JIRA_MODE            | jiraMode           | true              | If this is set to true, CZ will ask for a Jira issue and put it in the commit head. If set to false CZ will ask for the issue in the end, and can be used for GitHub.   |
| CZ_MAX_HEADER_WIDTH     | maxHeaderWidth     | 72                | This limits how long a commit message head can be.                                                                                                                      |
| CZ_MIN_HEADER_WIDTH     | minHeaderWidth     | 2                 | This limits how short a commit message can be.                                                                                                                          |
| CZ_MAX_LINE_WIDTH       | maxLineWidth       | 100               | Commit message bodies are automatically wrapped. This decides how long the lines will be.                                                                               |
| CZ_SKIP_SCOPE           | skipScope          | true              | If scope should be used in commit messages.                                                                                                                             |
| CZ_SKIP_DESCRIPTION     | skipDescription    | false             | If description should be used in commit messages.                                                                                                                       |
| CZ_SKIP_BREAKING        | skipBreaking       | false             | If breaking changes should be used in commit messages.                                                                                                                  |
|                         | scopes             | undefined         | A list (JS Array) of scopes that will be available for selection. Note that adding this will change the scope field from Inquirer 'input' to 'list'.                    |
| CZ_TYPE                 | defaultType        | undefined         | The default type.                                                                                                                                                       |
| CZ_SCOPE                | defaultScope       | undefined         | The default scope.                                                                                                                                                      |
| CZ_CUSTOM_SCOPE         | customScope        | false             | Whether user can provide custom scope in addition to predefined ones.                                                                                                   |
| CZ_SUBJECT              | defaultSubject     | undefined         | A default subject.                                                                                                                                                      |
| CZ_BODY                 | defaultBody        | undefined         | A default body.                                                                                                                                                         |
| CZ_ISSUES               | defaultIssues      | undefined         | A default issue.                                                                                                                                                        |
| CZ_JIRA_OPTIONAL        | jiraOptional       | false             | If this is set to true, you can leave the JIRA field blank.                                                                                                             |
| CZ_JIRA_PREFIX          | jiraPrefix         | "ALT"             | If this is set it will be will be displayed as the default JIRA ticket prefix.                                                                                          |
| CZ_JIRA_MULTIPLE_ISSUES | jiraMultipleIssues | true              | If this is set to false, you'll be able to input multiple JIRA tickets (ex: ALT-1, ALT-2, ALT-3)                                                                        |
| CZ_JIRA_EMOJI_TYPES     | jiraEmojiTypes     | false             | If this is set to true, commit types have emoji (ex: 🐛). Easier to spot the type.                                                                                      |
| CZ_JIRA_LOCATION        | jiraLocation       | "pre-description" | Changes position of JIRA ID. Options: `pre-type`, `pre-description`, `post-description`, `post-body`.                                                                   |
| CZ_JIRA_PREPEND         | jiraPrepend        | ""                | Prepends JIRA ID with an optional decorator. e.g.: `[ALT-123`.                                                                                                         |
| CZ_JIRA_APPEND          | jiraAppend         | ""                | Appends JIRA ID with an optional decorator. e.g.: `ALT-123]`.                                                                                                          |
| CZ_EXCLAMATION_MARK     | exclamationMark    | false             | On breaking changes, adds an exclamation mark (!) after the scope, e.g.: `type(scope)!: break stuff`. When activated, reduces the effective allowed header length by 1. |

### Jira Location Options

pre-type:

```text
JIRA-123 type(scope): commit subject
```

pre-description:

```text
type(scope): JIRA-123 commit subject
```

post-description:

```text
type(scope): commit subject JIRA-123
```

post-body:

```text
type(scope): commit subject

JIRA-123
```

```text
type(scope): commit subject

this is a commit body

JIRA-123
```

## Dynamic Configuration

Alternatively, if you want to create your own profile, you can use the _configurable_ approach.
Here is an example:
`./cz-config.js`

```javascript
const custom = require('@altar-io/cz-conventional-changelog-jira/configurable');
// You can do this optionally if you want to extend the commit types
const defaultTypes = require('@altar-io/cz-conventional-changelog-jira/types');

module.exports = custom({
  types: {
    ...defaultTypes,
    perf: {
      description: 'Improvements that will make your code perform better',
      title: 'Performance',
    },
  },
  skipScope: false,
  scopes: ['myScope1', 'myScope2'],
  customScope: true,
});
```

**./package.json**

```json
{
  "config": {
    "commitizen": {
      "path": "./cz-config.js"
    }
  }
}
```

This example would:

- Display _"perf"_ as an extra commit type
- Ask you to add a commit scope
- Limit the scope selection to either `myScope` or `myScope2`

List of all supported configurable options when using the _configurable_ approach:

| Key                | Default           | Description                                                                                                                                                                                                                                  |
| ------------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| jiraMode           | true              | If this is set to true, CZ will ask for a Jira issue and put it in the commit head. If set to false CZ will ask for the issue in the end, and can be used for GitHub.                                                                        |
| maxHeaderWidth     | 72                | This limits how long a commit message head can be.                                                                                                                                                                                           |
| minHeaderWidth     | 2                 | This limits how short a commit message can be.                                                                                                                                                                                               |
| maxLineWidth       | 100               | Commit message bodies are automatically wrapped. This decides how long the lines will be.                                                                                                                                                    |
| skipScope          | true              | If scope should be used in commit messages.                                                                                                                                                                                                  |
| defaultType        | undefined         | The default type.                                                                                                                                                                                                                            |
| defaultScope       | undefined         | The default scope.                                                                                                                                                                                                                           |
| defaultSubject     | undefined         | A default subject.                                                                                                                                                                                                                           |
| defaultBody        | undefined         | A default body.                                                                                                                                                                                                                              |
| defaultIssues      | undefined         | A default issue.                                                                                                                                                                                                                             |
| jiraPrefix         | 'ALT'             | The default JIRA ticket prefix that will be displayed.                                                                                                                                                                                       |
| jiraMultipleIssues | true              | The default amount if tickets that go in the commit message.                                                                                                                                                                                 |
| jiraEmojiTypes     | false             | The default display of thet types with emoji (easier to spot the type).                                                                                                                                                                      |
| types              | ./types.js        | A list (JS Object) of supported commit types.                                                                                                                                                                                                |
| scopes             | undefined         | A list (JS Array) of scopes that will be available for selection. Note that adding this will change the scope field from Inquirer 'input' to 'list'.                                                                                         |
| customScope        | false             | If this is set to true, users are given an option to provide custom scope aside the ones predefined in 'scopes' array. In this case a new option named 'custom' appears in the list and once chosen a prompt appears to provide custom scope |
| jiraOptional       | false             | If this is set to true, you can leave the JIRA field blank.                                                                                                                                                                                  |
| jiraLocation       | "pre-description" | Changes position of JIRA ID. Options: `pre-type`, `pre-description`, `post-description`, `post-body`                                                                                                                                         |
| jiraPrepend        | ""                | Prepends JIRA ID with an optional decorator. e.g.: `[ALT-123`                                                                                                                                                                               |
| jiraAppend         | ""                | Appends JIRA ID with an optional decorator. e.g.: `ALT-123]`                                                                                                                                                                                |
| exclamationMark    | false             | On breaking changes, adds an exclamation mark (!) after the scope, e.g.: `type(scope)!: break stuff`. When activated, reduces the effective allowed header length by 1.                                                                      |

### Commitlint

If using the [commitlint](https://github.com/conventional-changelog/commitlint) js library, the "maxHeaderWidth" configuration property will default to the configuration of the "header-max-length" rule instead of the hard coded value of 72. This can be ovewritten by setting the 'maxHeaderWidth' configuration in package.json or the CZ_MAX_HEADER_WIDTH environment variable.
