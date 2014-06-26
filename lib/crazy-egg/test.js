
var Analytics = require('analytics').constructor;
var integration = require('analytics.js-integration');
var tester = require('../../test/plugin');
var plugin = require('./');

describe('Crazy Egg', function(){
  var CrazyEgg = plugin.Integration;
  var crazyegg;
  var analytics;
  var options = {
    accountNumber: '00138301'
  };

  beforeEach(function(){
    analytics = new Analytics;
    crazyegg = new CrazyEgg(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(crazyegg);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    crazyegg.reset();
  });

  it('should have the right settings', function(){
    var Test = integration('Crazy Egg')
      .assumesPageview()
      .readyOnLoad()
      .global('CE2')
      .option('accountNumber', '');

    analytics.validate(CrazyEgg, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(crazyegg, 'load');
    });

    afterEach(function(){
      crazyegg.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(crazyegg.load);
      });
    });

    describe('#loaded', function(){
      it('should test window.CE2', function(){
        analytics.assert(!crazyegg.loaded());
        window.CE2 = {};
        analytics.assert(crazyegg.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(crazyegg, done);
    });
  });
});