function closeDownloadPopup(){
    window.sessionStorage.setItem('download-app-popup-closed',true);
    window.location.reload();
}

var ub = ub || {};

(function(window, document, $, undefined){
    ub.pageIndex = 0;
    ub.resetPageIndex = function(){
        ub.pageIndex = 0;
        ub.addQueryParamToUrl({
            start : ub.pageIndex
        });
    };
    $(document).ready(function(){        
        //var $val = $(this);
        //$(document).on('click','.js-add-cart',function(e, cb){
        $('.js-add-cart').click(function(e){
            e.preventDefault();
            var quantity = $(this).attr('quantity'),
                productId = $(this).attr('productId'),
                shopId = $(this).attr('shopId'),
                price = $(this).attr('price');
                
            $.ajax({
                type: 'POST',
                url: '/addToCart',
                data : {
                    quantity    : quantity,
                    productId    : productId,
                    shopId     : shopId,
                    price    : price
                },
                success: function(resp){
                    console.log(resp);
                    if(resp == 'SUCCESS'){
                        window.location.assign('');
                    }
                }
            });
        });
        
        $('#js-user-signup-form').submit(function(e){
            //console.log('okkkk');
            e.preventDefault();
            var $form = $(this),
                
                firstName = ($form.find('[name="firstName"]')).val(),
                lastName = ($form.find('[name="lastName"]')).val(),
                emailAddress = ($form.find('[name="emailAddress"]')).val(),
                password = ($form.find('[name="password"]')).val();
                
            $.ajax({
                type: 'POST',
                url: '/userSignUp',
                data : {
                    firstName   : firstName,
                    lastName    : lastName,
                    emailAddress: emailAddress,
                    password    : password
                },
                success: function(resp){
//                    console.log(resp);
                    if(!!resp.status){
                        //window.location.assign('');
                        window.location.reload();
                    }
                }
            });
        });
        
        $('#js-user-login-form').submit(function(e){
            //console.log('okkkk');
            e.preventDefault();
            var $form = $(this),
                
                emailAddress = ($form.find('[name="emailAddress"]')).val(),
                password = ($form.find('[name="password"]')).val();
                
            $.ajax({
                type: 'POST',
                url: '/userLogin',
                data : {
                    emailAddress: emailAddress,
                    password    : password
                },
                success: function(resp){
                    //console.log(resp);
                    if(!!resp.status){
                        //window.location.assign('');
                        window.location.reload();
                    }
                }
            });
        });
        
        $('#js-forget-password').click(function(e){
            //console.log('okkkk');
            e.preventDefault();
            var $form = $(this),
                
                emailAddress = ($form.find('[name="emailAddress"]')).val();
                
            $.ajax({
                type: 'POST',
                url: '/forgetPassword',
                data : {
                    emailAddress: emailAddress
                },
                success: function(resp){
//                    console.log(resp);
                    if(resp == 'SUCCESS'){
                        window.location.assign('');
                    }
                }
            });
        });
        
        $('#js-user-login-fb').click(function(e){
            e.preventDefault();
            
            window.fbAsyncInit = function() {
                //alert();
                FB.init({
                  appId      : '260410697741483',
                  xfbml      : true,
                  version    : 'v2.8'
                });
                
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        FB.api('/me?fields=id,name,gender,email', function(response) {
                            //console.log('Good to see you, i m from connected ' + response.name + '.');
                            console.log(response);
                        }, {scope: 'email'});
                    }
                    else {
                        FB.login(function(response) {
                            if (response.authResponse) {
                                console.log('Welcome!  Fetching your information.... ');
                                FB.api('/me?fields=id,name,gender,email', function(response) {
                                    //console.log('Good to see you, ' + response.name + '.');
                                    console.log(response);
                                });
                            } else {
                                console.log('User cancelled login or did not fully authorize.');
                            }
                        }, {scope: 'email'});
                    }
                });
                FB.AppEvents.logPageView();
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
            
            //window.location.href='http://localhost:8081/';
        });
        
        //For setting currency..
//        var currency = ub.cookie.read('currency'),
//            $currencySelect = $('#js-currency-select');
//        
//        if(!!currency){
//            $currencySelect.find('option[value="'+ currency +'"]').prop('selected', true);
//        }
//        
//        $currencySelect.change(function(e){
//            ub.cookie.create('currency', $(this).val());
//            window.location.reload();
//        });
        var currency = ub.cookie.read('currency');
        if(!currency){
            $.getJSON("http://freegeoip.net/json/", function(result){
                if(!!result && !!result.country_code){
                    ub.cookie.create('currency', result.country_code);
                }
            });
        }
        
        
        var $login = $('.js-user-login');
        
        $('.js-product-image-thumb').click(function(e){
            e.preventDefault();
            $(this).closest('li').addClass('thumbAc').siblings().removeClass('thumbAc');
            $('.js-product-main-image').attr('src', $(this).find('img').attr('src'));
        });
        
        $login.click(function(){
            var $that = $(this);
            ub.getLogin(function(){
                window.location.reload();
            });
        });
        
        $('.tog_city').click(function(){
            $('.cities_list').slideToggle(150);
            $('.user_mnu').css('display', 'none');
        });

        $('.user_repo').click(function(){
            $('.user_mnu').slideToggle(150);
            $('.cities_list').css('display', 'none');
        });
        
        /*onscroll hide */
        $(document).scroll( function(){
            $('#myorder-logout-option').hide();
        });
        
        ub.productUtils.markLiked();


        $('#parentVerticalTab').easyResponsiveTabs({
            type: 'vertical', //Types: default, vertical, accordion
            width: 'auto', //auto or any width like 600px
            fit: true, // 100% fit in a container
            closed: 'accordion', // Start closed if in accordion view
            tabidentify: 'hor_1', // The tab groups identifier
            activate: function(event) { // Callback function if tab is switched
                var $tab = $(this);
                var $info = $('#nested-tabInfo2');
                var $name = $('span', $info);
                $name.text($tab.text());
                $info.show();
            }
        });
        
//        console.log($('#js-add-address-form'));
        $('#js-add-address-form').submit(function(e){
            e.preventDefault();
            var $form = $(this),
                
                pincode = ($form.find('[name="postalCode"]')).val(),
                address1 = ($form.find('[name="address1"]')).val(),
                city = ($form.find('[name="city"]')).val(),
                province = ($form.find('[name="province"]')).val(),
                country = ($form.find('[name="country"]')).val(),
                address2 = ($form.find('[name="address2"]')).val();
                
            $.ajax({
                type: 'POST',
                url: '/save-address',
                data : {
                    address1    : address1,
                    province    : province,
                    country     : country,
                    address2    : address2,
                    postalCode  : pincode,
                    city        : city
                },
                success: function(resp){
//                    console.log(resp);
                    if(resp == 'success'){
                        window.location.assign('/address-select');
                    }
                }
            });
        });
        
        
        $(document).on('click','.js-like',function(e, cb){
            e.preventDefault();
            var $this = $(this),
                productId = $this.closest('.each_product').data('id'),
                type = ($this.find('.active').length > 0) ?  'unlike' : 'like';
            
            if(!ub.cookie.read('userId')){
                ub.getLogin(function(){
                    $this.trigger('click', [
                        function(){
                            window.location.reload();
                        }
                    ]);
                });
                return;
            }
            
            $.ajax({
                type: 'POST',
                url: (type == 'unlike') ? '/unlike-product' : '/like-product',
                data : {
                    productId   :  productId
                },
                dataType : 'json',
                success: function(resp){
                    //console.log(resp);
                    if(!!resp && !!resp.status){
                        if(type == 'like'){
                            ub.productUtils.like(productId);
                            ub.productUtils.markLiked(productId);
                        }else{
                            ub.productUtils.unlike(productId);
                            ub.productUtils.markUnliked(productId);
                        }
                        if(!!cb){
                            cb();
                        }
                    }
                }
            });
        });
        
        var $searchForm = $('#js-search-form');
        $searchForm.on('submit', function(e){
            e.preventDefault();
            var $form = $(this),
                $search = $('#js-search-input'),
                keyword = $search.val();
                
            if(!keyword){
                return;
            }
            window.location.assign('/products/q-'+keyword);
        });
        
        $('.js-product-main-image-container').click(function(e){
            e.preventDefault();
            window.location.assign($('.js-product-main-image').attr('src'));
        });
        
        $(document).on('click','.js-cancel-order',function(e, cb){
            e.preventDefault();
            var $this = $(this),
                orderId = $this.closest('.myorder').data('id');
            $.ajax({
                type: 'POST',
                url: '/cancel-order',
                data : {
                    orderId   :  orderId
                },
                dataType : 'json',
                success: function(resp){
                    //console.log(resp.error);
                    if(!!resp && !!resp.status){
                        $this.closest('.myorder').find('.js-cancel-status').html('Status - cancelled');
                        if(!!cb){
                            cb();
                        }
                    }else if(!!resp && !resp.status){
                        var err = resp.error.message;
                        $this.closest('.myorder').find('.js-cancel-status').html(err);
                    }
                }
            });
        });
    });
        
})(window, document, jQuery);



