jQuery.fn.attachGoogleNormalizer = function(callback) {
    var callback = callback;
    var self = this;
    var num, route;
    var custom = null;

    /*
    ** Getters and setters
    */

    // Default getter and setter for array of auto initialization in 
    this.setState = function(call, val){
        if ($('select[name*="state"] option[value="'+val+'"]').length)
            $('select[name*="state"]').val(val);
        else
            throw "This country is not supported yet.";
    }

    this.setCity = function(call, val){
        if ($('input[name*="city"]').val() == '')
            $('input[name*="city"]').val(val);
    }

    this.setCountry = function(call, val){
        if ($('select[name*="country"] option[value="'+val+'"]').length)
            $('select[name*="country"]').val(val);
        else
            throw "This country is not supported yet.";
    }

    this.setZip = function(call, val){$('input[name*="zip"]').val(val);}

    this.setBuildRoute = function(call, val){
        if (call == 'route'){ self.route = val; }else{ self.num = val; }

        if (self.num != undefined && self.route != undefined){
            $('input[name*="street_line1]"]').val(self.num+" "+self.route);
            self.num = self.route = undefined;
        }
    }

    this.displayEditAddress = function(){
        
        var ad = $("#search_place").val().split(",");
        /*
        * @TODO Change that kind of stuff for underscore...
        */
        var addr = "<div class='alert alert-info' style='margin-top: 10px;'>";
            addr += "<p style='margin: 0;''><b>";
            addr += $('input[name*="first_name"]').val()+" "+$('input[name*="last_name"]').val();
            addr += "</b></p>";
            if ($('input[name*="company"]').val() != undefined && $('input[name*="company"]').val() != ''){
                addr += "<p style='margin: 0;''><i>";
                addr += $('input[name*="company"]').val();
                addr += "</i></p>";
            }
            addr += "<p style='margin: 0; margin-top: 10px;'><b>";
            addr += ad[0];
            addr += "</b></p>";
            addr += "<p style='margin: 0;'><i>";
            addr += $('input[name*="street_line2"]').val();
            addr += "</i></p>";
            addr += "<p style='margin: 0;'>";
            addr += ad[1]+", "+ad[2];
            addr += "</p>";
            addr += "<p style='margin: 0; margin-top: 10px;'><b>";
            addr += ad[3];
            addr += "</b></p>";
            addr += "</div>";

        $("#search_place").parent().append(addr);
    }

    this.removeConstraints = function(){
        $('input[name*="city"]').parsley('removeConstraint','required');
        $('input[name*="zip"]').parsley('removeConstraint','required');
        $('select[name*="state"]').parsley('removeConstraint','required');
        $('select[name*="country"]').parsley('removeConstraint','required');
        $('input[name*="street_line1"]').parsley('removeConstraint','required');

        $('input[name*="city"]').parent().find('.tooltip, .glyphicon').remove();
        $('input[name*="zip"]').parent().find('.tooltip, .glyphicon').remove();
        $('select[name*="state"]').parent().find('.tooltip, .glyphicon').remove();
        $('select[name*="country"]').parent().find('.tooltip, .glyphicon').remove();
        $('input[name*="street_line1"]').parent().find('.tooltip, .glyphicon').remove();
    }

    this.addConstraints = function(){
        $('input[name*="city"]').parsley('addConstraint', {required: true});
        $('input[name*="zip"]').parsley('addConstraint', {required: true});
        $('select[name*="state"]').parsley('addConstraint', {required: true});
        $('select[name*="country"]').parsley('addConstraint', {required: true});
        $('input[name*="street_line1"]').parsley('addConstraint', {required: true});
    }

    this.clearInputs = function(){
        $('input[name*="city"], input[name*="zip"], input[name*="street_line2"], input[name*="street_line1"]').val("");
    }

    this.setSuccess = function(){
        var success = "<div class='alert alert-success' style='margin-top: 10px;'>";
            success += "Address found:<ul>";
            success += "<li style='cursor: pointer;' id='google_map_wrapper_more_info'><u>Add more information ?</u></li>";
            success += "<li style='cursor: pointer;' id='google_map_wrapper_manual'><u>Edit your address manually</u></li>";
            success += "</ul></div>"; 
            
            $("#search_place").parent().append(success);
            // $('input[name*="street_line2]"]').parent().parent().slideDown('fast');
    }

    this.setErrorNotVierfied = function(){
        this.clearInputs();
        var error = "<div class='alert alert-warning' style='margin-top: 10px;'>";
            error += "Impossible to verify this address :<ul>";
            error += "<li style='cursor: pointer;' id='google_map_wrapper_retype'><u>Retype another address</u></li>";
            error += "<li style='cursor: pointer;' id='google_map_wrapper_manual'><u>Edit your address manually</u></li>";
            error += "</ul></div>";
        
        $("#search_place").parent().append(error);
    }

    this.setError = function(err){
        self.clearInputs();
        $("#search_place").parent().find('.alert').slideUp('fast', function(){this.remove();});
        var error = "<div class='alert alert-danger' style='margin-top: 10px;'>";
            error += err+"<ul>";
            error += "<li style='cursor: pointer;' id='google_map_wrapper_retype'><u>Retype another address</u></li>";
            error += "<li style='cursor: pointer;' id='google_map_wrapper_manual'><u>Edit your address manually</u></li>";
            error += "</ul></div>";

        $("#search_place").parent().removeClass('has-success').addClass('has-error');
        $("#search_place").parent().append(error);
    }

    /*
    ** Google API Callback
    */

    this.setAddr = function(place){
        var componentForm = {
            street_number: ['short_name', self.setBuildRoute],
            route: ['long_name', self.setBuildRoute],
            locality: ['long_name', self.setCity],
            sublocality: ['long_name', self.setCity],
            administrative_area_level_1: ['short_name', self.setState],
            country: ['short_name', self.setCountry],
            postal_code: ['short_name', self.setZip]
        };

        if (place.address_components){
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (componentForm[addressType])
                    componentForm[addressType][1](addressType, place.address_components[i][componentForm[addressType][0]]);
                self.checkForm(i == (place.address_components.length - 1));
            }
        }
    }

    this.checkForm = function(check){
        var empty = ($('input[name*="street_line1"]').val() == '' ||
                    $('input[name*="zip"]').val() == '' ||
                    $('input[name*="city"]').val() == '');
        
        if (check){
            $("#search_place").parent().find('.alert').slideUp('fast', function(){this.remove();});
            if (empty){ this.setErrorNotVierfied(); } else { this.setSuccess(); }
        }
    }

    if ($('#search_place').parent().parent().parent().parent().attr("id") === "custom-address"){
        custom = $('#search_place').parent().parent().parent().parent();

        // Add/remove constraints based on selected address
        $('#checkout_shipping_address_id, #checkout_billing_address_id, #express_shipping_address_id').change(function() {
            if ($(this).val() != '') {
                $('#custom-address').slideUp();
                $('input[name*="first_name"]').parsley('removeConstraint','required');
                $('input[name*="last_name"]').parsley('removeConstraint','required');
                $('input[name*="phone_number"]').parsley('removeConstraint','required');
                self.removeConstraints();
            } else {
                $('#custom-address').slideDown();
                $('input[name*="first_name"]').parsley('addConstraint', {required: true});
                $('input[name*="last_name"]').parsley('addConstraint', {required: true});
                $('input[name*="phone_number"]').parsley('addConstraint', {required: true});
            }
        });
    }

    if (custom && custom.css('display') == "none"){
        $('input[name*="first_name"]').parsley('removeConstraint','required');
        $('input[name*="last_name"]').parsley('removeConstraint','required');
        $('input[name*="phone_number"]').parsley('removeConstraint','required');
        self.removeConstraints();
    }

    if ($('#search_place').length){
        
        /*
        ** Event handler 
        */

        $(this).submit(function(){
            if ((custom && custom.css("display") === "block") || !custom){
                if ($('input[name*="city"]').val() == '' || 
                    $('input[name*="zip"]').val() == '' || 
                    $('input[name*="street_line_1"]').val() == ''){
                    $("#search_place").parent().find('.alert').slideUp('fast');
                    $('input[name*="street_line1]"]').focus();
                    $('input[name*="city"], input[name*="zip"], select[name*="state"], select[name*="country"], input[name*="street_line1"], input[name*="street_line2"]').parent().parent().slideDown('fast');
                    self.addConstraints();
                    return false;
                }
            }
        });

        $(document).on('click', '#google_map_wrapper_more_info', function(){
            $('input[name*="street_line2"]').parent().parent().slideDown('fast', function(){
                $('input[name*="street_line2"]').focus();
            });
        });


        $(document).on('click', '#google_map_wrapper_retype', function(){
            $("#search_place").parent().find('.alert').slideUp('fast', function(){
                $("#search_place").val("");
                $("#search_place").focus();
            });
        });

        $(document).on('click', '#google_map_wrapper_manual', function(){
            $("#search_place").parent().find('.alert').slideUp('fast');
            $('input[name*="street_line1]"]').focus();
            $('input[name*="city"], input[name*="zip"], select[name*="state"], select[name*="country"], input[name*="street_line1"], input[name*="street_line2"]').parent().parent().slideDown('fast');
            self.addConstraints();
        });

        $("#search_place").focus(function(){
            $('#search_place').bind("keyup keypress", function(e) {
                self.removeConstraints();
                $('input[name*="city"], input[name*="zip"], select[name*="state"], select[name*="country"], input[name*="street_line1"], input[name*="street_line2"]').parent().parent().slideUp('fast');
            });

            $('form').bind("keyup keypress", function(e) {
                $("#search_place").parent().removeClass('has_success');
                $("#search_place").parent().removeClass('has_error');
                var code = e.keyCode || e.which;
                if (code  == 13) {
                    e.preventDefault();
                    return false;
                }
            });
        });

        $("#search_place").blur(function(e){
            var code = e.keyCode || e.which; 
            if (code  == 13) {
                e.preventDefault();
                return true;
            }
        });

    
        /*
        ** Google API handler
        */

        // Hidding initialization for the form
        $('input[name*="city"], input[name*="zip"], select[name*="state"], select[name*="country"], input[name*="street_line1"], input[name*="street_line2"]').parent().parent().css('display', 'none');
        // Remove Parsley constraints required when for is hidden
        this.removeConstraints();
        // Generate the blue address in the address page
        if ($('#search_place').val() != '')
            this.displayEditAddress();

        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search_place'), {types: ['geocode']});
        // Callback to launch USPS normalizer if we reach the query_limit
        //console.log(google.maps.places.Autocomplete);
        google.maps.event.addListener(autocomplete, 'place_changed', function(status){
            var place = autocomplete.getPlace();
            if (place.address_components){
                self.clearInputs();
                try{ self.setAddr(place); }catch(err){
                    self.setError(err);
                }
            }
        });
    }
}