describe('Piwik', function(){

  var Piwik     = require('./'),
      analytics = require('analytics'),
      assert    = require('assert'),
      equal     = require('equals'),
      sinon     = require('sinon'),
      each      = require('each'),
      test      = require('analytics.js-integration-tester'),
      piwik,
      settings  = {
        siteId: 42,
        url: 'https://demo.piwik.org'
      };

  beforeEach(function(){
    analytics.use(Piwik);
    piwik = new Piwik.Integration(settings);
  });

  afterEach(function(){
    piwik.reset();
  });

  it('should have the right settings', function(){
    test(piwik)
      .name('Piwik')
      .global('_paq')
      .option('siteId', '')
      .option('url', null)
      .readyOnInitialize()
      .mapping('goals');
  });

  describe('#initialize', function(){
    beforeEach(function(){
      piwik.load = sinon.spy();
    });

    it('should call #load', function(){
      piwik.initialize();
      assert(piwik.load.called);
    });

    it('should push the id onto window._paq', function(){
      piwik.initialize();
      assert(equal(window._paq[0], ['setSiteId', settings.siteId]));
    });

    it('should push the url onto window._paq', function(){
      piwik.initialize();
      assert(equal(window._paq[1], ['setTrackerUrl', settings.url + "/piwik.php"]));
    });
  });

  describe('#load', function(){
    beforeEach(function(){
      sinon.stub(piwik, 'load');
      piwik.initialize();
      piwik.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!piwik.loaded());
      piwik.load(function (err) {
        if (err) return done(err);
        assert(piwik.loaded());
        done();
      });
    });
  });

  describe('#page', function() {
    beforeEach(function(){
      piwik.initialize();
    });

    it('should send a page view', function(){
      test(piwik).page();
    });
  });

  describe('#track', function(){
    beforeEach(function(){
      piwik.initialize();
    })

    it('should track goals', function(){
      piwik.options.goals = [{ key: 'goal', value: 1 }];
      test(piwik).track('goal');
      assert.deepEqual(window._paq[3], ['trackGoal', 1, 0]);
    })

    it('should send .revenue()', function(){
      piwik.options.goals = [{ key: 'goal', value: 2 }];
      test(piwik).track('goal', { revenue: 10 });
      assert.deepEqual(window._paq[3], ['trackGoal', 2, 10]);
    })

    it('should send .total()', function(){
      piwik.options.goals = [{ key: 'completed order', value: 10 }];
      test(piwik).track('Completed Order', { total: 20 });
      assert.deepEqual(window._paq[3], ['trackGoal', 10, 20]);
    })
  })
});
