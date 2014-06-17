
var assert = require('assert');
var Integrations = require('../index.js');
var object = require('object');
var gravy = require('gravy');

/**
 * Initialize mocha.
 */

if ('undefined' != typeof window) {
  mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true,
    slow: 300,
    timeout: 10000
  });
}

/**
 * Assert we have the right number of integrations.
 */

describe('integrations', function(){
  it('should export our integrations', function(){
    assert(object.length(Integrations) === 75);
  });
});

/**
 * Load integration tests.
 */

require('./tests');

/**
 * Run tests.
 */

if ('undefined' != typeof window) {
  if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
  } else {
    if (window.location.search.match(/\?cloud=true/)) {
      gravy(mocha.run());
    } else {
      mocha.run();
    }
  }
}
