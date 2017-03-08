module.exports = {
    getBaseUrl : function(){
        return sails.config.globals.siteGeneral.baseUrl;
    },
    getQueryParamsFromObject : function(params){
        var str = "";
        for(var param in params){
            str += param + "=" + encodeURIComponent(params[param]) + "&";
        }
        if(!!str.length && str.substring(str.length-1) === "&"){
            str = str.substring(0, str.length-1);
        }
        return str; 
    },
    appendQueryParamToUrl : function(url, params){
        var paramStr = this.getQueryParamsFromObject(params);
        if(url.indexOf('?') > -1 ){
            url = (!!paramStr) ? url + "&" + paramStr : url;
        }else{
            url = (!!paramStr) ? url + "?" + paramStr : url;
        }
        return url;
    },
    getUserDetailsFromCookieStr : function(cookieStr){
        cookieStr = (!!cookieStr) ? cookieStr : '';
        var parsedCookies = cookieStr.split(';'),
            userCookieKeys = ['name', 'phone', 'userId','currency'],
            userDetails = {};
        
        parsedCookies.forEach(function(cookie){
            cookie = cookie.trim();
            var cookieSplit = cookie.split('=');
            if(userCookieKeys.indexOf(cookieSplit[0]) > -1){
                userDetails[cookieSplit[0]] = decodeURIComponent(cookieSplit[1]);
            }
        });
        return userDetails;
    }
};
