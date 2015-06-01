/*	Table OF Contents
 ==========================
 Carousel
 Customs Script [Modal Thumb | List View  Grid View + Add to Wishlist Click Event + Others ]
 Custom Parallax
 Custom Scrollbar
 Custom animated.css effect
 Equal height ( subcategory thumb)
 responsive fix
 */
$(document).ready(function () {

    /*==================================
     Carousel
     ====================================*/

    // NEW ARRIVALS Carousel
    $("#productslider").owlCarousel({
        navigation: true,
        items: 4,
        itemsTablet: [768, 2]
    });


    // BRAND  carousel
    var owl = $(".brand-carousel");

    owl.owlCarousel({
        //navigation : true, // Show next and prev buttons
        navigation: false,
        pagination: false,
        items: 8,
        itemsTablet: [768, 4],
        itemsMobile: [400, 2]


    });

    // Custom Navigation Events
    $("#nextBrand").click(function () {
        owl.trigger('owl.next');
    })
    $("#prevBrand").click(function () {
        owl.trigger('owl.prev');
    })


    // YOU MAY ALSO LIKE  carousel

    $("#SimilarProductSlider").owlCarousel({
        navigation: true

    });


    // Home Look 2 || Single product showcase 

    // productShowCase  carousel
    var pshowcase = $("#productShowCase");

    pshowcase.owlCarousel({
        autoPlay: 4000,
        stopOnHover: true,
        navigation: false,
        paginationSpeed: 1000,
        goToFirstSpeed: 2000,
        singleItem: true,
        autoHeight: true


    });

    // Custom Navigation Events
    $("#ps-next").click(function () {
        pshowcase.trigger('owl.next');
    })
    $("#ps-prev").click(function () {
        pshowcase.trigger('owl.prev');
    })


    // Home Look 3 || image Slider

    // imageShowCase  carousel
    var imageShowCase = $("#imageShowCase");

    imageShowCase.owlCarousel({
        autoPlay: 4000,
        stopOnHover: true,
        navigation: false,
        pagination: false,
        paginationSpeed: 1000,
        goToFirstSpeed: 2000,
        singleItem: true,
        autoHeight: true


    });

    // Custom Navigation Events
    $("#ps-next").click(function () {
        imageShowCase.trigger('owl.next');
    })
    $("#ps-prev").click(function () {
        imageShowCase.trigger('owl.prev');
    })


    /*=======================================================================================
     Code for equal height - // your div will never broken if text get overflow
     ========================================================================================*/


    
	
	  $(function () {
		 $('.categoryProduct > .item').responsiveEqualHeightGrid()
    });


    $(function () {
        $('.thumbnail.equalheight').responsiveEqualHeightGrid(); // add class with selector class equalheight
    });

    $(function () {
        $('.featuredImgLook2 .inner').responsiveEqualHeightGrid(); // add class with selector class equalheight
    });

    $(function () {
        $('.featuredImageLook3 .inner').responsiveEqualHeightGrid(); // add class with selector class equalheight
    });


    /*==================================
     Customs Script
     ====================================*/

    // Product Details Modal Change large image when click thumb image
    $(".modal-product-thumb a").click(function () {
        var largeImage = $(this).find("img").attr('data-large');
        $(".product-largeimg").attr('src', largeImage);
        $(".zoomImg").attr('src', largeImage);
    });

    // collapse according add  active class
    $('.collapseWill').on('click', function (e) {
        $(this).toggleClass("pressed"); //you can list several class names 
        e.preventDefault();
    });

    $('.search-box .getFullSearch').on('click', function (e) {
        $('.search-full').addClass("active"); //you can list several class names 
        e.preventDefault();
    });

    $('.search-close').on('click', function (e) {
        $('.search-full').removeClass("active"); //you can list several class names 
        e.preventDefault();
    });


    // Customs tree menu script
    $(".dropdown-tree-a").click(function () { //use a class, since your ID gets mangled
        $(this).parent('.dropdown-tree').toggleClass("open-tree active"); //add the class to the clicked element
    });


    // Add to Wishlist Click Event	 // Only For Demo Purpose	

    $('.add-fav').click(function (e) {
        e.preventDefault();
        $(this).addClass("active"); // ADD TO WISH LIST BUTTON 
        $(this).attr('data-original-title', 'Added to Wishlist');// Change Tooltip text
    });

    // List view and Grid view 

    $(".change-view .list-view, .change-view-flat .list-view").click(function (e) { //use a class, since your ID gets mangled
        e.preventDefault();
        $('.item').addClass("list-view"); //add the class to the clicked element
        $('.add-fav').attr("data-placement", $(this).attr("left"));
        $('.categoryProduct > .item').detectGridColumns();



    });

    $(".change-view .grid-view, .change-view-flat .grid-view").click(function (e) { //use a class, since your ID gets mangled
        e.preventDefault();
        $('.item').removeClass("list-view"); //add the class to the clicked element


        $('.categoryProduct > .item').detectGridColumns();
        setTimeout( function(){
                //  reload function after 0.5 second
                $('.categoryProduct > .item').responsiveEqualHeightGrid();
            }
            , 500 );
     
    });


    // product details color switch 
    $(".swatches li").click(function () {
        $(".swatches li.selected").removeClass("selected");
        $(this).addClass('selected');

    });

    // Modal thumb link selected
    $(".modal-product-thumb a").click(function () {
        $(".modal-product-thumb a.selected").removeClass("selected");
        $(this).addClass('selected');

    });


    if (/IEMobile/i.test(navigator.userAgent)) {
        // Detect windows phone//..
        $('.navbar-brand').addClass('windowsphone');
    }


    // top navbar IE & Mobile Device fix
    var isMobile = function () {
        //console.log("Navigator: " + navigator.userAgent);
        return /(iphone|ipod|ipad|android|blackberry|windows ce|palm|symbian)/i.test(navigator.userAgent);
    };


    if (isMobile()) {
        // For  mobile , ipad, tab
		 $('.introContent').addClass('ismobile');
		

    } else {


        $(function () {

            //Keep track of last scroll
            var tshopScroll = 0;
            $(window).scroll(function (event) {
                //Sets the current scroll position
                var ts = $(this).scrollTop();
                //Determines up-or-down scrolling
                if (ts > tshopScroll) {
                    // downward-scrolling
                    $('.navbar').addClass('stuck');

                } else {
                    // upward-scrolling
                    $('.navbar').removeClass('stuck');
                }

                if (ts < 600) {
                    // downward-scrolling
                    $('.navbar').removeClass('stuck');
                    //alert()
                }


                tshopScroll = ts;

                //Updates scroll position

            });
        });


    } // end Desktop else


    /*==================================
     Parallax
     ====================================*/
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // Detect ios User // 
        $('.parallax-section').addClass('isios');
        $('.navbar-header').addClass('isios');
        $('.blog-intro').addClass('isios');
    }

    if (/Android|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Detect Android User // 
        $('.parallax-section').addClass('isandroid');
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Detect Mobile User // No parallax
        $('.parallax-section').addClass('ismobile');
        $('.parallaximg').addClass('ismobile');


    } else {
        // All Desktop 
        $(window).bind('scroll', function (e) {
            parallaxScroll();
        });

        function parallaxScroll() {
            var scrolledY = $(window).scrollTop();
            var sc = ((scrolledY * 0.3)) + 'px';
            $('.parallaximg').css('marginTop', '' + ((scrolledY * 0.3)) + 'px');
        }


        if ($(window).width() < 768) {
        } else {
            $('.parallax-image-aboutus').parallax("50%", 0, 0.2, true);
            $('.parallaxbg').parallax("50%", 0, 0.2, true);
        }


    }


    /*==================================
     Custom Scrollbar for Dropdown Cart
     ====================================*/
    $(".scroll-pane").mCustomScrollbar({
        advanced: {
            updateOnContentResize: true

        },

        scrollButtons: {
            enable: false
        },

        mouseWheelPixels: "200",
        theme: "dark-2"

    });


    $(".smoothscroll").mCustomScrollbar({
        advanced: {
            updateOnContentResize: true

        },

        scrollButtons: {
            enable: false
        },

        mouseWheelPixels: "100",
        theme: "dark-2"

    });


    /*==================================
     Custom  animated.css effect
     ====================================*/

    window.onload = (function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() > 86) {
                // Display something
                $('.parallax-image-aboutus .animated').removeClass('fadeInDown');
                $('.parallax-image-aboutus .animated').addClass('fadeOutUp');
            } else {
                // Display something
                $('.parallax-image-aboutus .animated').addClass('fadeInDown');
                $('.parallax-image-aboutus .animated').removeClass('fadeOutUp');


            }

            if ($(window).scrollTop() > 250) {
                // Display something
            } else {
                // Display something

            }

        })
    })


    /*=======================================================================================
     Code for tablet device || responsive check
     ========================================================================================*/


    if ($(window).width() < 989) {


        $('.collapseWill').trigger('click');

    } else {
        // ('More than 960');
    }


    $(".tbtn").click(function () {
        $(".themeControll").toggleClass("active");
    });


    /*==================================
     Global Plugin
     ====================================*/

    // For stylish input check box 

    $(function () {
        $("input[type='radio'], input[type='checkbox']").ionCheckRadio();
    });


    // customs select by minimalect
    $("select").minimalect();

    // cart quantity changer sniper
    $("input[name='quanitySniper']").TouchSpin({
        buttondown_class: "btn btn-link",
        buttonup_class: "btn btn-link"
    });


    // bootstrap tooltip
    // $('.tooltipHere').tooltip();
    $('.tooltipHere').tooltip('hide')


    // dropdown-menu  Fix || Stop just one dropdown toggle from closing on click

    var options = [];

    $(".dropdown-menu input[type='radio'], .dropdown-menu input[type='checkbox'], .dropdown-menu .btn-checkout").on('click', function (event) {

        var $target = $(event.currentTarget),
            val = $target.attr('data-value'),
            $inp = $target.find('input'),
            idx;

        if (( idx = options.indexOf(val) ) > -1) {
            options.splice(idx, 1);
            setTimeout(function () {
                $inp.prop('checked', false)
            }, 0);
        } else {
            options.push(val);
            setTimeout(function () {
                $inp.prop('checked', true)
            }, 0);
        }

        $(event.target).blur();

        console.log(options);
        return false;
    });


    $('.dropdown-menu').find('input').click(function (e) {
        e.stopPropagation();
    });


    // scroll to certain anchor/div

    $(".scrollto").click(function (event) {
        event.preventDefault();
        //calculate destination place
        var dest = 0;
        if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
            dest = $(document).height() - $(window).height();
        } else {
            dest = $(this.hash).offset().top;
        }
        //go to destination
        $('html,body').animate({scrollTop: dest - 51}, 1000, 'swing');
    });


    /*=======================================================================================
     end
     ========================================================================================*/


}); // end Ready