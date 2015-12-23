$('#generate').click(function() {
    var text = '';
    var val = $('#coupon_number').val();
    if (val < 1) {
        val = 1;
    }

    for (var i = 0; i < val; i++) {
        if (i > 0) {
            text += ', ';
        }
        var random = Math.random();
        var code = ('0000'+random.toString(36).replace('.', '')).substr(-12).toUpperCase();
        code += code.split('').reduce(function(previousValue, currentValue, index, array) {
            return (previousValue + parseInt(currentValue,36)*index) % 10; // Checksum digit at the end
        },0);
        text += code;
    }
    $('#coupon_codes').val(text);
    return false;
});
