function estimator() {
    var zip_code = $('#cart_zip_code').val();
    var shipping_method = $('#cart_shipping_method').val();
    $('#shipping-estimator').css({'opacity': 0.5});
    $.getJSON(acendaBaseUrl + '/api/sessioncart')
    .fail(function(error) {
        $('#shipping-estimator').css({'opacity': 1});
    })
    .then(function(cart_data) {
        $.post(acendaBaseUrl + '/api/shippingmethod/' + shipping_method + '/rate',{
                total:cart_data.result.subtotal,
                quantity:cart_data.result.item_count
            }, 'json')
        .fail(function() {
            $('#shipping-estimator').css({'opacity': 1});
        })
        .done(function(method_data) {
            $.post(acendaBaseUrl + '/api/taxdata/calculate',{
                shipping_rate:method_data.result.rate,
                subtotal:cart_data.result.subtotal,
                shipping_zip:zip_code
            }, 'json')
            .always(function() {
                $('#shipping-estimator').css({'opacity': 1});
            })
            .done(function(tax_data) {
                // It is probably more efficient to make this into one API call with SessionCart
                $('#form').hide();
                $('#estimate').show();
                $('#shipping-estimator').css({'opacity': 1});
                $('#rate-estimate').html('$' + method_data.result.rate);
                $('#date-estimate').html(method_data.result.date_range[0] + ' - ' + method_data.result.date_range[1]);
                $('#tax-estimate').html('$' + tax_data.result.tax);
                var total = parseFloat(cart_data.result.subtotal) + parseFloat(tax_data.result.tax) + parseFloat(method_data.result.rate);
                $('#total-estimate').html('$' + total.toFixed(2).toLocaleString());
            });
        });
    });
    return false;
}

$('#cart_Estimate').click(function(e) {
    e.preventDefault();
    estimator();
});

$('#cart_zip_code').keypress(function(e) {
    if (e.which == 13) { // Enter key
        e.preventDefault();
        estimator();
    }
});

$('#cart_ClearEstimate').click(function(e) {
    e.preventDefault();
    $('#estimate').hide();
    $('#form').show();
});
