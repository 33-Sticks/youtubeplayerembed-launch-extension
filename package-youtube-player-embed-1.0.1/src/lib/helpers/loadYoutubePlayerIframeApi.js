'use strict';

var window = require('@adobe/reactor-window');
var loadScript = require('@adobe/reactor-load-script');
var Promise = require('@adobe/reactor-promise');
var ytProxy = require('../helpers/ytProxy');

var loadScriptPromise = loadScript('https://www.youtube.com/iframe_api');

var youtubeIframeAPIReadyPromise = new Promise(function(resolve, reject) {
  if (window.YT) {
    resolve(ytProxy.registerProxy(window.YT));
    return;
  }

  window.onYouTubeIframeAPIReady = function() {
    resolve(ytProxy.registerProxy(window.YT));
  };

  loadScriptPromise.then(null, reject);
});

youtubeIframeAPIReadyPromise.catch(function(e) {
  turbine.logger.error('Cannot load Youtube Player Iframe Api script. ' + e);
});

module.exports = youtubeIframeAPIReadyPromise;

