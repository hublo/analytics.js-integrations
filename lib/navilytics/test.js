
var Analytics = require('analytics').constructor;
var integration = require('analytics.js-integration');
var tester = require('../../test/plugin');
var plugin = require('./');
var timeouts = require('clear-timeouts');

describe('Navilytics', function(){
  var Navilytics = plugin.Integration;
  var navilytics;
  var analytics;
  var settings;

  beforeEach(function(){
    settings = {
      memberId: '1042',
      projectId: '73'
    };
    analytics = new Analytics;
    navilytics = new Navilytics(settings);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(navilytics);
  });
  
  afterEach(function(){
    analytics.restore();
    analytics.reset();
    timeouts();
  });

  after(function(){
    navilytics.reset();
  });

  it('should have the right settings', function(){
    var Test = integration('Navilytics')
      .assumesPageview()
      .readyOnLoad()
      .global('__nls')
      .option('memberId', '')
      .option('projectId', '');

    analytics.validate(Navilytics, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(navilytics, 'load');
    });

    afterEach(function(){
      navilytics.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(navilytics.load);
      });

      it('should create window.__nls', function(){
        analytics.assert(null == window.__nls);
        analytics.initialize();
        analytics.page();
        analytics.deepEqual([], window.__nls);
      });
    });

    describe('#loaded', function(){
      it('should test __nls.push', function(){
        window.__nls = [];
        analytics.assert(!navilytics.loaded());
        window.__nls.push = function(){};
        analytics.assert(navilytics.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(navilytics, done);
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
        analytics.stub(window.__nls, 'push');
      });

      it('should tag the recording', function(){
        analytics.track('event');
        analytics.called(window.__nls.push, ['tagRecording', 'event']);
      });
    });
  });
});