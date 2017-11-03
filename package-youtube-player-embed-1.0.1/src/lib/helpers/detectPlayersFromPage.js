'use strict';

var document = require('@adobe/reactor-document');
var youtubeIframeAPIReadyPromise = require('./loadYoutubePlayerIframeApi');
var capturedPlayers = require('./capturedPlayers');
var generatePlayerId = require('./generatePlayerId');
var listenToPlayerEvents = require('./listenToPlayerEvents');

var detectIframesInPage = function(YT) {
  var playersInPage = document.querySelectorAll('iframe[src^="https://www.youtube.com/embed"]');

  if (playersInPage) {
    playersInPage.forEach(captureIframeFromPage.bind(null, YT));
  }
};

var captureIframeFromPage = function(YT, iframe) {
  var playerId = getIframeId(iframe);
  enableJsApiForIframe(iframe);

  capturedPlayers.registerPlayer(
    playerId,
    new YT.Player(playerId)
  );
};

var getIframeId = function(iframe) {
  var iframeId = iframe.id;

  if (!iframeId) {
    iframeId = generatePlayerId();
    iframe.setAttribute('id', iframeId);
  }

  return iframeId;
};

var enableJsApiForIframe = function(iframe) {
  var src = iframe.src;
  if (src.indexOf('enablejsapi') === -1) {
    if (src.indexOf('?') > -1) {
      src += '&enablejsapi=1';
    } else {
      src += '?enablejsapi=1';
    }
  }

  iframe.setAttribute('src', src);
};

document.addEventListener('DOMContentLoaded', function() {
  youtubeIframeAPIReadyPromise.then(function(YT) {
    detectIframesInPage(YT);
  });
});
