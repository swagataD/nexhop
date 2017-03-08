(module.exports = {
    setUser : function(userDetails){
//        console.log('set User Called');
//        console.log(userDetails);
        this.userId = (!!userDetails && !!userDetails.userId) ? userDetails.userId : '-1';
        //this.currency = userDetails.currency;
        return this;
    },
    
    init: function () {
        this.httpService = require(sails.config.globals.apiSettings.serviceProtocol);
        return this;
    },
    
    makeRequest: function (requestOptions) {
        var url = require('url'),
            that = this;
        requestOptions.params = (!!requestOptions.params) ? requestOptions.params : {};
        //requestOptions.params['City'] = 'Toronto';
        var serviceDetails = {};
        if (!!requestOptions.endPoint && !!sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()] && !!sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()].url) {
            var url = sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()].url;
            serviceDetails.url = ((typeof url) === 'string') ? url : url(requestOptions.urlVars);
            serviceDetails.url = encodeURI(sails.config.globals.apiSettings.apiMainEndpoint + serviceDetails.url);
            serviceDetails.method = (!!sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()].method) ? sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()].method : 'GET';
        } else {
            return;
        }
        var options = {
            hostname: sails.config.globals.apiSettings.serviceBaseUrl,
            port: (sails.config.globals.apiSettings.serviceProtocol == 'https') ? 443 : 80,
            path: (serviceDetails.method == 'GET') ? UtilsService.appendQueryParamToUrl(serviceDetails.url, requestOptions.params) : serviceDetails.url,
            method: serviceDetails.method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': sails.config.globals.apiSettings.apiKey,
                'user_id': that.userId,
                'lat' : sails.config.globals.apiSettings.latitude,
                'lon': sails.config.globals.apiSettings.longitude
            }
        };
        console.log(options);
        if (serviceDetails.method == 'GET') {
            this.httpService.request(options, function (response) {
                var responseData = '';
                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    responseData += chunk;
                });

                response.once('error', function (err) {
                    // Some error handling here, e.g.:
                    if (!!requestOptions.error) {
                        requestOptions.error();
                    }
                });

                response.on('end', function () {
                    try {
                        // response available as `responseData` in `yourview`
                        //res.locals.requestData = JSON.parse(responseData);
                        if (!!requestOptions.done) {
                            requestOptions.done(JSON.parse(responseData));
                        }
                    } catch (e) {
                        sails.log.warn('Could not parse response from options.hostname: ' + e);
                    }
                });
            }).end();
        }else {
            var request = require('request'),
                requestName = (!!(serviceDetails.method == 'PUT')) ? request.put : (!!(serviceDetails.method == 'DELETE')) ? request.del : request;
            
            requestName({
                url: sails.config.globals.apiSettings.serviceProtocol + '://' + sails.config.globals.apiSettings.serviceBaseUrl + serviceDetails.url,
                method: serviceDetails.method,
                json: true,
                body: (!!requestOptions.params) ? requestOptions.params : {},
                headers: options.headers,
            }, function (error, response, body) {
                if (error)
                    return response.send(error, 500);
                if (!!response && !!response.body) {
                    requestOptions.done(response.body);
                }
            });
        }
    },
    
    deferredApiRequest: function (requestOptions) {
        var Q = require('q'),
            deferred = Q.defer(),
            that = this;

        requestOptions.params = (!!requestOptions.params) ? requestOptions.params : {};
        //requestOptions.params['City'] = 'Toronto';
        var serviceDetails = {};
        if (!!requestOptions.endPoint && !!sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()] && !!sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()].url) {
            var url = sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()].url;
            serviceDetails.url = ((typeof url) === 'string') ? url : url(requestOptions.urlVars);
            serviceDetails.url = encodeURI(sails.config.globals.apiSettings.apiMainEndpoint + serviceDetails.url);
            serviceDetails.method = (!!sails.config.globals.apiSettings.apiEndPoints[requestOptions.endPoint.toUpperCase()].method) ? sails.config.globals.apiSettings.apiEndPoints[endPoint.toUpperCase()].method : 'GET';
        } else {
            return;
        }
        var options = {
            hostname: sails.config.globals.apiSettings.serviceBaseUrl,
            port: (sails.config.globals.apiSettings.serviceProtocol == 'https') ? 443 : 80,
            path: (serviceDetails.method == 'GET') ? UtilsService.appendQueryParamToUrl(serviceDetails.url, requestOptions.params) : serviceDetails.url,
            method: serviceDetails.method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': sails.config.globals.apiSettings.apiKey,
                'user_id': that.userId,
                'lat' : sails.config.globals.apiSettings.latitude,
                'lon': sails.config.globals.apiSettings.longitude
            }
        };
//        console.log('options');
//        console.log(options);
        console.log(options.path);
        this.httpService.request(options, function (response) {
            var responseData = '';
            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                responseData += chunk;
            });

            response.once('error', function (err) {
                deferred.reject(err);
            });

            response.on('end', function () {
                try {
//                        console.log('responseData');
//                        console.log(responseData);
                    deferred.resolve(responseData);
                } catch (e) {
                    sails.log.warn('Could not parse response from options.hostname: ' + e);
                }
            });
        }).end();
        return deferred.promise;
    },
    
    promise: function (promises) {
        //Constructor function.. Must be initialised..
        this.promises = (promises instanceof  Array) ? promises : [];
        this.push = function (request) {
            this.promises.push(request);
            return this;
        };
        this.makeRequest = function (callback) {
            var Q = require('q'),
                    requestQueue = [];
            this.promises.forEach(function (request) {
                if (request && !!request.endPoint) {
//                    console.log('promise');
//                    console.log(request);
                    requestQueue.push(
                        ApiService.deferredApiRequest(request).then(function (data) {
                            return data;
                        })
                    );
                }
            });
            var argumentListStr = '',
                argumentAssignStr = '';

            for (var i = 1; i <= this.promises.length; i++) {
                argumentListStr += "resp" + i + ",";
                argumentAssignStr += "response[" + Number(i - 1) + "] = resp" + i + ";";
            }
            argumentListStr = argumentListStr.substring(0, argumentListStr.length - 1);
            var callbackEvalStr = "Q.all(requestQueue).spread(function(" + argumentListStr + "){var response = [];" + argumentAssignStr + "callback(response)});";
            eval(callbackEvalStr);
        };
    }
}).init();

