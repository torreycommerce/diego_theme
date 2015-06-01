

(function($){
   var ImageZoom = function(element, options)
   {
      var elem = $(element);
      var obj = this;
    elem.panzoom({
      contain: "invert",
      minScale: 1,
      disablePan: true
      })
    .on({ 'touchstart' : function(e){
        $(this).data.mouseXY = e.touches[0].pageX+':'+e.touches[0].pageY;
        var d = new Date();
        if($(this).data.touchTime && $(this).data.touchTime>d.getTime()) {
          if($(this).panzoom('getScale') > 1) {
            $(this).panzoom('reset');
            $(this).panzoom('disablePan');
            $(this).attr('src',$(this).data.originalImage);
          } else {
            var big = $(this).attr('data-zoomify');
            $(this).data.originalImage = $(this).attr('src');
            if(big != '' && big !== true) {
                $(this).attr('src',$(this).attr('data-image-zoom'));
            }

            $(this).panzoom('enablePan').panzoom("zoom",2,{animate:true});
          }
        }
        $(this).data.touchTime = d.getTime()+400;
      }})
    .on({ 'mousedown' : function(e){
        $(this).data.mouseXY = e.pageX+':'+e.pageY;
      }})
    .click(function(e){
        if('ontouchstart' in document.documentElement) return;
        if($(this).panzoom('getScale') <= 1) {
            $(this).addClass('zoomed',1000);

            var big = $(this).attr('data-zoomify');
            $(this).data.originalImage = $(this).attr('src');
            if(big != '' && big !== true) {
                $(this).attr('src',$(this).attr('data-image-zoom'));
            }

            $(this).panzoom('enablePan').panzoom("zoom",2,{animate:true});
        } else if((e.pageX+':'+e.pageY) == $(this).data.mouseXY) {
            $(this).attr('src',$(this).data.originalImage);
            $(this).removeClass('zoomed',1000);
            $(this).panzoom('reset');
        }
    })
   };
$.fn.imageZoom = function(options)
    {
        return this.each(function()
        {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('ImageZoom')) return;
            // pass options to plugin constructor
            var imageZoom = new ImageZoom(this, options);
            // Store plugin object in this element's data
            element.data('ImageZoom', imageZoom);
        });
    };

})(jQuery);

$(document).ready(function() {
  var startHeight;

  $(".btn-group.my-account").hover(function(){
    $(this).find("ul.dropdown-menu").slideDown("fast");
  }, function(){
    $(this).find("ul.dropdown-menu").slideUp("fast");
  });

  //get customer navbar
  $('#headerMenu').load(acendaBaseUrl+'/account/navbar');

  var pagebody = $(".wrapper");
  var themenu = $(".navbar");
  var topbar  = $(".navbar");
  //if($(window).height() < $(".wrapper").height()) {
    //$('.navbar-left').height($(".wrapper").height());
    //$('.nav .dropdown-menu').height($(".wrapper").height());
  //}
  //$(window).resize(function() {
    //if($(window).height() < $(".wrapper").height()) {
      //$('.navbar-left').height($(".wrapper").height());
      //$('.nav .dropdown-menu').height($(".wrapper").height());
    //}
  //});

  var viewport = {
    width : $(window).width(),
    height : $(window).height()
  };

  /*
   $('.nav-left.dropdown-menu li a').on("tap click",{ swipe: false, drag: false, transform: false }, function(){
      window.location=($(this).attr('href'));
   });
*/
   $('[data-tooltip]').tooltip();

   // $('[data-navi-trigger]').navi();

  var nav = $('.toolbar-mobile');

  $(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
      nav.addClass("f-nav");
    } else {
      nav.removeClass("f-nav");
    }
  });

  $("#close-button").click(function(){
    $('#account').trigger('open');
  });

  $(".close-menu").click(function(){
    $('#nav-mobile-main').trigger('close');
  });

    $("#nav-mobile-main").mmenu({
       zposition: "front",
       position: "left",
       classes: "mm-light",
       dragOpen: true,
       moveBackground: true
    }, {
    }).trigger("open.btn-nav-mobile");



    $("#acc_btn").click(function(){$('#account').trigger('open');});
    $(".sub_c").click(function(){$('#'+$(this).attr("ref")).trigger('open');});



   $('[data-image-zoom]').imageZoom();
   $('[data-image-swap]').click(function() {
      var src = $(this).attr('data-image-swap-src');
      var el = $('#'+$(this).attr('data-image-swap'));
      var srczoom = $(this).attr('data-image-swap-zoom');
      el.removeClass('zoomed',1000);
      el.panzoom('reset');
      el.attr('src',src);
      el.attr('data-image-zoom',srczoom);
   });


   $('.navbar .nav li a').click(function(){
      window.location=($(this).attr('href'));
   });

   /*$('nav#main li.dropdown').hover(
       function(){
             $(this).addClass('open').find('ul').show(0,function() {
             })
       },
       function(){
          $(this).removeClass('open').find('ul').stop(true,true).hide();
       }
   );
  $('a.dropdown-toggle, .dropdown-menu a').on('touchstart', function(e) {
    e.stopPropagation();
  });*/

});

