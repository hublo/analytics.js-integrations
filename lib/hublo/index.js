
var integration = require('analytics.js-integration');
var load = require('load-script');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Hublo);
};

/**
 * Expose `hublo.com` integration.
 */

var Hublo = exports.Integration = integration('Hublo')
  .assumesPageview()
  .readyOnInitialize()
  .global('_hublo_')
  .option('apiKey', null);

/**
 * Initialize.
 *
 * https://cdn.hublo.co/5353a2e62b26c1277b000004.js
 *
 * @param {Object} page
 */

Hublo.prototype.initialize = function(page){
  this.load();
};

/**
 * Load.
 *
 * @param {Function} callback
 */

Hublo.prototype.load = function(callback){
  var url = '//cdn.hublo.co/' + this.options.apiKey + '.js';
  load(url, callback);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Hublo.prototype.loaded = function(){
  return !! (window._hublo_ && typeof window._hublo_.setup === 'function');
};
