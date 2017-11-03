'use strict';

var capturedPlayers = require('./capturedPlayers');
var listenToPlayerEvents = require('./listenToPlayerEvents');

var addPlayerEvents = function(args) {
  if (!args) {
    args = {};
  }

  if (!args.events) {
    args.events = {};
  }

  if (!args.events.onStateChange) {
    args.events.onStateChange = listenToPlayerEvents.onStateChange;
  } else {
    args.events.onStateChange = (function(previousOnStateChange) {
      return function(event) {
        listenToPlayerEvents.onStateChange(event);
        previousOnStateChange(event);
      };
    })(args.events.onStateChange);
  }

  return args;
};

module.exports = {
  originalFn: null,

  registerProxy: function(YT) {
    var originalFn = YT.Player;

    YT.Player = function(id, args) {
      var player = new originalFn(id, addPlayerEvents(args));
      capturedPlayers.registerPlayer(id, player);

      return player;
    };

    YT.Player.prototype = originalFn.prototype;

    YT.Player.D = originalFn.D;
    YT.Player.W = originalFn.W;

    this.originalFn = originalFn;

    return YT;
  }
};
