'use strict';

var listenToPlayerEvents = require('../helpers/listenToPlayerEvents');
require('../helpers/detectPlayersFromPage');

module.exports = function(settings, trigger) {
  listenToPlayerEvents.registerListener({
    state: 'TIME_PLAYED',
    triggerOnlyOnce: true,
    settings: settings,
    callback: trigger
  });
};
