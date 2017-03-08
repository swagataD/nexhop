// JavaScript Document



   $('.slider_banner').slick({
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  adaptiveHeight: true,
 
});
    
    
    
    $(window).scroll(function(){
  var sticky = $('.header_bottom'),
     
      scroll = $(window).scrollTop();

  if (scroll >= 25) 
      {
       sticky.addClass('fixed');
        
          
      }
      else {
         sticky.removeClass('fixed'); 
      }
        
       
});



    $('#similar_products').slick({
  dots: false,
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});












$(window).resize(function() { 
   var getWidth = $(this).width();
  if(getWidth > 585){
      $('').removeAttr('style').addClass('vj');
  }
});



$(document).ready(function() { 
    
    var getWidth2 = $(window).width();
    if( getWidth2 < 585){
        var API = $('#menu').mmenu({
            extensions: ["effect-menu-slide", "pagedim-black", "border-full"]
        },
        {
            transitionDuration : 50,
            pageSelector: ".wrapper"
        }).data('mmenu');
        (function(){
            $('#menu').removeClass('mm-current mm-opened');
            setTimeout(function(){
                $('html').attr('class', '');
                API.close();
            }, 30);
        })();
    }
});






$(document).ready(function() { 
    
    var getWidth2 = $(window).width();
    if( getWidth2 < 585){
        var API = $('#filter').mmenu({
            
         
          
            extensions: ["effect-menu-slide", "pagedim-black", "border-full"]
        },
                                     
                                     
        {
            transitionDuration : 50,
          
            pageSelector: ".wrapper"
        }).data('mmenu');
        (function(){
            $('#filter').removeClass('mm-current mm-opened');
            setTimeout(function(){
                $('html').attr('class', '');
                API.close();
            }, 30);
        })();
    }
});







$( function() {
    $( "#tabs" ).tabs();
  } );



$(window).resize(function(){
    var widthout = $(window).width();
    
    if(
        widthout > 585
    )
        
        {
            $('.desktop_menu').removeAttr('style');
        }
});



 
         $('.search_tog').click(function(){
          $('.search_wrap').fadeToggle();     
                               
        }); 


$(document).mouseup(function(f) {
   var container = $('.search_tog');
   if(!container.is(f.target) && container.has(f.target).length == 0)
   {
    
   $('.search_wrap').hide(0);
       
   }

   }); 



  $('.user_menu').click(function(){
          $('.user_tog').fadeToggle();     
                               
        });  

$(document).mouseup(function(f) {
   var container = $('.user_menu');
   if(!container.is(f.target) && container.has(f.target).length == 0)
   {
    
   $('.user_tog').hide(0);
       
   }

   }); 

   
    
