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
                setRateEstimatedShipping(method_data.result.rate);
                var total_before_tax = parseFloat(cart_data.result.subtotal) + parseFloat(method_data.result.rate);
                var total_before_tax = total_before_tax.toFixed(2).toLocaleString();
                setTotalBeforeTax(total_before_tax);
                if (method_data.result.date_range.length > 0){
                    $('#block-date-estimate').show();
                    $('#date-estimate').html(method_data.result.date_range[0] + ' - ' + method_data.result.date_range[1]);
                }else{
                    $('#block-date-estimate').hide();
                }
                $('#tax-estimate').html('$' + tax_data.result.tax);
                setTaxEstimated(tax_data.result.tax);
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
    clearEstimated();
    $('#estimate').hide();
    $('#form').show();
});
function setRateEstimatedShipping(rate){
    $('#rate-estimate-checkout').find('.amount').text('$'+rate);
    $('#rate-estimate-checkout').show();
}
function setTaxEstimated(tax){
    $('#tax-estimate-checkout').find('.amount').text('$'+tax);
    $('#tax-estimate-checkout').show();
}
function setTotalEstimated(total){
    var estimate_total = $('#estimate-total').find('.amount');
    estimate_total.data("old-value", estimate_total.text());
    estimate_total.text('$'+total);
}
function setTotalBeforeTax(total){
    $('#total-before-tax').find('.amount').text('$'+total);
    $('#total-before-tax').show();
}
function clearEstimated(){
    $('#rate-estimate-checkout').hide();
    $('#tax-estimate-checkout').hide();
    $('#total-before-tax').hide();
    //Restore total
    var estimate_total = $('#estimate-total').find('.amount');
    estimate_total.text( estimate_total.data("old-value") );
}
