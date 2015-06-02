$('#order_shipping_zip,#order_shipping_method').keyup(function() {
    $('#order_tax').parents('.form-group').addClass('has-warning');
    $('#order_shipping_rate').parents('.form-group').addClass('has-warning');
});
$('#tax-recalculate').click(function() {
    var shipping_zip = $('#order_shipping_zip').val();
    var shipping_rate = $('#order_shipping_rate').val();
    var subtotal = $('#subtotal').text();
    $('#order_tax').prop('disabled',true);
    $.post('/acenda/bones/store/api/taxdata/calculate',{
                shipping_rate:shipping_rate,
                subtotal:subtotal,
                shipping_zip:shipping_zip
            }, 'json')
    .always(function() {
        $('#order_tax').prop('disabled',false);
    })
    .done(function(data) {
        $('#order_tax').val(data.result.tax);
        $('#order_tax').parents('.form-group').removeClass('has-warning');
    });
    return false;
});
$('#shipping-recalculate').click(function() {
    var subtotal = $('#subtotal').text();
    var item_count = $('#item-count').text();
    var shipping_method = $('#order_shipping_method').val();
    $('#order_shipping_rate').prop('disabled',true);
    $.post('/acenda/bones/store/api/shippingmethod/' + shipping_method + '/rate',{
                total:subtotal,
                quantity:item_count
            }, 'json')
    .always(function() {
        $('#order_shipping_rate').prop('disabled',false);
    })
    .done(function(data) {
        $('#order_shipping_rate').val(data.result.rate);
        $('#order_shipping_rate').parents('.form-group').removeClass('has-warning');
        $('#order_tax').parents('.form-group').addClass('has-warning');
    });
    return false;
});
