const engine = require('./engine');
// import engine from './engine.js';

module.exports = (overridenOptions) => {
  return engine(overridenOptions);
};
