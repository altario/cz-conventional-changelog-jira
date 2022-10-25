const chai = require('chai');
// const chalk = require('chalk');
const engine = require('./engine');
const mock = require('mock-require');
const semver = require('semver');
// const types = require('./types');
const defaults = require('./defaults');

// import chai from 'chai';
// import engine from './engine.js';
// import mock from 'mock-require';
// import semver from 'semver';
// import defaults from 'defaults';

const expect = chai.expect;
chai.should();

const defaultOptions = defaults;

const jiraTag = defaultOptions.jiraPrefix;
const jiraPrepend = defaultOptions.jiraPrepend;
const jiraAppend = defaultOptions.jiraAppend;

const type = 'func';
const scope = 'everything';
const customScope = 'custom scope';
const letterTransformIndex = 0;
const fakeJiraIssueNumber = '123';
const jira = `${jiraTag.toLowerCase().substring(0, letterTransformIndex) + jiraTag.toLowerCase().substring(letterTransformIndex, letterTransformIndex + 1).toUpperCase() + jiraTag.toLowerCase().substring(letterTransformIndex + 1)}-${fakeJiraIssueNumber}`;
const jiraUpperCase = `${jiraTag}-${fakeJiraIssueNumber}`;
const subject = `testing${fakeJiraIssueNumber}`;
const shortBody = 'a';
const longBody =
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a';
const longBodySplit =
  longBody.slice(0, defaultOptions.maxLineWidth).trim() +
  '\n' +
  longBody.slice(defaultOptions.maxLineWidth, 2 * defaultOptions.maxLineWidth).trim() +
  '\n' +
  longBody.slice(defaultOptions.maxLineWidth * 2, longBody.length).trim();
const body = 'A quick brown fox jumps over the dog';
const issues = 'a issues is not a person that kicks things';
const longIssues =
  'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b' +
  'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b' +
  'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b';
const breakingChange = 'BREAKING CHANGE: ';
const breaking = 'asdhdfkjhbakjdhjkashd adhfajkhs asdhkjdsh ahshd';
const longIssuesSplit =
  longIssues.slice(0, defaultOptions.maxLineWidth).trim() +
  '\n' +
  longIssues.slice(defaultOptions.maxLineWidth, defaultOptions.maxLineWidth * 2).trim() +
  '\n' +
  longIssues.slice(defaultOptions.maxLineWidth * 2, longIssues.length).trim();

