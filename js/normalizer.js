// Form address normalizer plugin
jQuery.fn.attachNormalizer = function(options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    // Default options
    defaults = {
        formPrefix: '', // The prefix of the form, eg. checkout[formPrefix_street_line1]
        addressFormSelector: '#custom-address', // The part of the form which has the address fields
        selector: '#normalized-address', // The wrapped for the entire normalized address function
        addressFieldSelector: '#normalized-address #address', // The field to put the normalized address into
        addressFoundSelector: '#normalized-address #address-found', // Text to display if the address was found
        addressNotFoundSelector: '#normalized-address #address-not-found', // Text to display if the address was not found
        selectAddressSelector: '#normalized-address input[name=address-radio]', // Radio buttons to select which address to display
        normalizerLoader: '.loader_normalizer',
        apiUrl: acendaBaseUrl + '/api/address/verify' // URL to query
    };

    // Copy defaults over
    for (var key in defaults) {
        if (typeof options[key] === 'undefined') {
            options[key] = defaults[key];
        }
    }

    var form = this;
    var formName = form.attr('name');

    form.submit(function() {
        form.processed = {};
        form.previousAddress = {};

        // Find all form fields and take the form name out
        var formData = form.find('[name^=' + formName + '\\[' + options.formPrefix + ']').serializeArray();
        for (var i = 0; i < formData.length; ++i) {
            // Check if we have a form prefix defined
            if (options.formPrefix == '') {
                var match = /\[(.*?)\]/.exec(formData[i].name);
            } else {
                var match = /\[.*?_(.*?)\]/.exec(formData[i].name); // Get the db field name, so checkout[shipping_first_name] gets first_name
            }
            // Grab the name and the value from serializeArray
            if (match != null) {
                var name = match[1];
                var value = formData[i].value;
                form.processed[name] = value;
            }
        }

        // Check if there is actually an address form on the page
        if (typeof form.processed.street_line1 === 'undefined') {
            return true;
        }

        // Check if we're using a saved address, and if the form's normalized already
        if ((form.processed.address_id == '' || typeof form.processed.address_id === 'undefined') && !form.normalized) {
            $(options.normalizerLoader).show();
            // Send address for verification
            $.ajax({
                url: options.apiUrl,
                type: 'POST',
                data: form.processed,
                dataType: 'json'
            })
            .fail(function(data) {
                $(options.addressFoundSelector).hide();
                $(options.addressNotFoundSelector).show();
            })
            .done(function(data) {
                // Create HTML representation of the data and put it into the address field
                var addressHtml = data.result.street_line1 + '<br>';
                if (data.result.street_line2 != '') {
                    addressHtml += data.result.street_line2 + '<br>';
                }
                addressHtml += data.result.city + ', ' + data.result.state + ' ' + data.result.zip;
                form.previousAddress = data.result;
                $(options.addressFieldSelector).html(addressHtml);
                // Only show the normalized address well if the address has changed and if it's not equal to the normalized version
                if (form.processed.street_line1.toUpperCase() == data.result.street_line1 &&
                    form.processed.street_line2.toUpperCase() == data.result.street_line2 &&
                    form.processed.city.toUpperCase() == data.result.city &&
                    form.processed.state.toUpperCase() == data.result.state &&
                    form.processed.zip == data.result.zip) {
                        form.submit();
                    } else {
                        $(options.addressFoundSelector).show();
                        $(options.addressNotFoundSelector).hide();
                    }
            })
            .always(function(data) {
                $(options.normalizerLoader).hide();
                form.normalized = true;
            });
            return false;
        } 
    });

    $(options.addressFormSelector).find('input').focus(function() {
        if (form.normalized) {
            $(options.addressNotFoundSelector).hide();
            $(options.addressFoundSelector).hide();
            $(options.selectAddressSelector).filter(':checked').prop('checked',false);
            $(options.selectAddressSelector).filter('#address-current').prop('checked', true);
            form.normalized = false;
        }
    });

    // Swap the address with the normalized address
    $(options.selectAddressSelector).change(function() {
        if (!$.isEmptyObject(form.previousAddress)) {
            for (var key in form.previousAddress) {
                if (options.formPrefix == '') {
                    var field = $('[name=' + formName + '\\[' + key + '\\]]');
                } else {
                    var field = $('[name=' + formName + '\\[' + options.formPrefix + '_' + key + '\\]]');
                }
                if (field.length > 0) {
                    var tmp = form.previousAddress[key];
                    form.previousAddress[key] = field.val();
                    field.val(tmp);
                }
            }
        }
    });

    return this;
}
