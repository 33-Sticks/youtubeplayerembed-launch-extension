'use strict';

var window = require('@adobe/reactor-window');
var capturedPlayers = require('./capturedPlayers');

var listeners = [];
var timePlayedTimeoutId = null;

var clearTimePlayedTimeout = function() {
  window.clearInterval(timePlayedTimeoutId);
  timePlayedTimeoutId = null;
};

var clearListeners = function() {
  for (var i = listeners.length - 1; i >= 0; i--) {
    if (listeners[i].triggered && listeners[i].triggerOnlyOnce) {
      listeners.splice(i, 1);
    }
  }
};

var timeConstraintAreMet = function(settings, player) {
  if (player.getPlayerState() !== window.YT.PlayerState.PLAYING) {
    return false;
  }

  if (settings.unit === 'second') {
    return player.getCurrentTime() >= settings.amount;
  }

  return Math.floor((player.getCurrentTime() / player.getDuration()) * 100) >= settings.amount;
};

var initializeTimePlayedTimeout = function() {
  if (timePlayedTimeoutId) {
    return;
  }

  timePlayedTimeoutId = window.setInterval(function() {
    clearListeners();

    var timePlayedListeners = listeners.filter(function(listener) {
      return listener.state === 'TIME_PLAYED';
    });

    if (timePlayedListeners.length === 0) {
      clearTimePlayedTimeout();
      return;
    }

    capturedPlayers.forEach(function(player) {
      var event = {
        target: player,
        data: 'TIME_PLAYED'
      };

      onStateChange(event);
    });
  }, 5000);
};

var onStateChange = function(event) {
  var playerId = event.target.getIframe().id;
  var state = detectPlayingState(event.data);

  listeners.filter(function(listener) {
    if (listener.state !== state) {
      return false;
    }

    if (listener.settings.playerId && listener.settings.playerId !== playerId) {
      return false;
    }

    if (state === 'TIME_PLAYED') {
      if (!timeConstraintAreMet(listener.settings, event.target)) {
        return false;
      }
    }

    return true;
  }).forEach(function(listener) {
    listener.callback(event.target, event);
    listener.triggered = true;
  });
};

var detectPlayingState = function(data) {
  if (typeof data !== 'number') {
    return data;
  }

  return Object.keys(window.YT.PlayerState).filter(function(key) {
    return window.YT.PlayerState[key] === data;
  })[0];
};

module.exports = {
  registerListener: function(listener) {
    if (listener.state === 'TIME_PLAYED') {
      initializeTimePlayedTimeout();
    }

    listeners.push(listener);
  },
  onStateChange: onStateChange
};
