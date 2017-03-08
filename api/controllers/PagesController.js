module.exports = {
    commons : function(param){
        var Q = require('q'),
            deferred = Q.defer();
        ApiService.setUser(param.req.userDetails);

        new ApiService.promise([
            {endPoint : 'cart'}
        ])
        .makeRequest(function(resp){
            var parsedResp = [];
            for(var i = 0; i < resp.length; i++){
                parsedResp[i] = JSON.parse(resp[i]);
            };
            
            var cartCount = (!!parsedResp[0] && !!parsedResp[0].status && !!parsedResp[0].cart_count) ? parsedResp[0].cart_count : 0;
            var cartHome = (!!parsedResp[0] && !!parsedResp[0].status && !!parsedResp[0].data) ? parsedResp[0].data : [];
            var data = {
                cartCount : cartCount,
                cartHome : cartHome,
                pageType : null,
                baseUrl : UtilsService.getBaseUrl(),
                nextPage : false,
            };
            deferred.resolve(data);
        });
        return deferred.promise;
    },
    
    home: function(req, res) {
        
        this.commons({
            req : req
        }).then(function(data){
            new ApiService.promise([
                {endPoint : 'home'},
                {endPoint : 'categories'}
            ])
            .makeRequest(function(resp){
                var homeScreenData = JSON.parse(resp[0]),
                    categories = JSON.parse(resp[1]);
                    
                data.homeScreenData = (!!homeScreenData && !!homeScreenData.status && !!homeScreenData.data) ? homeScreenData.data : [];
                data.banner = (!!homeScreenData && (homeScreenData.data[0].type === 'banner')) ? homeScreenData.data[0].items : [];
                data.stores = (!!homeScreenData && (homeScreenData.data[1].type === 'stores')) ? homeScreenData.data[1].items : [];
                data.products = (!!homeScreenData && (homeScreenData.data[2].type === 'products')) ? homeScreenData.data[2].items : [];
                data.categories = (!!categories && !!categories.status && !!categories.data) ? categories.data : [];
                res.view('landingpages/home', data);
            });
        });
    },
    
    productList : function(req, res){
        var category = (!!req.param('category')) ? req.param('category') : null ;
 //       console.log(category);
        this.commons({
            req : req
        }).then(function(data){
            new ApiService.promise([
                {
                    endPoint : 'productlist', 
                    params : {start : 0},       //see later
                    urlVars :   {
                        categoryId : category
                    }
                }
            ])
            .makeRequest(function(resp){
                var productList = JSON.parse(resp[0]);
                    console.log(productList);
                //data.breadcrumbs = ['Blogs'];
                data.productList = (!!productList && !!productList.status && !!productList.data) ? productList.data : {};
                return res.view('landingpages/product_listing', data);
            });
        });
    },
    
    subCategoryList : function(req, res){
        var category = (!!req.param('categoryId')) ? req.param('categoryId') : null ;
        console.log(category);
        this.commons({
            req : req
        }).then(function(data){
            new ApiService.promise([
                {
                    endPoint : 'subcatlist', 
                    urlVars :   {
                        categoryId : category
                    }
                }
            ])
            .makeRequest(function(resp){
                var subCatList = JSON.parse(resp[0]);
                //data.breadcrumbs = ['Blogs'];
                data.subCatList = (!!subCatList && !!subCatList.status && !!subCatList.data) ? subCatList.data : [];
                data.subCatData = (!!subCatList && !!subCatList.status && !!subCatList.data) ? subCatList.data[0] : {};
                data.newArrivalData = (!!subCatList && !!subCatList.status && !!subCatList.data) ? subCatList.data[1] : {};
                data.productsData = (!!subCatList && !!subCatList.status && !!subCatList.data) ? subCatList.data[2] : {};
                data.bestSellerData = (!!subCatList && !!subCatList.status && !!subCatList.data) ? subCatList.data[3] : {};
                return res.view('landingpages/category_listing', data);
            });
        });
    },
    
    productListByShopId : function(req, res){
        var shopId = (!!req.param('shopId')) ? req.param('shopId') : null ;
        console.log(shopId);
        this.commons({
            req : req
        }).then(function(data){
            new ApiService.promise([
                {
                    endPoint : 'storeprod',
                    params : {start : 0},
                    urlVars :   {
                        shopId : shopId
                    }
                }
            ])
            .makeRequest(function(resp){
                var storeData = JSON.parse(resp[0]);
//                console.log(storeData.store_details);
//                console.log(storeData.product);
                //data.breadcrumbs = ['Blogs'];
                data.storeDetail = (!!storeData && !!storeData.store_details) ? storeData.store_details : [];
                data.storeProduct = (!!storeData && !!storeData.product) ? storeData.product : [];
                return res.view('landingpages/shop_prod_list', data);
            });
        });
    },
    
    productDetails : function(req, res){
        var storeId = (!!req.param('storeId')) ? req.param('storeId') : null ;
        var prodId = (!!req.param('prodId')) ? req.param('prodId') : null ;
        console.log(storeId+' '+prodId);
        this.commons({
            req : req
        }).then(function(data){
            new ApiService.promise([
                {
                    endPoint : 'productdtl',
                    urlVars :   {
                        shopId : storeId,
                        prodId : prodId
                    }
                }
            ])
            .makeRequest(function(resp){
                var productDtl = JSON.parse(resp[0]);
//                console.log(productDtl.data);
                data.productDtl = (!!productDtl && !!productDtl.status && !!productDtl.data) ? productDtl.data : {};
                data.productImg = (!!productDtl && !!productDtl.status && !!productDtl.data.images) ? productDtl.data.images : [];
                res.view('landingpages/product_details', data);
            });  
        });
    },
    
    addressSelect : function(req, res){
        var data = {};
            data.name = "swagata";
            res.view('user-pages/address_select', data); 
    },
    
    deliveryAddress : function(req, res){
        res.view('user-pages/delivery_address', {});
    },
    
    payment : function(req, res){
        res.view('user-pages/payment', {});
    },
    
    addToCart : function(req, res){
        //console.log(req.body);
        ApiService.makeRequest({
            endPoint : 'addtocart',
            params :   {
                quantity : req.body.quantity,
                productId : req.body.productId,
                shopId : req.body.shopId,
                price : req.body.price
            },
            done : function(response){
                console.log(response);
                if(!!(response.status == 'SUCCESS')){
                    res.json(200,{  status : true, 
                                    message : response.message});
                }else if(!(response.status == 'SUCCESS')){
                    res.json(200,{status : false,
                                  error : response.message});
                }
            }
        });
    },
    
    cartDetail : function(req, res){
        this.commons({
            req : req
        }).then(function(data){
            new ApiService.promise([
                {endPoint : 'cart'}
            ])
            .makeRequest(function(resp){
                var cart = JSON.parse(resp[0]);
                console.log(cart);
                data.cart = (!!cart && !!cart.status && !!cart.data) ? cart.data : [];
                res.view('user-pages/cart_detail', data);
            });  
        });
    },

    deleteFromCart : function(req, res){
        ApiService.makeRequest({
            endPoint : 'delfromcart',
            params :   {
                quantity : req.body.quantity,
                productId : req.body.productId,
                shopId : req.body.shopId
            },
            done : function(response){
//                console.log('response from DELETE method');
//                console.log(response);             
                if(!!(response.status == 'SUCCESS')){
                    res.json(200,{  status : true, 
                                    message : response.message});
                }else if(!(response.status == 'SUCCESS')){
                    res.json(200,{status : false,
                                  error : response.message});
                }
            }
        });
    },

    userLogin : function(req, res){
        var that = this;
        //console.log(req.body);
        ApiService.makeRequest({
            endPoint : 'userlogin',
            params :   {
                email_address : req.body.emailAddress,
                password : req.body.password,
                facebook_id : req.body.facebookId,
                device_token : req.body.deviceToken,
                device_os : req.body.deviceOs
            },
            done : function(response){
                //console.log(response);
                if(!!(response.status == "SUCCESS")){
                    var userData = response;
//                    console.log('userData');
//                    console.log(userData);
                    that.setUserSession(req, userData);
                    res.cookie('userId', userData.data.customer_id);
                    res.cookie('name', userData.data.firstname+' '+userData.data.lastname);
                    //return res.send('<script>window.location.assign("'+ UtilsService.getBaseUrl() +'")</script>');
                    //return res.send('<script>window.location.reload();</script>');
                    res.json(200,{status : true, data: response});
                }else if(!(response.status == "SUCCESS")){
                    res.json(200,{status : false,
                                  error : response.error});
                }
            }
        });
    },
    
    userSignUp : function(req, res){
        var that = this;
        //console.log(req.body);
        ApiService.makeRequest({
            endPoint : 'usersignup',
            params :   {
                first_name : req.body.firstName,
                last_name : req.body.lastName,
                email_address : req.body.emailAddress,
                password : req.body.password,
                facebook_id : '',
                device_token : '',
                device_os : 'Android'
            },
            done : function(response){
//                console.log(response);
                if(!!(response.status == "SUCCESS")){
                    var userData = response;
                    that.setUserSession(req, userData);
                    res.cookie('userId', userData.data.customer_id);
                    res.cookie('name', userData.data.first_name+' '+userData.data.last_name);
                    //return res.send('<script>window.location.assign("'+ UtilsService.getBaseUrl() +'")</script>');
                    res.json(200,{status : true, data: response});
                }else if(!(response.status == "SUCCESS")){
                    res.json(200,{status : false,
                                  error : response.error});
                }
            }
        });
    },
    
    setUserSession : function(req,userData){
        req.session.userDetail = userData;         
//        console.log('req.session');
//        console.log(req.session.userDetail);
    },
    
    forgetPassword : function(req, res){
        //console.log(req.body);
        ApiService.makeRequest({
            endPoint : 'forgetpassword',
            params :   {
                emailId : req.body.emailId
            },
            done : function(response){
//                console.log(response);
                if(!!(response.status == "SUCCESS")){
                    res.json(200,{status : true, data: response});
                }else if(!(response.status == "SUCCESS")){
                    res.json(200,{status : false,
                                  error : response.error});
                }
            }
        });
    },
    
    otpValidate : function(req, res){
        ApiService.makeRequest({
            endPoint : 'otpvalidate',
            params :   {
                otp_code : req.body.otpCode
            },
            done : function(response){
                if(!!(response.status == 'SUCCESS')){
                    res.json(200,{  status : true, 
                                    message : response.message});
                }else if(!(response.status == 'SUCCESS')){
                    res.json(200,{status : false,
                                  error : response.message});
                }
            }
        });
    }
};