const conventionalCommitTypes = require('./types');
// import conventionalCommitTypes from './types.js';

module.exports = {
  types: conventionalCommitTypes,

  skipScope: true,
  skipDescription: false,
  skipBreaking: false,

  customScope: false,

  maxHeaderWidth: 72,
  minHeaderWidth: 2,
  maxLineWidth: 100,

  jiraMode: true,
  jiraPrefix: 'ALT',
  jiraEmojiTypes: false,
  jiraMultipleIssues: false,
  jiraOptional: false,
  jiraLocation: 'pre-description',
  jiraPrepend: '',
  jiraAppend: '',

  exclamationMark: false,
};