// Disable Console.log for browsers that dont support it or if debugging
var debugging = true; // or true
if (typeof console == "undefined") var console = { log: function() {} };
else if (!debugging || typeof console.log == "undefined") console.log = function() {};

// if IE7, convert inline-blocks to inline zoom 1
function fixInlineBlocks(selector) {

      $(selector).each(function (i) {
            if ($(this).css('display') == "inline-block") {
                 $(this).css('display','inline');
                 $(this).css('zoom','1');

            }
      });
}

// Don't need document.ready since our script is getting loaded at the bottom of the page instead of in <head>

$(document).ready(function() {
    $('#productForm').submit(function() {
        sum = 0;
        $('#productForm input:text').each(function() {
            if (!isNaN($(this).val())) {
                sum += parseInt($(this).val());
            }
        });
        if (sum === 0) {
            alert('Need to enter a quantity!');
            return false;
        } else {
            return true;
        }
    });
});

// Parsley settings
$(document).ready(function () {
    $("input[data-metatype='phone']").mask("(999) 999-9999");

    var limit_feed = ["text", "tel", "email", "password", "url", "datetime", "time", "number"];

    $('form').each(function() {
        $(this).parsley({
            successClass: 'has-success',
            errorClass: 'has-error',
            errors: {
                classHandler: function(el) {
                    return el.parent();
                },
                errorsWrapper: '',
                errorElem: ''
            },
            listeners: {
                onFieldError: function ( elem, constraints, ParsleyField ) {
                    if (!elem.parent().parent().hasClass('has-feedback'))
                        elem.parent().parent().addClass('has-feedback');

                    if ($.inArray(elem[0].type, limit_feed) >= 0){
                      if (elem.parent().find(".glyphicon"))
                          elem.parent().find(".glyphicon").remove();
                      elem.after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
                    }

                    elem.attr("data-original-title", elem[0].validationMessage);
                    elem.tooltip("show");
                },
                onFieldSuccess: function ( elem, constraints, ParsleyField ) {
                    if (!elem.parent().parent().hasClass('has-feedback'))
                        elem.parent().parent().addClass('has-feedback');
                    if ($.inArray(elem[0].type, limit_feed) >= 0){
                      if (elem.parent().find(".glyphicon"))
                          elem.parent().find(".glyphicon").remove();
                      elem.after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
                    }

                    elem.tooltip("destroy");
                }
            }
        });
    });
});

// Datepicker
$(document).ready(function() {
    $('input[datepicker=1]').datepicker({
        format: 'yyyy-mm-dd'
    });
});

function findBootstrapEnvironment() {
    var envs = ['xs', 'sm', 'md', 'lg'];

    $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = envs.length - 1; i >= 0; i--) {
        var env = envs[i];

        $el.addClass('hidden-'+env);
        if ($el.is(':hidden')) {
            $el.remove();
            return env
        }
    };
}

// Adjusts the quantity of the +/- fields
function adjustQuantity(qtyField, increment, postForm) {
    if (isNaN(qtyField.val())) {
        qtyField.val(0);
    }
    var previousValue = parseInt(qtyField.val());

    var id = qtyField.data('id');
    var model = qtyField.data('model');

    // Don't let quantity go below 0 if we're submitting to the server
    // After quickcart can fully access the API with customers authenticated through oauth we should be able to remove items dynamically under this condition
    if (typeof id !== 'undefined') {
        var compareValue = 1;
        if (qtyField.val() == 0 && !$("#wishlist").length && !$("#registry").length) { // Change 0 to 1, we shouldn't be submitting 0s to the server || Edit: Unless it's registry or wishlist
            qtyField.val(1);
            previousValue = 1;
        }
    } else {
        var compareValue = 0;
    }

    // Don't go below the compare value
    // edit: Unless you're on wishlist or registry
    if (!$("#wishlist").length && !$("#registry").length && previousValue <= compareValue && increment < 0) {
        return;
    }
    if(previousValue + increment <= 0 ){
        qtyField.val(0);
    } else {
        qtyField.val(previousValue += increment);
    }

    // Because of our situation with OAuth, we need to use the form to update wishlist and registry items; however, we can use the api to update sessioncart items.
    if (typeof id !== 'undefined') { // We need to submit the updated quantity to the server
        var form = qtyField.parents('form');
        var formData = form.serialize(); // We must serialize our form data here because disabled fields are not submitted

        // Dim quantity field while we update
        qtyField.parents('.quantity').find('input,button').prop('disabled',true);

        if (typeof model === 'undefined') { // No model defined, so submit the entire form
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: formData + '&action=update'
            }).always(function(e) {
                qtyField.parents('.quantity').find('input,button').prop('disabled',false);
            });
        } else {
            qtyField.parents('.item').find('.error').hide();
            // Model is defined, so use the API to submit a put request
            $.ajax({
                type: 'put',
                url: acendaBaseUrl + '/api/' + model + '/' + id,
                dataType: 'json',
                data: JSON.stringify({ quantity: qtyField.val() })
            }).always(function(e) {
                qtyField.parents('.quantity').find('input,button').prop('disabled',false);
            }).fail(function(e) {
                data = $.parseJSON(e.responseText);
                qtyField.val(previousValue -= increment);
                if (data.code === 400 && model === 'sessioncartitem') { // Bad request for the cart - not enough inventory
                    qtyField.parents('.item').find('.error').html('Not enough inventory to add more items!');
                } else { // Probably a connection failure
                    qtyField.parents('.item').find('.error').html('Unknown error: could not update quantity.');
                }
                qtyField.parents('.item').find('.error').show();
            }).done(function(e) {
                if (model === 'sessioncartitem') { // Check if we're at the cart, and if so, update the cart subtotal/individual item totals
                    updateCartTotals(qtyField, id);
                }
            });
        }
    }
}

