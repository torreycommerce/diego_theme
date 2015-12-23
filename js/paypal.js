$('#express_shipping_zip').keyup(function() {
    if ($(this).parsley('validate')) {
        $.post('/acenda/bones/store/api/taxdata/calculate',
            {
                subtotal:$('.subtotal .amount .price').text(),
                shipping_rate:$('.shipping .amount .price').text(),
                shipping_zip:$(this).val()
            }, 'json')
        .done(function(data) {
            $('.tax .amount .price').text(data.result.tax);
            var total = parseFloat($('.subtotal .amount .price').text()) + parseFloat($('.shipping .amount .price').text()) + parseFloat(data.result.tax);
            $('.total .amount .price').text(total.toFixed(2));
        });
    }
});

$('#express_shipping_address_id').change(function() {
    var postData = {
        subtotal:$('.subtotal .amount .price').text(),
        shipping_rate:$('.shipping .amount .price').text()
    };
    if ($(this).val() == '') {
        postData['shipping_zip'] = $('#express_shipping_zip').val();
    } else {
        postData['shipping_address_id'] = $('#express_shipping_address_id').val();
    }
    $.post('/acenda/bones/store/api/taxdata/calculate', postData, 'json')
    .done(function(data) {
        $('.tax .amount .price').text(data.result.tax);
        var total = parseFloat($('.subtotal .amount .price').text()) + parseFloat($('.shipping .amount .price').text()) + parseFloat(data.result.tax);
        $('.total .amount .price').text(total.toFixed(2));
    });
});
