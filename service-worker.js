"use strict";

/*globals self, toolbox*/

(function (self) {
    var OFFLINE_PAGE = '/offline.html';
    var precacheConfig = [].concat([
        '/manifest.json',
        '/offline.html',
        '/efetuar-pagamento',
        '/solicitar-pagamento',
        '/',
        '/entrar',
        '/cadastrar',
        '/scanner',
        '/client/css/scanner/scanner.css',
        "/client/js/jquery.js",
        "/client/js/usuario.js",
        "/client/js/credentials.js",
        "/client/js/index.js",
        "/client/js/scanner/scanner.js",
        "/client/js/qrcode.min.js",
        "/client/js/bootstrap.min.js",
        "/client/css/bootstrap.min.css",
        "/client/css/thumbnail-gallery.css",
        "/client/css/index.css",
        "/client/js/SmoothScroll.js",
        "/client/js/modernizr.custom.js",
        "/client/js/jquery.isotope.js",
        "/client/js/main.js",
        "/client/js/jqBootstrapValidation.js",
        "/client/css/font-awesome.min.css",
        "/client/css/font-awesome.min_OLD.css",
        "/client/css/style.css",   
        OFFLINE_PAGE,
        "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    ], /*TODO: dynamic */[]);
    var VERSION = '1.1.4'; //TODO: dynamic {{Factr_VERSION}}';
    var cacheName = 'Factr-client-' + VERSION + '-' + (self.registration ? self.registration.scope : '');

    var ignoreUrlParametersMatching = [/^utm_/];
    var shuldRespondForDynamicContent = [
        /svg|gif|webp|woff2|woff|ttf|eot|css|js|json|jpg|png$/
    ];

    var addDirectoryIndex = function (originalUrl, index) {
        var url = new URL(originalUrl);
        if (url.pathname.slice(-1) === '/') {
            url.pathname += index;
        }
        return url.toString();
    };

    var cleanResponse = function (originalResponse) {
        // If this is not a redirected response, then we don't have to do anything.
        if (!originalResponse.redirected) {
            return Promise.resolve(originalResponse);
        }
        // Firefox 50 and below doesn't support the Response.body stream, so we may
        // need to read the entire body to memory as a Blob.
        var bodyPromise = 'body' in originalResponse ?
            Promise.resolve(originalResponse.body) :
            originalResponse.blob();

        return bodyPromise.then(function (body) {
            // new Response() is happy when passed either a stream or a Blob.
            return new Response(body, {
                headers: originalResponse.headers,
                status: originalResponse.status,
                statusText: originalResponse.statusText
            });
        });
    };

    var createCacheKey = function (originalUrl, paramName, paramValue,
        dontCacheBustUrlsMatching) {
        // Create a new URL object to avoid modifying originalUrl.
        var url = new URL(originalUrl);
        // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
        // then add in the extra cache-busting URL parameter.
        if (!dontCacheBustUrlsMatching ||
            !(url.pathname.match(dontCacheBustUrlsMatching))) {
            url.search += (url.search ? '&' : '') +
                encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
        }

        return url.toString();
    };

    var isPathWhitelisted = function (whitelist, absoluteUrlString) {
        // If the whitelist is empty, then consider all URLs to be whitelisted.
        if (whitelist.length === 0) {
            return true;
        }
        // Otherwise compare each path regex to the path of the URL passed in.
        var path = (new URL(absoluteUrlString)).pathname;
        return whitelist.some(function (whitelistedPathRegex) {
            return path.match(whitelistedPathRegex);
        });
    };

    var stripIgnoredUrlParameters = function (originalUrl,
        ignoreUrlParametersMatching) {
        var url = new URL(originalUrl);
        // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
        url.hash = '';
        url.search = url.search.slice(1) // Exclude initial '?'
            .split('&') // Split into an array of 'key=value' strings
            .map(function (kv) {
                return kv.split('='); // Split each 'key=value' string into a [key, value] array
            })
            .filter(function (kv) {
                return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                    return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
                });
            })
            .map(function (kv) {
                return kv.join('='); // Join each [key, value] array into a 'key=value' string
            })
            .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

        return url.toString();
    };

    var checkDynamicImages = function (originalUrl, arrayOfRegex) {
        return arrayOfRegex.reduce(function (retorno, rgx) {
            if (rgx.test(originalUrl)) {
                retorno = true;
            }
            return retorno;
        }, false);
    };

    var hashParamName = '_sw-precache';
    var urlsToCacheKeys = new Map(
        precacheConfig.map(function (item) {
            var absoluteUrl;
            if (item.indexOf('https') === -1) {
                absoluteUrl = new URL(item, self.location);
            } else {
                absoluteUrl = item;
            }
            var cacheKey = createCacheKey(absoluteUrl, hashParamName, VERSION, false);
            return [absoluteUrl.toString(), cacheKey];
        })
    );

    function setOfCachedUrls(cache) {
        return cache.keys().then(function (requests) {
            return requests.map(function (request) {
                return request.url;
            });
        }).then(function (urls) {
            return new Set(urls);
        });
    }

    function fallback(request) {
        var res;
        if (request.method === 'GET') {
            var headers = request.headers.get('accept');
            if (headers.includes('text/html')) {
                res = OFFLINE_PAGE;
            } else if (headers.includes('image')) {
                res = OFFLINE_IMG;
            }
            res = [res].filter(filterValidUrls).map(mapParamToUrl);
            if (res.length) {
                res = res[0][1];
                return self.caches.open(cacheName).then(function (cache) {
                    return cache.match(new Request(new URL(res, self.location)));
                });
            }
        }
    }

    self.addEventListener('install', function (event) {
        event.waitUntil(
            self.caches.open(cacheName).then(function (cache) {
                return setOfCachedUrls(cache).then(function (cachedUrls) {
                    return Promise.all(
                        Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                            // If we don't have a key matching url in the cache already, add it.
                            if (!cachedUrls.has(cacheKey)) {
                                var request = new Request(cacheKey, { credentials: 'same-origin' });
                                return fetch(request).then(function (response) {
                                    // Bail out of installation unless we get back a 200 OK for
                                    // every request.
                                    if (!response.ok) {
                                        throw new Error('Request for ' + cacheKey + ' returned a ' +
                                            'response with status ' + response.status);
                                    }
                                    return cleanResponse(response).then(function (responseToCache) {
                                        return cache.put(cacheKey, responseToCache);
                                    });
                                });
                            }
                        })
                    );
                });
            }).then(function () {
                // Force the SW to transition from installing -> active state
                return self.skipWaiting();
            })
        );
    });

    self.addEventListener('activate', function (event) {
        var setOfExpectedUrls = new Set(urlsToCacheKeys.values());
        event.waitUntil(
            self.caches.open(cacheName).then(function (cache) {
                return cache.keys().then(function (existingRequests) {
                    return Promise.all(
                        existingRequests.map(function (existingRequest) {
                            if (!setOfExpectedUrls.has(existingRequest.url)) {
                                return cache.delete(existingRequest);
                            }
                        })
                    );
                });
            }).then(function () {
                return self.clients.claim();
            })
        );
    });

    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {
            // Should we call event.respondWith() inside this fetch event handler?
            // This needs to be determined synchronously, which will give other fetch
            // handlers a chance to handle the request if need be.
            var shouldRespond;
            // First, remove all the ignored parameters and hash fragment, and see if we
            // have that URL in our cache. If so, great! shouldRespond will be true.
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);
            // If shouldRespond is false, check again, this time with 'index.html'
            // (or whatever the directoryIndex option is set to) at the end.
            var directoryIndex = '/';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }
            // If shouldRespond is still false, check to see if this is a navigation
            // request, and if so, whether the URL matches navigateFallbackWhitelist.
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            if (!shouldRespond) {
                shouldRespond = checkDynamicImages(url, shuldRespondForDynamicContent);
            }

            shouldRespond = true;//cache everything to work offline

            // If shouldRespond was set to true at any point, then call
            // event.respondWith(), using the appropriate cache key.
            if (shouldRespond) {
                if (!urlsToCacheKeys.has(url)) {
                    urlsToCacheKeys.set(event.request.url);
                }
                event.respondWith(
                    self.caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url) || url).then(function (response) {
                            if (response) {
                                console.log('Serving content from cache', event.request.url);
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // Fall back to just fetch()ing the request if some unexpected error
                        // prevented the cached response from being valid.
                        console.log('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        // IMPORTANT: Clone the request. A request is a stream and
                        // can only be consumed once. Since we are consuming this
                        // once by cache and once by the browser for fetch, we need
                        // to clone the response.
                        var fetchRequest = event.request.clone();
                        return fetch(fetchRequest)
                            .then(function (response) {
                                // Check if we received a valid response
                                if (!response || response.status !== 200 || response.type !== 'basic') {
                                  console.log('Not saving in cache', fetchRequest.url);
                                  return response;
                                }

                                // IMPORTANT: Clone the response. A response is a stream
                                // and because we want the browser to consume the response
                                // as well as the cache consuming the response, we need
                                // to clone it so we have two streams.
                                var responseToCache = response.clone();
                                self.caches.open(cacheName).then(function (cache) {
                                    cache.put(event.request.url, responseToCache);
                                });
                                return response;
                            })
                            .catch(function () {
                                return fallback(event.request);
                            });
                    })
                );
            } else {
                if (event.request.url.indexOf((self.registration ? self.registration.scope : '')) > -1) {
                    return fetch(event.request.url)
                        .catch(function () {
                            return fallback(event.request);
                        });
                }
            }
        }
    });

    //TODO: add sw-toolbox here
    //   toolbox.router.get(/^https:\/\/connect\.facebook\.net/, toolbox.cacheFirst, {});
    //   toolbox.router.get(/^https:\/\/cdn\.onesignal\.com/, toolbox.cacheFirst, {});
    //   toolbox.router.get(/^https:\/\/\google\.com\.br/, toolbox.cacheFirst, {});
    //   toolbox.router.get(/^https:\/\/\google-analytics\.com/, toolbox.cacheFirst, {});

})(self);