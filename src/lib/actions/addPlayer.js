'use strict';

var document = require('@adobe/reactor-document');
var objectAssign = require('@adobe/reactor-object-assign');
var youtubeIframeAPIReadyPromise = require('../helpers/loadYoutubePlayerIframeApi');
var generatePlayerId = require('../helpers/generatePlayerId');
var capturedPlayers = require('../helpers/capturedPlayers');

var getParentContainer = function(selector) {
  var parent = document.querySelector(selector);

  if (!parent) {
    turbine.logger.error('Cannot add player to the page. Player parent DOM element not found.');
    return;
  }

  return parent;
};

var createPlayerContainer = function(parent, playerIdSettings) {
  var div = document.createElement('div');

  if (playerIdSettings.type === 'default') {
    div.id = generatePlayerId();
  } else {
    div.id = playerIdSettings.value;
  }

  return div;
};

var transformPlayerParameters = function(videoSettings, playerSettings, videoTimings) {
  var settings = {
    playerVars: objectAssign({}, videoTimings, {
      color: playerSettings.color,
      controls: Number(playerSettings.controls),
      fs: Number(playerSettings.fs),
      'iv_load_policy': playerSettings.showVideoAnnotations ? 1 : 3,
      rel: Number(playerSettings.rel),
      enablejsapi: 1
    })
  };

  if (playerSettings.hasOwnProperty('autoPlay')) {
    settings.playerVars.autoplay = Number(playerSettings.autoPlay);
  }

  if (playerSettings.hasOwnProperty('ccLoadPolicy')) {
    settings.playerVars['cc_load_policy'] = Number(playerSettings.ccLoadPolicy);
  }

  if (playerSettings.hasOwnProperty('disableKb')) {
    settings.playerVars.disablekb = Number(playerSettings.disableKb);
  }

  if (playerSettings.hasOwnProperty('loop')) {
    settings.playerVars.loop = Number(playerSettings.loop);
  }

  if (playerSettings.hasOwnProperty('modestBranding')) {
    settings.playerVars.modestbranding = Number(playerSettings.modestBranding);
  }

  if (playerSettings.hasOwnProperty('showInfo')) {
    settings.playerVars.showinfo = Number(playerSettings.showInfo);
  }

  switch (videoSettings.type) {
    case 'search':
      settings.playerVars = {
        list: videoSettings.query,
        listType: 'search'
      };

      break;
    case 'playlist':
      settings.playerVars = {
        list: videoSettings.playlistId,
        listType: 'playlist'
      };

      break;
    default:
      settings.videoId = videoSettings.videoId;
  }

  return settings;
};

var createPlayer = function(YT, playerId, settings) {
  var playerSettings = objectAssign(
    {},
    settings.dimensions,
    transformPlayerParameters(settings.videoDetails, settings.parameters, settings.videoTimings)
  );

  turbine.logger.log('Creating the player `' + playerId + '` with the following parameters: '
    + JSON.stringify(playerSettings));

  new YT.Player(playerId, playerSettings);
};

module.exports = function(settings) {
  youtubeIframeAPIReadyPromise.then(function(YT) {
    var parent = getParentContainer(settings.videoDetails.elementSelector);
    if (parent) {
      var playerContainer = createPlayerContainer(parent, settings.playerId);
      parent.appendChild(playerContainer);

      createPlayer(YT, playerContainer.id, settings);
    }
  }, function() {
    turbine.logger.error('Cannot add player to the page. Youtube Player Iframe Api not found.');
  });
};
