
describe('MouseStats', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var MouseStats = require('./index')
  var sinon = require('sinon');
  var test = require('analytics.js-integration-tester');

  var mousestats;
  var settings = {
    accountNumber: '5532375730335616295'
  };

  beforeEach(function () {
    analytics.use(MouseStats);
    mousestats = new MouseStats.Integration(settings);
    mousestats.initialize(); // noop
  });

  afterEach(function () {
    mousestats.reset();
  });

  it('should have the right settings', function () {
    test(mousestats)
      .name('MouseStats')
      .assumesPageview()
      .readyOnLoad()
      .global('msaa')
      .global('MouseStatsVisitorPlaybacks')
      .option('accountNumber', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      mousestats.load = sinon.spy();
      mousestats.initialize();
      assert(mousestats.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test window.MouseStatsVisitorPlaybacks', function () {
      assert(!mousestats.loaded());
      window.MouseStatsVisitorPlaybacks = document.createElement('div');
      assert(!mousestats.loaded());
      window.MouseStatsVisitorPlaybacks = [];
      assert(mousestats.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      mousestats.initialize();
    });

    it('should change loaded state', function (done) {
      assert(!mousestats.loaded());
      mousestats.load(function (err) {
        if (err) return done(err);
        assert(mousestats.loaded());
        done();
      });
    });
  });

});
