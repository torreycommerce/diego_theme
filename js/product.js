$(function() {
    if(VariantsData.isCollection){
        $.each(VariantsData.products, function(index, product){
            new VariantsManager(product.variants, product.variant_options, true).init();
        });
    }else{
        new VariantsManager(VariantsData.products[0].variants, VariantsData.products[0].variant_options, false).init();
    }
});

var disabled_cart_button = 0;

function VariantsManager (variants, variant_options, isCollection) {
    var self = this;
    this.variants = variants;
    this.variant_options = variant_options;
    this.isCollection = isCollection;
    this.product_id = this.variants[0].product_id;
    this.selector = "[id=variation-selector-"+this.product_id+"]";
    this.selectsData = {};
    this.selectedValues = {};
    this.disabled = false;
    this.outOfStock = "Out of stock, please try another combination";

    this.jqSelector = function(str){
        var temp = str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
        return temp;
    }

    this.getVariationSelector = function(selectName, optionValue){
        return "[id=variation-selector-"+ this.jqSelector(self.product_id+"-"+selectName+"-"+optionValue) +"]";
    }
    this.getSelectedValue = function(selectName){
        return "[id=selected-"+ this.jqSelector(selectName+"-"+self.product_id) +"]";
    }
    this.getProductVariation = function(variant_id){
        return "[id=product-" + variant_id + "]";
    }

    this.getClosestImages = function(variant_id) {
        return arr_uniq_var_img_url.variant_id;
    }

    this.getImageUrl = function(img_id, img_type) {
        console.log('getImageUrl');
        console.log(typeof arr_uniq_var_img_url['_'+img_id][img_type] != 'undefined');
        if (typeof arr_uniq_var_img_url['_'+img_id][img_type] != 'undefined') {
            return arr_uniq_var_img_url['_'+img_id][img_type];    
        }
        else {
            return "";
        }
    }

    this.setSelectImage = function(standard_img_url,large_img_url,img_alt) {
        $('#variantSelectedImage img').attr('src', standard_img_url);
        $('#variantSelectedImage img').attr('data-image-zoom', large_img_url);
        $('#variantSelectedImage img').attr('alt', img_alt);
    }

    this.addImageToCarousel = function(variant_image_id,standard_img_url,large_img_url,img_alt) {
        var clonedDiv = $('#variantImageThumbnailCopy').clone();
        clonedDiv.attr("id", variant_image_id);
        clonedDiv.appendTo( "#variantImageCarousel" );
        $('#'+variant_image_id+" img").attr("src", standard_img_url);
        $('#'+variant_image_id+" img").attr('data-image-swap-src', standard_img_url);
        $('#'+variant_image_id+" img").attr('data-image-swap-zoom', large_img_url);
        $('#'+variant_image_id+" img").attr('alt', large_img_url);
        $('#'+variant_image_id+" img").attr('alt', img_alt);
    }

    this.resetSelection = function () {
        $( "#variantImageCarousel" ).html('');
        $('#variantSelectedImage img').attr('src', '');
    }

    this.updateImages = function(obj_variant) {
        this.resetSelection();
        console.log(obj_variant);
        if (obj_variant.images.length > 0 ) {
            
            var i = 0;
            for (key in obj_variant.images) {
                var standard_img_url = this.getImageUrl(obj_variant.images[key].id,'standard');
                var large_img_url = this.getImageUrl(obj_variant.images[key].id,'large');

                if (typeof obj_variant.images[key].alt !== 'undefined')
                    var img_alt = obj_variant.images[key].alt;
                else
                    var img_alt = '';

                if (i == 0)
                    this.setSelectImage(standard_img_url,large_img_url,img_alt);
                this.addImageToCarousel(obj_variant.id+'-'+obj_variant.images[key].id,standard_img_url,large_img_url,img_alt);
                
                console.log(large_img_url);
                console.log(standard_img_url);
                i++;
            }
            return arr_uniq_var_img_url.variant_id;
        } else {
            return arr_uniq_var_img_url.variant_id;
        }
    }

    this.updateQuantitySku = function(obj_variant) {
        console.log('updateQuantitySku');
        $('#divQuantity').hide();
        if (obj_variant.price > 0 && typeof obj_variant.inventory_quantity != 'undefined' 
            && typeof obj_variant.inventory_minimum_quantity != 'undefined'
            && typeof obj_variant.inventory_policy != 'undefined'
            && obj_variant.has_stock == '1') {
                $('#divQuantity').show();
                $('#variantInput').attr('name', 'items['+obj_variant.id+']'); 
                if(obj_variant.inventory_policy != 'continue'){
                    var limit = !obj_variant.inventory_minimum_quantity ? obj_variant.inventory_quantity : obj_variant.inventory_quantity - obj_variant.inventory_minimum_quantity;
                    $('#variantInput').attr('data-limit', limit); 
                }
                  
        }
        $('#divSKU').hide();
        if (obj_variant.sku) {
            $('#divSKU').show();
            $('#variantSKU').html(obj_variant.sku);
        }
            console.log(obj_variant);
        //$('#variant-details').
    }
    this.updatePriceAndAvailability = function(obj_variant) {
        console.log('updatePriceAndAvailability');
        $('.price-box').hide();
        if (obj_variant.price > 0) {
            $('.price-box').show();
            $('.product-price').html('$'+obj_variant.price);
            $('.product-standard-price').hide();
            if (typeof obj_variant.compare_price != 'undefined' && obj_variant.price != obj_variant.compare_price && obj_variant.compare_price > 0) {
                $('.product-standard-price').show();
                $('.product-standard-price').html('$'+obj_variant.compare_price);
            }
            $('.save-pricing').hide();
            if (typeof obj_variant.save_price != 'undefined' && obj_variant.save_price > 1) {
                $('.save-pricing').show();
                $('.save-pricing').html('$'+obj_variant.save_price);
                $('.save-pricing').html(obj_variant.save_percent+'%');
            }
            var stock_text = this.getStockDescription(obj_variant);
            if (stock_text == 'In Stock')
                $('#stock-text').html('<i class="fa fa fa-check-circle-o color-in"></i>'+stock_text);
            else
                $('#stock-text').html('<i class="fa fa-minus-circle color-out"></i>'+stock_text);
            /*
            $('.pricing-bill-me-later').hide();
            if (typeof obj_variant.price >= 100) {
                $('.pricing-bill-me-later').show();
            }*/
        }
        
    }

    this.getStockDescription = function (obj_variant) {
         return obj_variant.has_stock == '1' ? 'In Stock' :  obj_variant.inventory_shipping_estimate ? obj_variant.inventory_shipping_estimate : 'Out of Stock';
    }

    this.updateChips = function(){
        var self = this;
        console.log(self.selectsData);
        $.each(self.selectsData, function(name, optionArray) {
            var selectedValues2 = {};

            $.each(self.selectsData, function(name2, optionArray2){
                if(name2 != name){
                    if(self.selectedValues[name2]){
                        selectedValues2[name2] = self.selectedValues[name2];
                    }
                }
            });

            var filteredVariants = self.getFilteredVariants(selectedValues2);
            var generatedSelectsData = self.generateSelectsData(filteredVariants);

            $.each(optionArray, function(index, value){

                if(generatedSelectsData[name].indexOf(value) < 0){
                    if(self.selectedValues[name] == value){
                        // Selected, not available
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable-selected");
                        $(self.getVariationSelector(name, value)).tooltip();
                    }else{
                        //not selected not available
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable");
                        $(self.getVariationSelector(name, value)).tooltip();
                    }
                }else{
                    if(self.selectedValues[name] == value){
                        //Selected, available
                        $(self.getVariationSelector(name, value)).attr("class", "selected");
                        $(self.getVariationSelector(name, value)).tooltip("destroy");
                    }else{
                        //not Selected available
                        $(self.getVariationSelector(name, value)).attr("class", "");
                        $(self.getVariationSelector(name, value)).tooltip("destroy");
                    }
                }
            });

            //Update option value selected
            $(self.getSelectedValue(name)).text(self.selectedValues[name]);
        });

        //hide and show variant div to display proper variant picture
        var filteredVariants = self.getFilteredVariants(self.selectedValues);

        if(filteredVariants.length == 1){
            
            //hide and show proper variant, set quantity inputs
            $.each(self.variants, function(index, variant){
                var id = self.getProductVariation(variant.id);
                var quantityInput = "input[name='items["+ variant.id +"]']";
                if(variant.id == filteredVariants[0].id){
                    console.log(id);
                    //$(id).show();
                    self.updateImages(filteredVariants[0]);
                    self.updateQuantitySku(filteredVariants[0]);
                    self.updatePriceAndAvailability(filteredVariants[0]);

                    if(self.isCollection){
                        $(quantityInput).val(0);
                    }else{
                        $(quantityInput).val(1);
                    }
                }else{
                    $(quantityInput).val(0);
                    $(id).hide();
                }
            });

            //Disable/Enable button according to variants availability
            if(self.isCollection){
                if(this.disabled == true){
                    this.disabled = false;
                    disabled_cart_button--;
                    if(disabled_cart_button == 0){
                        self.disableAddToCart(false);
                    }
                }
            }else{
                if(filteredVariants[0].has_stock){
                    self.disableAddToCart(false);
                }else{
                    self.disableAddToCart(true);
                } 
            }
        }else{
            if(self.isCollection){
                if(this.disabled == false){
                    this.disabled = true;
                    self.disableAddToCart(true);
                    disabled_cart_button++;
                }
            }else{
                self.disableAddToCart(true);
            }
        }
    }

    this.disableAddToCart = function(boolean){
        $('button[value=cart]').attr('disabled',boolean);
        $('button[value=registry]').attr('disabled',boolean);
        $('button[value=wishlist]').attr('disabled',boolean);
    }

    this.updateVariants = function(selectName, optionValue){
        console.log(selectName);
        console.log(optionValue);
        var self = this;
        self.selectedValues[selectName] = optionValue;
        console.log(self.selectedValues);

        var filteredVariants = self.getFilteredVariants(self.selectedValues);
        console.log(filteredVariants);
    
        if(filteredVariants.length == 0 ) {
            // display the default variant evalable 
            var temp = {};
            temp[selectName] = optionValue;
            filteredVariants = self.getFilteredVariants( temp );
            //Default selected variant with the new selected value
            if(filteredVariants.length != 0){
                $.each(self.selectsData, function(selectName, optionArray){
                    self.selectedValues[selectName] = filteredVariants[0][selectName];
                });
            }
        }
        self.updateChips();
    }

    this.generateSelectsData = function(filteredVariants){
        var self = this;
        var selects = {};
        $.each( this.selectsData, function(optionName, values){
            selects[optionName] = [];
        });
        $.each( filteredVariants, function(index, variant){
            $.each( selects, function(optionName, values){
                if( values.indexOf(variant[optionName])<0 )
                    values.push(variant[optionName]);
            });
        });

        return selects;
    }

    this.getFilteredVariants = function(selectedValues){
        var filteredVariants = [];
        var self = this;

        $.each( this.variants, function(index, variant){
            var passfilter = true;
            if(variant.price > 0){
                $.each( selectedValues, function(selectName, selectValue){
                    if(selectValue != ""){
                        if(variant[selectName]){
                            if(variant[selectName] != selectValue){
                                passfilter = false;
                            }
                        }else{
                            passfilter = false;
                        }
                    }
                });
            }else{
                passfilter = false;
            }
            if(passfilter) filteredVariants.push(variant);
        });
        return filteredVariants;
    }

    this.getATag = function(selectName, optionValue){
        var self = this;
        return tag =  $('<a>', {class: ""}).text(optionValue);
    }

    this.getAColorTag = function(selectName, optionValue, color){
        var self = this;
        return tag =  $('<a>', {class: "", style:"background-color:"+color});
    }

    this.buildChips = function(variant_options){
        var self = this;
        $.each(variant_options, function(index, option){
            var selectName = option.name;
            var optionArray = option.values;
            
            //Color styling
            if( selectName.toLowerCase() == "color"){
                if(self.isCollection){
                    var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "color-details-collection"}); 
                }else{
                    var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "color-details"});
                }
     
                var ul = $('<ul>', {class: "swatches Color"});  
                var span = $('<span>', {class: "selected-color"}).append(
                                $('<strong>', {}).text(selectName.slice(0,1).toUpperCase()+selectName.slice(1,selectName.length) + ":  ") 
                            );

            }else{//size (default) styling
                var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "size-details"});           
                var ul = $('<ul>', {class: "swatches-size Size"});  
                var span = $('<span>', {class: "selected-size"}).append(
                                $('<strong>', {}).text(selectName.slice(0,1).toUpperCase()+selectName.slice(1,selectName.length) + ":  ") 
                            );
            }

            $.each(optionArray, function(index, optionValue){
                ul.append( 
                    $('<li>', { id: "variation-selector-"+self.product_id+"-"+selectName+"-"+optionValue, 
                                class: "",
                                "data-tooltip": "",
                                "data-toggle": "tooltip",
                                "title": self.outOfStock
                    })
                    .append(
                            self.getATag(selectName, optionValue)
                    ).click(function(){
                        self.updateVariants(selectName, optionValue);
                    })  
                );
            });

            var span_selected = $('<span>', {class: "", id: "selected-"+selectName+"-"+self.product_id}).text("");

            div.append(span);
            div.append(span_selected);
            div.append(ul);

            if(self.isCollection){
                $(self.selector).append(div);
            }else{
                var row = $('<div>', {class: "row swatches-height"});
                row.append(div);
                var div = $('<div>', {class: "col-md-6 swatches-height"});
                div.append(row);
                $(self.selector).append(div);
            }
        });

        $('[data-toggle="tooltip"]').tooltip();
        self.updateChips();
    }

    this.orderOptions = function(options){
        var ordered_options = [];
        $.each( options, function(index, option){
            var indexToInsert=0;
            for(var i=0; i<ordered_options.length; i++){
                if(ordered_options[i].position<option.position){
                    //next
                    indexToInsert = i+1;
                }else if(ordered_options[i].position>option.position){
                    break;
                }else if(ordered_options[i].position==option.position){
                    indexToInsert = i;
                    break;
                }
            }
            ordered_options.splice(indexToInsert,0,option);
        });

        return ordered_options;
    }

    this.init = function(){
        var self = this;
        //Options ordering
        self.variant_options = self.orderOptions(self.variant_options);

        //Build selectsData
        $.each( self.variant_options, function(index, option){
            self.selectsData[option.name] = [];
            $.each( option.values, function(index, value){
                self.selectsData[option.name].push(value);
            });
        });
        
        var selected_variant = self.variants[0];

        $.each(self.variants, function(index,variant){
            if(variant.price > 0 && variant.has_stock){
                selected_variant = variant;
                return false;
            }
        });

        //Default selected variant
        $.each(self.selectsData, function(selectName,optionArray){
            self.selectedValues[selectName] = selected_variant[selectName];
        });
        //Bluilding HTML Select elements
        self.buildChips(self.variant_options);
    }
}