(function(window, document, $, undefined){
    
    ub.cookie = {
        create : function(name,value,days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        },

        read : function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
        erase : function(name) {
            this.create(name,"",-1);
        }
    };    
           
    ub.getAllURLParams = function () {
        var b = location.href;
        //console.log(b);
        var a = {};
        if (b) {
            try {
                b = b.split("?")[1];
                if (!b) {
                    return a;
                }
                b = b.split("&");
                for (var u in b) {
                    var c = b[u].split("=");
                    a[c[0]] = c[1];
                }
            } catch (e) {
                console.error(e);
            }
        }
        return a;
    };
    
    ub.loader = {
        loader : $('#js-ajax-loader'),
        show : function(){
            this.loader.show();
        },
        hide : function(){
            this.loader.hide();
        }
    };
    
    ub.addQueryParamToUrl = function(newParam){
        var param = $.extend({}, ub.getAllURLParams(), newParam);
        var newUrl = '?';
        
        for(var prop in param){
            newUrl += prop+'='+param[prop]+'&';
        }
        newUrl = newUrl.substring(0,newUrl.length-1);

        window.history.pushState('object or string', 'Title', newUrl);
    };
    
    ub.removeQueryParamFromUrl  = function(newParam){
        var param = ub.getAllURLParams();
        delete param[newParam];
        var newUrl = '?';
        
        for(var prop in param){
            newUrl += prop+'='+param[prop]+'&';
        }
        newUrl = newUrl.substring(0,newUrl.length-1);
        window.history.pushState('object or string', 'Title', newUrl);
//        console.log(window.location.protocol + '//' + window.location.host + window.location.pathname + newUrl);
//        window.history.pushState('object or string', 'Title', 
//            window.location.protocol + '//' + window.location.host + window.location.pathname + newUrl
//        );
    };
    
    $('.js-sort-by').click(function(){
        var that = $(this);
        ub.addQueryParamToUrl({
            SortBy : that.data('sort')
        });
        ub.resetPageIndex();
        ub.getProducts(function(html){
            $('.search_products_holder .js-product-conatiner').html(html);
        });
    });
    
    $('.cities_filter').on('change', function() {
        //alert( this.value );
        var that = $(this);
        if(!that.val()){
            ub.removeQueryParamFromUrl('FilterCity');
        }
        ub.addQueryParamToUrl({
            FilterCity : $(this).val()
        });
        ub.resetPageIndex();
        ub.getProducts(function(html){
            $('.search_products_holder .js-product-conatiner').html(html);
        });
    })
    
    /*$('.js-search-input').click(function(){
        var that = $(this);
        ub.addQueryParamToUrl({
            Keyword : that.data('search')
        });
        ub.getProducts(function(html){
            $('.search_products_holder .js-product-conatiner').html(html);
        });
    });*/
    
    ub.getProducts = function(cb){
        ub.loader.show();
        $.ajax({
            url : location.href,
            type : 'GET',
            data : {
                layout : 0
            },
            dataType : 'html'
        })
        .done(function(res){
            ub.loader.hide();
            cb(res);
            setTimeout(function(){
                var productCount = $($('.each_product')[$('.each_product').length-1]).closest('.js-product-wrap').data('count');
                if(!productCount){
                   productCount = 0 
                }
                $('.js-list-item-count').html(
                    '  - ' + productCount + ' Items'
                );
            }, 500);
        });
    };
    
    ub.parseFiltersFromUrl = function(){
        var params = ub.getAllURLParams(),
            filters = {},
            allowedFilters = ['FilterCity', 'Category'];
    
        for(var param in params){
            if(allowedFilters.indexOf(param) > -1){
                if(param=='FilterCity'){
                    $('select[data-param="'+ param +'"] option[value="'+ params[param] +'"]').prop('selected', true)
                }else{
                    params[param].split(',').forEach(function(filter){
                        $('[data-param="'+ param +'"]').find('#'+filter).prop('checked', true);
                    });
                }
            }
        }
        
    };
    
//    //To autometic check city ckeckboxlist
//    var url = window.location.href;
//    if(url.indexOf('FilterCity')>-1){
//        var city = (url.split('FilterCity=')[1]).split('&')[0];
//        $('#'+city).prop('checked', true);
//    }

    ub.parseFiltersFromUrl();

    //get checked value of cities
    var $checkboxes = $('input[type=checkbox]');
    
    $checkboxes.change(function(e){
        var values = $(this).closest('ul').find('input[type=checkbox]').filter(':checked').map(function(){
            return this.value;
        }).get();
        var filterObj = {};
        filterObj[$(this).closest('ul').data('param')] = values;
        ub.addQueryParamToUrl(filterObj);
        ub.resetPageIndex();
        ub.getProducts(function(html){
            $('.search_products_holder .js-product-conatiner').html(html);
        });
        //window.location.hash = values ? values : '';
    });
    
    ub.parseOAuthHeaders = function(oAuthEchoHeaders) {
        var credentials = oAuthEchoHeaders['X-Verify-Credentials-Authorization'];
        var apiUrl = oAuthEchoHeaders['X-Auth-Service-Provider'];

        return {
            apiUrl: apiUrl,
            credentials: credentials
        };
    };
    
    ub.getLogin = function(cb){
        try{
            Digits.logIn()
                .done(function(resp){
                    //console.log('resp');
                    var oAuthHeaders = ub.parseOAuthHeaders(resp.oauth_echo_headers);
                    
                    //setDigitsButton('Signing In…');
                    $.ajax({
                        type: 'POST',
                        url: '/digits',
                        data: oAuthHeaders,
                        success: function(resp){
                            console.log(resp);
                            if(resp.type=='register'){
                                console.log(resp.digitsData);
                                var digitsId = resp.digitsData.id_str,
                                    phoneNo = '+'+resp.digitsData.phone_number.replace('+',''),
                                    $registerModal = $("#myModal");
                                $registerModal.find('#js-register-form').unbind('submit').bind('submit', function(e){
                                    e.preventDefault();
                                    var $this = $(this),
                                        data = {
                                            fullName : $this.find('[name="fullName"]').val(),
                                            primaryCity : ub.registerAutocomplete.getPlace().name,
                                            country : ub.registerAutocomplete.getPlace().address_components[ub.registerAutocomplete.getPlace().address_components.length-1].long_name,
                                            digitsId : digitsId,
                                            phoneNo : phoneNo
                                        };
                                    $.ajax({
                                        type: 'POST',
                                        url: '/save-user',
                                        data : data,
                                        success : function(resp){
                                            console.log(resp);
                                            cb();
                                        }
                                    });
                                });
                                $registerModal.modal('show');
                            }else{
                                cb();
                            }
                        }
                    }); 
                }) /*handle the response*/
                .fail(function(){
                    
                });
        }catch(e){
            console.log('Reinitializing digits...');
            ub.initDigits(function(){
                ub.getLogin();
            });
        }
    };
    ub.getLogout = function(){
        ub.cookie.erase('name');
        ub.cookie.erase('phone');
        ub.cookie.erase('userId');
        window.location.assign('/');
    };

    ub.productUtils = {
        markLiked : function(productId){
            if(!!productId && !isNaN(productId)){
                $('.each_product[data-id="'+ productId +'"]').find('.js-like span').addClass('active');
                return;
            }
            var likedProducts = this.getLikedProducts();
            $('.each_product').each(function(){
                var $product = $(this);
                if(likedProducts.indexOf($product.data('id')) > -1){
//                    console.log($product.data('id'));
                    $product.find('.js-like span').addClass('active');
                }
            });
        },
        markUnliked : function(productId){
            if(!!productId && !isNaN(productId)){
                $('.each_product[data-id="'+ productId +'"]').find('.js-like span').removeClass('active');
                return;
            }
        },
        getLikedProducts : function(){
            return (!!localStorage.getItem('likedProducts')) ? JSON.parse(localStorage.getItem('likedProducts')) : [];
        },
        setLikedProducts : function(likedProducts){
            localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        },
        like : function(id){
            var likedProducts = this.getLikedProducts();
            if(likedProducts.indexOf(id) < 0){
                likedProducts.push(id);
            }
            this.setLikedProducts(likedProducts);
        },
        unlike : function(id){
            var likedProducts = this.getLikedProducts(),
                likedIndex = likedProducts.indexOf(id);
            if( likedIndex > -1){
                likedProducts.splice(likedIndex, 1);
            }
            this.setLikedProducts(likedProducts);
        }
    };
    ub.utils = {
        isElementInViewport : function(el) {
            try{
                if (typeof $ === "function" && el instanceof $) {
                    el = el[0];
                }
                var rect = el.getBoundingClientRect();

                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
                );
            }catch(e){
                return false;
            }
        }
    };
    if(!localStorage.getItem('likedProducts')){
        localStorage.setItem('likedProducts', JSON.stringify([]));
    }
    
    var allowBuyNowForm = true;
    $('#js-buy-now-form').submit(function(e, callType){
        var $that = $(this);
        if(!!allowBuyNowForm && !ub.cookie.read('userId')){
            e.preventDefault();
            allowBuyNowForm = false;
            ub.getLogin(function(){
                $that.trigger('submit', ['custom']);
            });
        }else if(!allowBuyNowForm && callType!='custom'){
            e.preventDefault();
        }
    });
    
    var allowBuyNowClick = true;
    $(document).on('click', '.js-buy-now-a', function(e) {      
        var $that = $(this);
        if(!!allowBuyNowClick && !ub.cookie.read('userId')){
            e.preventDefault();
            allowBuyNowClick = false;
            ub.getLogin(function(){
                window.location.assign($that.attr('href'));
            });
        }else if(!!allowBuyNowClick){
            e.preventDefault();
        }
    });
    
    $(document).ready(function(){
        //This function is used for slider in desktop filter panel
        var $slider = document.getElementById('slider'),
            priceSliderPoints = {
                min : 0,
                max : 10000
            },
            priceSliderInitPoints = JSON.parse(JSON.stringify(priceSliderPoints)),
            initCount = -2;
        if(!!$slider){
            var urlParams = ub.getAllURLParams();
            if(!!urlParams.PRLOW && !!urlParams.PRHIGH){
                priceSliderPoints.min = urlParams.PRLOW;
                priceSliderPoints.max = urlParams.PRHIGH;
            }
            
            noUiSlider.create($slider, {
                start: [priceSliderPoints.min, priceSliderPoints.max],
                connect: true,
                direction: 'ltr',
                //tooltips: [true, wNumb({ decimals: 1 })],
                range: {
                        'min': priceSliderInitPoints.min,
                        /*'10%': [10, 10],
                        '50%': [80, 50],
                        '80%': 150,*/
                        'max': priceSliderInitPoints.max
                }
            });

            var sliderTimeout = null,
                $priceSliderLabel  = {
                    min : $('#js-price-level-min'),
                    max : $('#js-price-level-max')
                };

            $slider.noUiSlider.on('update', function( values, handle ) {
                var PRLOW = values[0], PRHIGH = values[1],
                    countryCode = ub.cookie.read('currency');
                if (countryCode == "IN") {
                    var currency = "INR";
                }else if (countryCode == "US") {
                    var currency = "USD";
                }else if (countryCode == "CA") {
                    var currency = "CAD";
                }
                //currency = ub.cookie.read('currency') ? ub.cookie.read('currency') : 'CAD';
                $priceSliderLabel.min.text(currency+' ' + Math.round(PRLOW));
                $priceSliderLabel.max.text(currency+' ' + Math.round(PRHIGH));
                if(initCount < 0){
                    initCount++;return;
                }
                if(!!sliderTimeout){
                    clearTimeout(sliderTimeout);
                }
                sliderTimeout = setTimeout(function(){
                    sliderTimeout = null;
                    ub.addQueryParamToUrl({
                        PRLOW : PRLOW,
                        PRHIGH : PRHIGH
                    });
                    ub.resetPageIndex();
                    ub.getProducts(function(html){
                        $('.search_products_holder .js-product-conatiner').html(html);
                    });
                }, 500);
            });
        }
        //Location detection functionality
//        var onSuccess = function(location){
//            /*console.log(
//                "Lookup successful:\n\n"
//                + JSON.stringify(location, undefined, 4)
//            );*/
//            var cityName = location.city.names.en,
//                countryIso = location.country.iso_code;
//                if (countryIso == "IN") {
//                    var currency = "INR";
//                }else if (countryIso == "US") {
//                    var currency = "USD";
//                }else if (countryIso == "CA") {
//                    var currency = "CAD";
//                }
//            console.log(location.country.iso_code);
//        };
//        var onError = function(error){
//            console.log(
//                "Error:\n\n"
//                + JSON.stringify(error, undefined, 4)
//            );
//        };
//        geoip2.city(onSuccess, onError);


        
        
        //autoscroll functionality..
        var scrollMutex = true;
        $(document).on('scroll', function(e){
            var $lastProduct = $($('.each_product')[$('.each_product').length-1]);
            if(ub.utils.isElementInViewport($lastProduct) && !!scrollMutex && !!$lastProduct.length && !!$lastProduct.data('next')){
                scrollMutex = false;
                ub.pageIndex++;
                ub.addQueryParamToUrl({
                    start : ub.pageIndex
                });
                ub.getProducts(function(html){
                    scrollMutex = true;
                    $('.search_products_holder .js-product-conatiner').append(html);
                });
            }
        });
        
        /*function initialize() {
            new google.maps.places.Autocomplete(
                (document.getElementById('autocomplete')), {
                    types: ['geocode']
            });
        }
        initialize();*/
        
    });
    
    //Code for download-app-link
    $(document).ready(function() {
        var userAgent = getMobileOperatingSystem();
        console.log(userAgent);

        if (userAgent=='A') {
            $('.js-download-app-link').attr('href',"https://play.google.com/store/apps/details?id=com.ubti.boutique");
        }else if (userAgent=='I') {
            $('.js-download-app-link').attr('href',"https://itunes.apple.com/ca/app/urban-boutique/id1166177595?mt=8");
        }else if (userAgent=='unknown') {
            $('.js-download-app-link').attr('href',"https://itunes.apple.com/ca/app/urban-boutique/id1166177595?mt=8");
        }else{
            $('.js-user-agent').hide();
        }
        
        //places api autocomplete..
        ub.registerAutocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('js-primary-city')), {
                types: ['geocode']
            }
        );
    }); 
    
    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "W";
        }
        if (/android/i.test(userAgent)) {
            return "A";
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "I";
        }
        return "unknown";
    }

    $(window).load(function(){
        var userAgent = getMobileOperatingSystem();
        
        if((!window.sessionStorage.getItem('download-app-popup-closed')) && (userAgent == 'I' || userAgent == 'A')){
            $('#js-download-app-link').show();
        }
        //$("#js-phone-popup").modal('show');
    });
   
})(window, document, jQuery);