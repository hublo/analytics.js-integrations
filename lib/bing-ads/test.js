
var Analytics = require('analytics').constructor;
var integration = require('analytics.js-integration');
var tester = require('../../test/plugin');
var plugin = require('./');

describe('Bing Ads', function(){
  var Bing = plugin.Integration;
  var bing;
  var analytics;
  var options = {
    siteId: 'fd080b41-0f80-421d-9f12-d6ba437e206d',
    domainId: '2823204',
    goals: {
      signup: 1,
      login: 2,
      play: 3
    }
  };

  beforeEach(function(){
    analytics = new Analytics;
    bing = new Bing(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(bing);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    bing.reset();
  });

  it('should have the correct settings', function(){
    var Test = integration('Bing Ads')
      .readyOnLoad()
      .option('siteId', '')
      .option('goals', {})
      .option('domainId', '');

    analytics.validate(Bing, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(bing, 'load');
    });

    afterEach(function(){
      bing.reset();
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(bing, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(window.mstag, 'loadTag');
      });

      it('should not send if goal is not defined', function(){
        analytics.track('toString', {});
        analytics.notCalled(window.mstag.loadTag);
      });

      it('should send correctly', function(){
        analytics.track('play', { revenue: 90 });
        analytics.called(window.mstag.loadTag, 'analytics', {
          domainId: options.domainId,
          revenue: 90,
          dedup: '1',
          type: '1',
          actionid: options.goals.play
        });
      });
    });
  });
});