// Updates the subtotal and current item total.
function updateCartTotals(qtyField, cartItemId) {
    $.getJSON(acendaBaseUrl + '/api/sessioncart')
    .always(function(e) {
        $('#subtotal').css({'opacity':1});
    })
    .done(function(data) {
        // Different field name if it's a sale amount vs. regular
        if (qtyField.parents('.item').find('.sale').length) {
            var priceElement = qtyField.parents('.item').find('.sale .amount');
        } else {
            var priceElement = qtyField.parents('.item').find('.regular .amount');
        }

        var amount = priceElement.find('.dollars').html() + '.' + priceElement.find('.cents').html();
        amount = parseFloat(amount * data.result.items[cartItemId].quantity).toFixed(2);

        // Line item amount
        var item_amount = amount.split('.');
        // toLocaleString for the commas
        qtyField.parents('.item').find('.total .dollars').html(parseInt(item_amount[0]).toLocaleString());
        qtyField.parents('.item').find('.total .cents').html(item_amount[1]);

        // Subtotal
        var result = data.result.subtotal.split('.');
        // toLocaleString for the commas
        $('#subtotal .amount .dollars').html(parseInt(result[0]).toLocaleString());
        $('#subtotal .amount .cents').html(result[1]);
    });
}

$('div#wishlist .modal_list_quantity, div#registry .modal_list_quantity').on('hidden.bs.modal', function () {
    document.location.reload();
})

// +/- buttons on single page and collections
$('.btn-add').click(function(e) {
    e.preventDefault();
    adjustQuantity($(this).parent().parent().find('.quantity-selector'), 1);
});
$('.btn-remove').click(function(e) {
    e.preventDefault();
    adjustQuantity($(this).parent().parent().find('.quantity-selector'), -1);
});
// Hitting the enter key on the add quantity fields
$('.quantity-selector').change(function(e) {
    adjustQuantity($(this), 0); // Quantity was adjusted externally
});
$('.quantity-selector').keypress(function(e){
    // Run adjust quantity action when numbers are entered in field
    if (e.which == 13)
    {
        e.preventDefault();
        adjustQuantity($(this), 0); // Quantity was adjusted externally
    }
});

if ($('.panel-tabs li:eq(1) a').length && $('.read-more').length)
  $('.read-more').click(function(){
    $('.panel-tabs li:eq(1) a').click();
    $("html, body").animate({ scrollTop: 600 }, 600);
  })

// Show product tab when add to cart below is clicked on collections pages
$('.btn-add-to-cart').click(function (e) {
  $('.panel-tabs a[href="#children"]').tab('show');
})

// ZeroClipboard for wishlist/registry share links
$(function() {
var client = new ZeroClipboard( $('#btn-share'), {
  moviePath: acendaBaseThemeUrl + "/swf/ZeroClipboard.swf"
});

client.on( "load", function(client) {
  client.on( "complete", function(client, args) {
      $('#btn-share').popover('show');
      setTimeout(function(){$('#btn-share').popover('hide');}, 3000);
  } );
} );
});

//Newsletter Validator
$(document).ready(function() {
  $('#NewsLSub').click(function () {
    var email = $(this).parent().prev('input').val();
    if (email == 'undefined' || email == '' || !validateEmail(email)) {
      event.preventDefault();
      $("#NewsLInput").parent().addClass('has-error');
    }
  });
  $("#NewsLInput").keyup(function(){
      $(this).parent().removeClass('has-error');
  });
});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
