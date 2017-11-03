'use strict';

var capturedPlayers = {};

module.exports = {
  registerPlayer: function(id, player) {
    if (!capturedPlayers[id]) {
      capturedPlayers[id] = player;
    }
  },
  getPlayer: function(id) {
    return capturedPlayers[id];
  },
  forEach: function(cb) {
    Object.keys(capturedPlayers).forEach(function(playerId) {
      cb(this.getPlayer(playerId));
    }, this);
  }
};
