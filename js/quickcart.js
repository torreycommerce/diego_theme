
var cartCloseTimeout;
var cartTriggerTimeout;

$(function() {

    var q=false;

    $("li.cart").hover(function(){
        q = true;
        if (!$(".popover.fade.bottom.in").length && !cartTriggerTimeout) {
            cartTriggerTimeout = setTimeout(function(){
                if (q) {
                    if($('li.cart').attr('data-content') == '') {
                        ajaxCart("{}", true);
                    } else {
                        $('li.cart').popover("show");
                        cartCloseTimeout = setTimeout(function(){$('li.cart').popover("hide");}, 5000);
                    }
                }
                cartTriggerTimeout = false;
            }, 500);
        }

    }, function(){q = false;});


    $.getJSON(acendaBaseUrl + '/api/sessioncart', function(data) {
        $('.cart .item-count, div.toolbar-mobile .item-count').html(data.result.item_count);
    });
    $('li.cart, div.mobile-popover').popover({html:true, trigger: 'manual', placement:'bottom'});
});

$('#ajaxcart-close').click(function() {
    $('div.popover-content').popover('hide');
});

$('button[value=cart]').click(function(event) {
    event.preventDefault();

    // Sum product quantities
    var sum = 0;
    $('#productForm .quantity-selector').each(function() {
        if (!isNaN($(this).val())) {
            sum += parseInt($(this).val());
        }
    });

    if (sum === 0) {
        alert('Need to enter a quantity!');
        return false;
    }

    // Disable submit button
    $('button[value=cart]').attr('disabled',true);
    $.post(acendaBaseUrl + '/product/route',
        $('#productForm').serialize())
    .always(function(data) {
        // Make sure to reenable it, success or failure
        $('button[value=cart]').attr('disabled',false);
        $("html, body").animate({ scrollTop: 0 }, 600);
    })
    .fail(function() {
        // Set popover on failure to add items
        $('li.cart, div.mobile-popover').attr('data-content','<h5>Failed to add item(s) to cart.</h5>').popover('show');
    })
    .success(ajaxCart);
});

function ajaxCart(data, r) {

    // BEGIN CONFIG VARIABLES
    var show_all = true; // Whether to show all products in ajax cart
    // END CONFIG VARIABLES

    var cart_items, cart_item_count = 0, cart_subtotal = 0; // Cart attributes

    // Check for items
    var result = $.parseJSON(data);

    var success = true;

    for (key in result) {
        success = success && result[key];
    }

    if (!success) {
        $('li.cart').attr('data-content','<h5></h5>').popover('show');
        return;
    }

    $.ajax({
        dataType: "json",
        url: acendaBaseUrl + '/api/sessioncart'
    })
    .done(function(data) {
        // Update cart count and create popover
        cart_items = data.result.items;
        cart_item_count = data.result.item_count;
        cart_subtotal = data.result.subtotal;
    })
    .then(function(data) {
        var requests = []; // Deferred request array
        var response = []; // Deferred request response array
        var first_product_added = false; // Whether it's the first product to be added to cart (determines whether to clone)
        var product_attr = []; // Product attribute array
        var items = []; // Items array
        var product_cart_id = []; // product_id -> cart_id array

        if (show_all) {
            items = cart_items;
        } else {
            items = $('#productForm').serializeArray(); // Items that were added
        }

        $('.mobile-popover .ajaxcart-product:gt(0), .cart .ajaxcart-product:gt(0)').remove(); // Remove all but first ajaxcart-product (in case of multiple adds)

        if (items.length == 0) {
            if (!$("div.mobile-popover").is(":hidden"))
                $('div.mobile-popover').attr('data-content','<div class="popover-close"><div class="row"><div class="col-md-12"><a onclick="$(\'li.cart\').popover(\'hide\')" id="ajaxcart-close" class="btn btn-danger btn-sm pull-right fa fa-times"></a></div></div></div><h5>Your cart is empty.</h5>').popover('show');
            return;
        }

        for (var i = 0; i < items.length; i++) {
            product_cart_id[items[i].product_id] = i;
            // Go through and get the id, thumbnail and quantity
            var product, product_quantity, product_id;
            if (show_all) {
                product = items[i];
                product_quantity = product.quantity;
                product_id = product.product_id;
            } else {
                product = items[i];
                product_quantity = product.value;
                if (product_quantity == '') {
                    product_quantity = 1;
                }
                if (product_quantity == 0) {
                    continue;
                }
                product_id = product.name.match(/\[(.*?)\]/)[1];
            }
            product_attr[product_id] = {quantity:product_quantity};
            // Generate a request for product data
            var request = $.getJSON(acendaBaseUrl + '/api/variant/' + product_id)
            .done(function(data) {
                response.push(data.result);
            });
            requests.push(request); // Push request onto array
        }
        var defer = $.when.apply($, requests); // Run all requests
        defer.done(function() {
            // Sort the responses by most recently added to the cart (by cart item ID)
            response.sort(function(a, b) {
                return product_cart_id[a.id] > product_cart_id[b.id];
            });
            for (var i = 0; i < response.length; i++) {
                var product_name = response[i].title;
                var product_price = parseFloat(response[i].price).toFixed(2);
                var product_thumbnail = response[i].thumbnail;
                var product_id = response[i].id;

                if (!first_product_added) {
                    $('.ajaxcart-product .product-image').attr('src', product_thumbnail);
                    $('.ajaxcart-product .product-name').html(product_name);
                    $('.ajaxcart-product .product-price').html(product_price);
                    $('.ajaxcart-product .product-quantity').html(product_attr[product_id].quantity);
                    first_product_added = true;
                } else {
                    var cloned = $('.ajaxcart-product:last').clone().appendTo('.mobile-popover .ajaxcart-products, .cart .ajaxcart-products');
                    cloned.find('.product-image').attr('src', product_thumbnail);
                    cloned.find('.product-name').html(product_name);
                    cloned.find('.product-price').html(product_price);
                    cloned.find('.product-quantity').html(product_attr[product_id].quantity);
                }
            }
            $('.cart .item-count, .toolbar-mobile .item-count, #nav-mobile-main .item-count').html(cart_item_count);
            $('.cart .ajaxcart .item-count, .mobile-popover .ajaxcart .item-count').html(cart_item_count);
            $('.cart .ajaxcart .subtotal, .mobile-popover .ajaxcart .subtotal').html(cart_subtotal);

            if (show_all) {
                $('.cart .ajaxcart .heading, .mobile-popover .ajaxcart .heading').html('');
            } else
                $('.cart .ajaxcart .heading, .mobile-popover .ajaxcart .heading').html('The following item(s) were added to your cart:');

            $('#collection .quantity-selector').val(0); // Set collection quantity selector values to 0

            if(cart_items.length > 0) {
                if ($("div.mobile-popover").is(":hidden"))
                    displayCart($('li.cart').attr('data-content',$('.cart .ajaxcart').html()), r);
                else{
                    displayCart($('div.mobile-popover').attr('data-content',$('.mobile-popover .ajaxcart').html()), r);
                }
            }

        });
    });
}

function displayCart(el, r){

    el.popover("show");

    el.on('shown.bs.popover', function () {

        $(this).parent().find('div.popover-content')
            .mouseenter(function(){
                if(cartCloseTimeout) clearTimeout(cartCloseTimeout);
            })
            .mouseleave(function(){
                if(cartCloseTimeout) clearTimeout(cartCloseTimeout);
                setTimeout(function(){
                    el.popover("hide");
                }, 500);
            });
    });

    cartCloseTimeout = setTimeout(function(){el.popover("hide");}, 5000);
}
