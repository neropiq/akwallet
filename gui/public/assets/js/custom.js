

new WOW().init();

$(window).on('resize', function(){
    var win = $(this);
    if (win.width() < 992) {
        $('body').addClass('pushmenu-push');
    }
    else
    {
        $('body').removeClass('pushmenu-push');
    }

});

$(document).ready(function(){ 
    initCustomScrollbar();
    $(".typeSerch").hide();
    $(".icon-serch-hide").click(function(){
        $(".typeSerch").show();
        $(".icon-serch-hide").hide();
    });
});

function initheader(){ 
    $menuLeft = $('.pushmenu-left');
    $nav_list = $('#nav_list');
    
    $nav_list.click(function(e) {
        $(this).toggleClass('active');
        $('.pushmenu-push').toggleClass('pushmenu-push-toright');
        $menuLeft.toggleClass('pushmenu-open');
        e.preventDefault();
        $('body').toggleClass('custome-active-menu');
        
    });
    
    $('.navlink-close').click(function(){
        $menuLeft.removeClass('pushmenu-open');        
        $('body').removeClass('custome-active-menu');
    });
    $('.page-container').click (function(e) {
            $('.pushmenu-push').toggleClass('pushmenu-push-toright');
            $menuLeft.removeClass('pushmenu-open');            
            $('body').removeClass('custome-active-menu');
    });

    
    var win = $("#app");
    if (win.width() < 992) {        
        $('#body').addClass('pushmenu-push');      
    }
    else
    {
        $('body').removeClass('pushmenu-push');
    } 
   
}

function initCustomScrollbar() 
{ 
    var $root = $("#app");
    // $root.find("#maulik").mCustomScrollbar({ theme: "dark-3" }); 
}