describe('commit message', () => {
  it('only header w/ out scope', () => {
    expect(
      commitMessage({
        type,
        jira,
        subject,
      })
    ).to.equal(`${type}: ${jiraUpperCase} ${subject}`);
  });
  it('only header w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}`);
  });
  it('header and body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body,
      })
    ).to.equal(`${type}: ${jiraUpperCase} ${subject}\n\n${body}`);
  });
  it('header and body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${body}`);
  });
  it('header and body w/ custom scope', () => {
    expect(
      commitMessage({
        type,
        scope: 'custom',
        customScope,
        jira,
        subject,
        body,
      })
    ).to.equal(`${type}(${customScope}): ${jiraUpperCase} ${subject}\n\n${body}`);
  });
  it('header, body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body,
        issues,
      })
    ).to.equal(`${type}: ${jiraUpperCase} ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body,
        issues,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body,
        issues: longIssues,
      })
    ).to.equal(`${type}: ${jiraUpperCase} ${subject}\n\n${body}\n\n${longIssuesSplit}`);
  });
  it('header, body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body,
        issues: longIssues,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${body}\n\n${longIssuesSplit}`);
  });
  it('header and long body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body: longBody,
      })
    ).to.equal(`${type}: ${jiraUpperCase} ${subject}\n\n${longBodySplit}`);
  });
  it('header and long body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${longBodySplit}`);
  });
  it('header, long body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body: longBody,
        issues,
      })
    ).to.equal(`${type}: ${jiraUpperCase} ${subject}\n\n${longBodySplit}\n\n${issues}`);
  });
  it('header, long body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        issues,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${longBodySplit}\n\n${issues}`);
  });
  it('header, long body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        jira,
        subject,
        body: longBody,
        issues: longIssues,
      })
    ).to.equal(`${type}: ${jiraUpperCase} ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`);
  });
  it('header, long body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        issues: longIssues,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`);
  });
  it('header, long body, breaking change, and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        breaking,
        issues: longIssues,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`);
  });
  it('header, long body, breaking change (with prefix entered), and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        jira,
        subject,
        body: longBody,
        breaking: `${breakingChange}${breaking}`,
        issues: longIssues,
      })
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`);
  });
  it('header, body, breaking change, and issues w/ scope; exclamation mark enabled', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
          breaking,
          issues,
        },
        { ...defaultOptions, exclamationMark: true }
      )
    ).to.equal(`${type}(${scope})!: ${jiraUpperCase} ${subject}\n\n${body}\n\n${breakingChange}${breaking}\n\n${issues}`);
  });
  it('header, body, breaking change, and issues w/o scope; exclamation mark enabled', () => {
    expect(
      commitMessage(
        {
          type,
          jira,
          subject,
          body,
          breaking,
          issues,
        },
        { ...defaultOptions, exclamationMark: true }
      )
    ).to.equal(`${type}!: ${jiraUpperCase} ${subject}\n\n${body}\n\n${breakingChange}${breaking}\n\n${issues}`);
  });
  it('skip jira task when optional', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira: '',
          subject,
        },
        { jiraOptional: true }
      )
    ).to.equal(`${type}(${scope}): ${subject}`);
  });
  it('default jiraLocation when unknown', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        { jiraLocation: 'unknown-location' }
      )
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${body}`);
  });
  it('pre-type jiraLocation', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        { jiraLocation: 'pre-type' }
      )
    ).to.equal(`${jiraUpperCase} ${type}(${scope}): ${subject}\n\n${body}`);
  });
  it('pre-description jiraLocation', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        { jiraLocation: 'pre-description' }
      )
    ).to.equal(`${type}(${scope}): ${jiraUpperCase} ${subject}\n\n${body}`);
  });
  it('post-description jiraLocation', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        { jiraLocation: 'post-description' }
      )
    ).to.equal(`${type}(${scope}): ${subject} ${jiraUpperCase} \n\n${body}`);
  });
  it('post-body jiraLocation with body', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        { ...defaultOptions, jiraLocation: 'post-body' }
      )
    ).to.equal(`${type}(${scope}): ${subject}\n\n${body}\n\n${jiraUpperCase}`);
  });
  it('post-body jiraLocation no body', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body: false,
        },
        { ...defaultOptions, jiraLocation: 'post-body' }
      )
    ).to.equal(`${type}(${scope}): ${subject}\n\n${jiraUpperCase}`);
  });
  it('post-body jiraLocation with body and footer', () => {
    const footer = `${breakingChange}${breaking}`;
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
          breaking,
        },
        { ...defaultOptions, jiraLocation: 'post-body' }
      )
    ).to.equal(`${type}(${scope}): ${subject}\n\n${body}\n\n${jiraUpperCase}\n\n${breakingChange}${breaking}`);
  });
  it('jiraPrepend decorator', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        { jiraPrepend: '-' }
      )
    ).to.equal(`${type}(${scope}): -${jiraUpperCase} ${subject}\n\n${body}`);
  });
  it('jiraAppend decorator', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        { jiraAppend: '+' }
      )
    ).to.equal(`${type}(${scope}): ${jiraUpperCase}+ ${subject}\n\n${body}`);
  });
  it('jiraPrepend and jiraAppend decorators', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        {
          jiraAppend: ']',
          jiraPrepend: '[',
        }
      )
    ).to.equal(`${type}(${scope}): [${jiraUpperCase}] ${subject}\n\n${body}`);
  });
  it('jiraLocation, jiraPrepend, jiraAppend decorators', () => {
    expect(
      commitMessage(
        {
          type,
          scope,
          jira,
          subject,
          body,
        },
        {
          jiraAppend: ']',
          jiraPrepend: '[',
          jiraLocation: 'pre-type',
        }
      )
    ).to.equal(`[${jiraUpperCase}] ${type}(${scope}): ${subject}\n\n${body}`);
  });
});

describe('validation', () => {
  it('subject exceeds max length', () => {
    expect(() =>
      commitMessage({
        type,
        scope,
        jira,
        subject: shortBody,
      })
    ).to.throw(`The subject must have at least 2 characters`);
  });
  it('empty subject', () => {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: '',
      })
    ).to.throw(`The subject must have at least 2 characters`);
  });
  it('empty jira if not optional', () => {
    expect(() =>
      commitMessage(
        {
          type,
          scope,
          jira: '',
          subject,
        },
        { jiraOptional: false }
      )
    ).to.throw(`Answer '' to question 'jira' was invalid`);
  });
});

describe('defaults', () => {
  it('defaultType default', () => {
    expect(questionDefault('type')).to.be.undefined;
  });
  it('defaultType options', () => {
    expect(questionDefault('type', customOptions({ defaultType: type }))).to.equal(type);
  });
  it('defaultScope default', () => {
    expect(questionDefault('scope')).to.be.undefined;
  });
  it('defaultScope options', () => expect(questionDefault('scope', customOptions({ defaultScope: scope }))).to.equal(scope));

  it('defaultSubject default', () => expect(questionDefault('subject')).to.be.undefined);
  it('defaultSubject options', () => {
    expect(
      questionDefault(
        'subject',
        customOptions({
          defaultSubject: subject,
        })
      )
    ).to.equal(subject);
  });
  it('defaultBody default', () => {
    expect(questionDefault('body')).to.be.undefined;
  });
  it('defaultBody options', () => {
    expect(questionDefault('body', customOptions({ defaultBody: body }))).to.equal(body);
  });
  it('defaultIssues default', () => {
    expect(questionDefault('issues')).to.be.undefined;
  });
  it('defaultIssues options', () => {
    expect(
      questionDefault(
        'issues',
        customOptions({
          defaultIssues: issues,
        })
      )
    ).to.equal(issues);
  });
});

describe('filter', () => {
  it('lowercase scope', () => expect(questionFilter('scope', 'HelloMatt')).to.equal('hellomatt'));
});

describe('when', () => {
  it('breaking by default', () => expect(questionWhen('breaking', {})).to.be.undefined);
  it('breaking when isBreaking', () =>
    expect(
      questionWhen('breaking', {
        isBreaking: true,
      })
    ).to.be.true);
  it('issues by default', () => expect(questionWhen('issues', {})).to.be.undefined);
  it('issues when isIssueAffected', () =>
    expect(
      questionWhen('issues', {
        isIssueAffected: true,
      })
    ).to.be.true);
});

describe('commitlint config header-max-length', () => {
  //commitlint config parser only supports Node 6.0.0 and higher
  if (semver.gte(process.version, '6.0.0')) {
    const mockOptions = headerMaxLength => {
      let options = undefined;
      mock('./engine', opts => {
        options = opts;
      });
      if (headerMaxLength) {
        mock('cosmiconfig', () => {
          return {
            load: cwd => {
              return {
                filepath: `${cwd}/.commitlintrc.js`,
                config: {
                  rules: {
                    'header-max-length': [2, 'always', headerMaxLength],
                  },
                },
              };
            },
          };
        });
      }

      mock.reRequire('./index');
      try {
        return mock
          .reRequire('@commitlint/load')()
          .then(() => {
            return options;
          });
      } catch (err) {
        return Promise.resolve(options);
      }
    };

    afterEach(() => {
      delete require.cache[require.resolve('./index')];
      delete require.cache[require.resolve('@commitlint/load')];
      delete process.env.CZ_MAX_HEADER_WIDTH;
      mock.stopAll();
    });

    it('with no environment or commitizen config override', () => {
      return mockOptions(72).then(options => {
        expect(options).to.have.property('maxHeaderWidth', 72);
      });
    });

    it('with environment constiable override', () => {
      process.env.CZ_MAX_HEADER_WIDTH = '105';
      return mockOptions(72).then(options => {
        expect(options).to.have.property('maxHeaderWidth', 105);
      });
    });

    it('with commitizen config override', () => {
      mock('commitizen', {
        configLoader: {
          load: () => {
            return {
              maxHeaderWidth: 103,
            };
          },
        },
      });
      return mockOptions(72).then(options => {
        expect(options).to.have.property('maxHeaderWidth', 103);
      });
    });
  } else {
    //Node 4 doesn't support commitlint so the config value should remain the same
    it('default value for Node 4', () => {
      return mockOptions(72).then(options => {
        expect(options).to.have.property('maxHeaderWidth', 100);
      });
    });
  }
});

describe('questions', () => {
  it('default jira question', () => {
    expect(questionPrompt('jira')).to.be.eq(`Enter JIRA issue ${jiraPrepend || ''}${jiraTag}-${fakeJiraIssueNumber}${jiraAppend || ''}:`);
  });
  it('optional jira question', () => {
    expect(questionPrompt('jira', [], { jiraOptional: true })).to.be.eq(`Enter JIRA issue ${jiraPrepend || ''}${jiraTag}-${fakeJiraIssueNumber}${jiraAppend || ''} (optional):`);
  });
  it('scope with list', () => {
    expect(questionPrompt('scope', [], { scopes: ['scope1', 'scope2'] })).to.be.eq(
      'What is the scope of this change (e.g. component or file name): (select from the list)'
    );
  });
  it('scope without list', () => {
    expect(questionPrompt('scope')).to.be.eq('What is the scope of this change (e.g. component or file name):');
  });
});

function commitMessage(answers, options) {
  options = options || defaultOptions;
  let result = null;

  engine(options).prompter(
    {
      prompt: questions => {
        return {
          then: finalizer => {
            processQuestions(questions, answers, options);
            finalizer(answers);
          },
        };
      },
      registerPrompt: () => {},
    },
    message => {
      result = message;
    },
    true
  );
  return result;
}

function processQuestions(questions, answers, options) {
  for (const i in questions) {
    const question = questions[i];

    const answer = answers[question.name];
    const validation = answer === undefined || !question.validate ? true : question.validate(answer, answers);
    if (validation !== true) {
      throw new Error(validation || `Answer '${answer}' to question '${question.name}' was invalid`);
    }
    if (question.filter && answer) {
      answers[question.name] = question.filter(answer);
    }
  }
}

function getQuestions(options) {
  options = options || defaultOptions;
  let result = null;
  engine(options).prompter({
    prompt: questions => {
      result = questions;
      return {
        then: () => {},
      };
    },
    registerPrompt: () => {},
  });
  return result;
}

function getQuestion(name, options) {
  options = options || defaultOptions;
  const questions = getQuestions(options);
  for (const i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.message && typeof question.message === 'string' ? question.message : question.message(answers);
}

function questionTransformation(name, answers, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.transformer && question.transformer(answers[name], answers, options);
}

function questionFilter(name, answer, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.filter && question.filter(typeof answer === 'string' ? answer : answer[name]);
}

function questionDefault(name, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.when(answers);
}

function customOptions(options) {
  Object.keys(defaultOptions).forEach(key => {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  });
  return options;
}
