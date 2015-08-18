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

    this.getVariationSelector = function(selectName, optionValue){
        return "[id=variation-selector-"+self.product_id+"-"+selectName+"-"+optionValue+"]";
    }
    this.getSelectedValue = function(selectName){
        return "[id=selected-"+selectName+"-"+self.product_id+"]";
    }
    this.getProductVariation = function(variant_id){
        return "[id=product-" + variant_id + "]";
    }

    this.updateChips = function(){
        var self = this;
        $.each(self.selectsData, function(name, optionArray){
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
            $.each(self.variants, function(index, variant){
                var id = self.getProductVariation(variant.id);
                var quantityInput = "input[name='items["+ variant.id +"]']";
                if(variant.id == filteredVariants[0].id){
                    $(id).show();
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
            if(this.disabled == true){
                this.disabled = false;
                disabled_cart_button--;
                if(disabled_cart_button == 0){
                    $('button[value=cart]').attr('disabled',false);
                }
            }
            
        }else{
            if(this.disabled == false){
                this.disabled = true;
                $('button[value=cart]').attr('disabled',true);
                disabled_cart_button++;
            }
        }
    }

    this.updateVariants = function(selectName, optionValue){
        var self = this;

        self.selectedValues[selectName] = optionValue;
        var filteredVariants = self.getFilteredVariants(self.selectedValues);

        if(filteredVariants.length == 0 ){
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

        var selected_variant = null;

        $.each(self.variants, function(index,variant){
            if(variant.price > 0){
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