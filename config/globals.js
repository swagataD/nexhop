/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.globals.html
 */
module.exports.globals = {
    //fb_app_id : 260410697741483
    //Custom configurations
    siteGeneral : {
        baseUrl : 'http://localhost:8081'
    },
    
    apiSettings : {
        serviceProtocol : 'https',
        serviceBaseUrl : 'q18wjbxin3.execute-api.ap-southeast-1.amazonaws.com',
        apiKey : 'XTORY9bV3q1a7JTatB1XG4OabKrYEAHga2OEDfma',
        latitude :'12.970000',
        longitude :'77.750000',
        apiMainEndpoint : '/dev/',
        apiEndPoints : {
            HOME : {
                url : 'home'
            },
            CATEGORIES : {
                url : 'categories'
            },
            ADDTOCART : {
                url : 'cart',
                method : 'POST'
            },
            CART : {
                url : 'cart'
            },
            DELFROMCART : {
                url : 'cart',
                method : 'DELETE'
            },
            PRODUCTLIST : {
                url : function(urlVars){
                    return 'categories/' + urlVars.categoryId + '/products';
                }
            },
            SUBCATLIST : {
                url : function(urlVars){
                    return 'home/' + urlVars.categoryId ;
                }
            },
            PRODUCTDTL : {
                url : function(urlVars){
                    return 'stores/' + urlVars.shopId + '/products/'+urlVars.prodId;
                }
            },
            STOREPROD : {
                url : function(urlVars){
                    return 'stores/' + urlVars.shopId + '/products';
                }
            },
            USERLOGIN : {
                url : 'customers/login',
                method : 'POST'
            },
            USERSIGNUP : {
                url : 'customers',
                method : 'POST'
            },
            FORGETPASSWORD : {
                url : 'customers/forgot_password',
                method : 'POST'
            }
            ,OTPVALIDATE : {
                url : 'otp/validate',
                method : 'PUT'
            }
        }
    }

  /****************************************************************************
  *                                                                           *
  * Expose the lodash installed in Sails core as a global variable. If this   *
  * is disabled, like any other node module you can always run npm install    *
  * lodash --save, then var _ = require('lodash') at the top of any file.     *
  *                                                                           *
  ****************************************************************************/

	// _: true,

  /****************************************************************************
  *                                                                           *
  * Expose the async installed in Sails core as a global variable. If this is *
  * disabled, like any other node module you can always run npm install async *
  * --save, then var async = require('async') at the top of any file.         *
  *                                                                           *
  ****************************************************************************/

	// async: true,

  /****************************************************************************
  *                                                                           *
  * Expose the sails instance representing your app. If this is disabled, you *
  * can still get access via req._sails.                                      *
  *                                                                           *
  ****************************************************************************/

	// sails: true,

  /****************************************************************************
  *                                                                           *
  * Expose each of your app's services as global variables (using their       *
  * "globalId"). E.g. a service defined in api/models/NaturalLanguage.js      *
  * would have a globalId of NaturalLanguage by default. If this is disabled, *
  * you can still access your services via sails.services.*                   *
  *                                                                           *
  ****************************************************************************/

	// services: true,

  /****************************************************************************
  *                                                                           *
  * Expose each of your app's models as global variables (using their         *
  * "globalId"). E.g. a model defined in api/models/User.js would have a      *
  * globalId of User by default. If this is disabled, you can still access    *
  * your models via sails.models.*.                                           *
  *                                                                           *
  ****************************************************************************/

	// models: true
        
    
};
