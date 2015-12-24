$(function() {
    var form = $('form[name=checkout],form[name=express],form[name=shipping]');
    var formName = form.attr('name');
    var stepName = $('input[name=step]').val(); // Gets the form prefix
    form.attachNormalizer({formPrefix:stepName});
    
    form.submit(function() {
        // Validate the form
        console.log(form.normalized);
        console.log($("#custom-address").is(":hidden"));
        if (!$('.form-horizontal').parsley('isValid')) {
            return false;
        }else{
            if (form.normalized && !$("#custom-address").is(":hidden")) {
                $(this).find('button[type="submit"]').attr('disabled', true);
            }else if (form.normalized == undefined && ($("#custom-address").is(":hidden") || !$("#custom-address").length)){
                $(this).find('button[type="submit"]').attr('disabled', true);
            }
        }
    });

    // Remove constraints if address IDs are not set or undefined
    if (($('#checkout_shipping_address_id').val() != '' && 
        $('#checkout_shipping_address_id').val() != undefined) ||
        ($('#checkout_billing_address_id').val() != '' &&
        $('#checkout_billing_address_id').val() != undefined) ||
        ($('#express_shipping_address_id').val() != '' &&
        $('#express_shipping_address_id').val() != undefined)) {
        $('#custom-address').hide();
        $('#custom-address input[type="text"], #custom-address input[type="tel"]').each(function(index, elm) {
            $(this).parsley('removeConstraint','required');
        });
    }   

    // Add/remove constraints based on selected address
    $('#checkout_shipping_address_id, #checkout_billing_address_id, #express_shipping_address_id').change(function() {
        if ($(this).val() != '') {
            $('#custom-address').slideUp();
            $('#custom-address input[type="text"], #custom-address input[type="tel"]').each(function(index, elm) {
                $(this).parsley('removeConstraint','required');
            });
        } else {
            $('#custom-address').slideDown();
            $('#custom-address input[type="text"], #custom-address input[type="tel"]').each(function(index, elm) {
                if (elm.name.indexOf('street_line2') === -1) {
                    $(this).parsley('addConstraint',{required:true});
                }
            });
        }
    });

    function cardtype(number) {
        var re = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
        };
        if (re.visa.test(number)) {
            return 'visa';
        } else if (re.mastercard.test(number)) {
            return 'mastercard';
        } else if (re.amex.test(number)) {
            return 'amex';
        } else if (re.discover.test(number)) {
            return 'discover';
        } else {
            return false;
        }
    }

    $('#checkout_card_number').keyup(function() {
        var type = cardtype($(this).val());
        $('.cc-visa,.cc-mastercard,.cc-amex,.cc-discover').fadeTo(0, 0.4);
        if (type) {
            $('.cc-' + type).fadeTo(0, 1);
        }
    });
});