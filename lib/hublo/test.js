describe('Hublo', function () {
  var analytics = require('analytics');
  var test = require('analytics.js-integration-tester');
  var sinon = require('sinon');
  var assert = require('assert');
  var Hublo = require('./index');

  var hublo;
  var settings = {
    apiKey: '5353a2e62b26c1277b000004'
  };

  beforeEach(function () {
    analytics.use(Hublo);
    hublo = new Hublo.Integration(settings);
    hublo.initialize();
  });

  it('should have the right settings', function () {
    test(hublo)
      .name('Hublo')
      .assumesPageview()
      .readyOnInitialize()
      .global('_hublo_')
      .option('apiKey', null);
  });

  describe('#initialize', function () {
    beforeEach(function(){
      sinon.spy(hublo, 'load');
    });

    it('should call #load', function (){
      hublo.initialize();
      assert(hublo.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window._hublo_.setup', function (){
      window._hublo_ = undefined;
      assert(!hublo.loaded());

      window._hublo_ = { setup: function () {} };
      assert(hublo.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      // "Unload" Hublo
      window._hublo_ = null;
    });

    it('should change loaded state', function (done) {
      assert(!hublo.loaded());
      hublo.load(function (err) {
        if (err) return done(err);
        assert(hublo.loaded());
        done();
      });
    });
  });

});
