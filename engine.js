'format cjs';

const wrap = require('word-wrap');
const map = require('lodash.map');
const longest = require('longest');
const rightPad = require('right-pad');
const chalk = require('chalk');
const { execSync } = require('child_process');
const boxen = require('boxen');

const defaults = require('./defaults');
const LimitedInputPrompt = require('./LimitedInputPrompt');

const filter = array => {
  return array.filter(x => {
    return x;
  });
};

const filterSubject = subject => {
  subject = subject.trim();
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = options => {
  const getFromOptionsOrDefaults = key => {
    return options[key] || defaults[key];
  };
  const getJiraIssueLocation = (location, type, scope, jiraWithDecorators, subject) => {
    switch (location) {
      case 'pre-type':
        return jiraWithDecorators + type + scope + ': ' + subject;
      case 'pre-description':
        return type + scope + ': ' + jiraWithDecorators + subject;
      case 'post-description':
        return type + scope + ': ' + subject + ' ' + jiraWithDecorators;
      case 'post-body':
        return type + scope + ': ' + subject;
      default:
        return type + scope + ': ' + jiraWithDecorators + subject;
    }
  };
  const types = getFromOptionsOrDefaults('types');
  const useEmojiTypes = getFromOptionsOrDefaults('jiraEmojiTypes');

  const length = longest(Object.keys(types)).length + 1;
  const choices = map(types, (type, key) => {
    return {
      name: `${rightPad(`${key}:`, length)} ${useEmojiTypes && type.emoji ? type.emoji : ''} ${type.description}`,
      value: key,
    };
  });

  const minHeaderWidth = getFromOptionsOrDefaults('minHeaderWidth');
  const maxHeaderWidth = getFromOptionsOrDefaults('maxHeaderWidth');

  const branchName = execSync('git branch --show-current')
    .toString()
    .trim();
  const jiraIssueRegex = /(?<jiraIssue>(?<!([a-zA-Z0-9]{1,10})-?)[a-zA-Z0-9]+-\d+)/;
  const matchResult = branchName.match(jiraIssueRegex);
  const jiraIssue = matchResult && matchResult.groups && matchResult.groups.jiraIssue;
  const hasScopes = options.scopes && Array.isArray(options.scopes) && options.scopes.length > 0;
  const customScope = !options.skipScope && hasScopes && options.customScope;
  const scopes = customScope ? [...options.scopes, 'custom'] : options.scopes;

  const getProvidedScope = (answers) => {
    return answers.scope === 'custom' ? answers.customScope : answers.scope;
  };

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: (cz, commit, testMode) => {
      cz.registerPrompt('limitedInput', LimitedInputPrompt);

      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: "Select the type of change that you're committing:",
          choices: choices,
          default: options.defaultType,
          loop: false,
          pageSize: choices.length,
        },
        {
          type: hasScopes ? 'list' : 'input',
          name: 'scope',
          when: !options.skipScope,
          choices: hasScopes ? scopes : undefined,
          message: `What is the scope of this change (e.g. component or file name):${hasScopes ? ' (select from the list)' : ''}`,
          default: options.defaultScope,
          validate: (value) => {
            if (value.trim().length === 0) {
              return 'Scope is required';
            }

            return value.trim().length > 0;
          },
          filter: (value) => {
            return value.trim().toLowerCase();
          },
        },
        {
          type: 'input',
          name: 'jira',
          message: `Enter JIRA issue (ex: ${options.jiraPrefix}-123${options.jiraMultipleIssues ? ` or multiple: ${options.jiraPrefix}-123, ${options.jiraPrefix}-456`: ''})${options.jiraOptional ? ' (optional)' : ''}:`,
          when: options.jiraMode,
          default: jiraIssue || null,
          validate: (value) => {
            const isMultpleIssues = options.jiraMultipleIssues;
            const jiraPrefix = options.jiraPrefix;
            const jiraIssueResolve = jiraPrefix ? `${`[${jiraPrefix.toLowerCase()}${jiraPrefix.toUpperCase()}]`}+\\-` : `[a-zA-Z0-9]+\\-`;
            const regexSingle = `^((${jiraIssueResolve}\\d+))$`;
            const regexMultiple = `^(((,\\s)?(${jiraIssueResolve}\\d+))((?:(,\\s)(${jiraIssueResolve}\\d+)))*?)$`;

            const testRegex = (multiple, message) => {
              return multiple
                ? new RegExp(regexMultiple).test(message)
                : new RegExp(regexSingle).test(message);
            }

            const regexTest = testRegex(isMultpleIssues, value);

            if (isMultpleIssues && !regexTest) {
              return 'You cannot input multiple JIRA issues';
            }

            return (options.jiraOptional && !value) || regexTest;
          },
          filter: (value) => {
            return value.toUpperCase();
          },
        },
        {
          type: 'input',
          name: 'customScope',
          when: ({ scope }) => scope === 'custom',
          message: 'Type custom scope (press enter to skip)',
        },
        {
          type: 'limitedInput',
          name: 'subject',
          message: 'Write a short, imperative description of the change:',
          default: options.defaultSubject,
          maxLength: maxHeaderWidth - (options.exclamationMark ? 1 : 0),
          leadingLabel: answers => {
            const jira = answers.jira && options.jiraLocation !== 'post-body' ? ` ${getFromOptionsOrDefaults('jiraPrepend') || ''}${answers.jira}${getFromOptionsOrDefaults('jiraAppend') || ''}` : '';

            let scope = '';
            const providedScope = getProvidedScope(answers);
            if (providedScope && providedScope !== 'none') {
              scope = `(${providedScope})`;
            }

            return `${answers.type}${scope}:${jira}`;
          },
          validate: input => input.length >= minHeaderWidth || `The subject must have at least ${minHeaderWidth} characters`,
          filter: (value) => {
            return filterSubject(value);
          },
        },
        {
          type: 'input',
          name: 'body',
          when: !options.skipDescription,
          message: 'Provide a longer description of the change: (press enter to skip)\n',
          default: options.defaultBody,
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          when: !options.skipBreaking,
          message: 'Are there any breaking changes?',
          default: false,
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: 'You do know that this will bump the major version, are you sure?',
          default: false,
          when: (answers) => {
            return answers.isBreaking;
          },
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'Describe the breaking changes:\n',
          when: (answers) => {
            return answers.isBreaking;
          },
        },
        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: 'Does this change affect any open issues?',
          default: options.defaultIssues ? true : false,
          when: !options.jiraMode,
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
          when: (answers) => {
            return answers.isIssueAffected && !answers.body && !answers.breakingBody;
          },
        },
        {
          type: 'input',
          name: 'issues',
          message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
          when: (answers) => {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined,
        },
      ]).then(async (answers) => {
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth,
        };

        // parentheses are only needed when a scope is present
        const providedScope = getProvidedScope(answers);
        let scope = providedScope ? '(' + providedScope + ')' : '';

        const addExclamationMark = options.exclamationMark && answers.breaking;
        scope = addExclamationMark ? scope + '!' : scope;

        // Get Jira issue prepend and append decorators
        const prepend = options.jiraPrepend || '';
        const append = options.jiraAppend || '';
        const jiraWithDecorators = answers.jira ? prepend + answers.jira + append + ' ' : '';

        // Hard limit this line in the validate
        const head = getJiraIssueLocation(options.jiraLocation, answers.type, scope, jiraWithDecorators, answers.subject);

        // Wrap these lines at options.maxLineWidth characters
        let body = answers.body ? wrap(answers.body, wrapOptions) : false;
        if (options.jiraMode && options.jiraLocation === 'post-body') {
          if (body === false) {
            body = '';
          } else {
            body += '\n\n';
          }
          body += jiraWithDecorators.trim();
        }

        // Apply breaking change prefix, removing it if already present
        let breaking = answers.breaking ? answers.breaking.trim() : '';
        breaking = breaking ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '') : '';
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        const issues = answers.issues ? wrap(answers.issues, wrapOptions) : false;

        const fullCommit = filter([head, body, breaking, issues]).join('\n\n');

        if (testMode) {
          return commit(fullCommit);
        }

        console.log();
        console.log(chalk.underline('Commit preview:'));
        console.log(boxen(chalk.green(fullCommit), { padding: 1, margin: 1 }));

        const { doCommit } = await cz.prompt([
          {
            type: 'confirm',
            name: 'doCommit',
            message: 'Are you sure that you want to commit?',
          },
        ]);

        if (doCommit) {
          commit(fullCommit);
        }
      });
    },
  };
};
