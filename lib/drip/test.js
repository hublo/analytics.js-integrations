
var Analytics = require('analytics').constructor;
var integration = require('analytics.js-integration');
var tester = require('../../test/plugin');
var plugin = require('./');

describe('Drip', function(){
  var Drip = plugin.Integration;
  var drip;
  var analytics;
  var options = {
    account: '9999999'
  };

  beforeEach(function(){
    analytics = new Analytics;
    drip = new Drip(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(drip);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    drip.reset();
  });
  
  it('should have the right settings', function(){
    var Test = integration('Drip')
      .assumesPageview()
      .readyOnLoad()
      .global('dc')
      .global('_dcq')
      .global('_dcs')
      .option('account', '');

    analytics.validate(Drip, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(drip, 'load');
    });

    afterEach(function(){
      drip.reset();
    });

    describe('#initialize', function(){
      it('should create window._dcq', function(){
        analytics.assert(!window._dcq);
        analytics.initialize();
        analytics.page();
        analytics.assert(window._dcq instanceof Array);
      });

      it('should create window._dcs', function(){
        analytics.assert(!window._dcs);
        analytics.initialize();
        analytics.page();
        analytics.assert(window._dcs);
        analytics.assert(window._dcs.account === options.account);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(drip.load);
      });
    });

    describe('#loaded', function(){
      it('should test window.dc', function(){
        analytics.assert(!drip.loaded());
        window.dc = document.createElement('div');
        analytics.assert(!drip.loaded());
        window.dc = {};
        analytics.assert(drip.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(drip, done);
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
        analytics.stub(window._dcq, 'push');
      });

      it('should send event as the action', function(){
        analytics.track('event');
        analytics.called(window._dcq.push, ['track', {
          action: 'event'
        }]);
      });

      it('should convert and alias revenue', function(){
        analytics.track('event', { revenue: 9.999 });
        analytics.called(window._dcq.push, ['track', {
          action: 'event',
          value: 1000
        }]);
      });
    });
  });
});