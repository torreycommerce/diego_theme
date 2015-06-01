var defaultVariants = [ "position",
                        "inventory_shipping_estimate",
                        "has_stock",
                        "weight",
                        "asin",
                        "product_id",
                        "inventory_policy",
                        "date_created",
                        "inventory_tracking",
                        "require_shipping",
                        "id",
                        "title",
                        "isbn",
                        "name",
                        "popularity",
                        "inventory_quantity",
                        "inventory_returnable",
                        "status",
                        "date_modified",
                        "taxable",
                        "sku",
                        "cost",
                        "compare_price",
                        "url",
                        "ean",
                        "discountable",
                        "thumbnail",
                        "price",
                        "inventory_minimum_quantity",
                        "images",
                        "save_percent",
                        "save_price",
                        "group",
                        "brand" ];

$(function() {
    if(VariantsData.isCollection){
        $.each(VariantsData.products, function(product_id, variants){
            new VariantsManager(variants, true).init();
        });
    }else{
        new VariantsManager(VariantsData.products[0], false).init();
    }
});

function VariantsManager (variants, isCollection) {
    var self = this;
    this.isCollection = isCollection;
    this.variants = variants;
    this.product_id = this.variants[0].product_id;
    this.selector = "[id=variation-selector-"+this.product_id+"]";
    this.selectsData = {};
    this.selectedValues = {};

    this.getVariationSelector = function(selectName, optionValue){
        return "[id=variation-selector-"+self.product_id+"-"+selectName+"-"+optionValue+"]";
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
                        //Selected, not available
                        // $(self.getVariationSelector(name, value)).attr("class", "notavailable-selected");
                    }else{
                        //not selected not available
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable");
                        $(self.getVariationSelector(name, value)).tooltip();
                    }
                }else{
                    if(self.selectedValues[name] == value){
                        //Selected, available
                        $(self.getVariationSelector(name, value)).attr("class", "selected").tooltip("destroy");
                    }else{
                        //not Selected available
                        $(self.getVariationSelector(name, value)).attr("class", "").tooltip("destroy");
                    }
                }
            });
        });

        //hide and show variant div to display proper variant picture
        var filteredVariants = self.getFilteredVariants(self.selectedValues);

        if(filteredVariants.length == 1){
            $.each(self.variants, function(index, variant){
                var id = "product-" + variant.id;
                var quantityInput = "input[name='items["+ variant.id +"]']";
                if(variant.id == filteredVariants[0].id){
                    $("#"+id).show();
                    if(self.isCollection){
                        $(quantityInput).val(0);
                    }else{
                        $(quantityInput).val(1);
                    }
                    
                }else{
                    $(quantityInput).val(0);
                    $("#"+id).hide();
                }
            });
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
            $.each(self.selectsData, function(selectName, optionArray){

                self.selectedValues[selectName] = filteredVariants[0][selectName];
            });
        }
        self.updateChips();
    }

    this.generateSelectsData = function(filteredVariants){
        var self = this;
        var selects = {};
        $.each( this.selectsData, function(index, value){
            selects[index] = [];
        });
        $.each( filteredVariants, function(index, value){
            $.each(value, function(index, value){
                if(defaultVariants.indexOf(index)<0){
                    if(selects[index].indexOf(value)<0){
                            selects[index].push(value);
                    }
                }
            });
          });
        return selects;
    }

    this.getFilteredVariants = function(selectedValues){
        var filteredVariants = [];
        var self = this;

        $.each( this.variants, function(index, variant){
            var passfilter = true;

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

    this.buildChips = function(selectData){
        var self = this;
        $.each(selectData, function(selectName, optionArray){
            //Color styling
            if( selectName== "color"){
                if(self.isCollection){
                    var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "color-details-collection"}); 
                }else{
                    var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "color-details"});
                }
     
                var ul = $('<ul>', {class: "swatches Color"});  
                var span = $('<span>', {class: "selected-color"}).append(
                                $('<strong>', {}).text(selectName.toUpperCase()) 
                            );

            }else{//size (default) styling
                var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "size-details"});           
                var ul = $('<ul>', {class: "swatches-size Size"});  
                var span = $('<span>', {class: "selected-size"}).append(
                                $('<strong>', {}).text(selectName.toUpperCase()) 
                            );
            }

            $.each(optionArray, function(index, optionValue){
                ul.append( 
                    $('<li>', { id: "variation-selector-"+self.product_id+"-"+selectName+"-"+optionValue, 
                                class: "",
                                "data-tooltip": "",
                                "data-toggle": "tooltip",
                                "title": "Out of stock, please try another combination"
                    })
                    .append(
                            self.getATag(selectName, optionValue)
                    ).click(function(){
                        self.updateVariants(selectName, optionValue);
                    })  
                );
            });

            div.append(span);
            div.append(ul);

            if(self.isCollection){
                $(self.selector).prepend(div);
            }else{
                var row = $('<div>', {class: "row no-margin"});
                row.append(div);
                $(self.selector).prepend(row);
            }
        });

        self.updateChips();
    }

    this.init = function(){
        var self = this;
        // Build selects object containing data of the variants select tags
        $.each( this.variants, function(index, value){
            $.each(value, function(index, value){
                if(defaultVariants.indexOf(index)<0){
                    if(! self.selectsData[index] ){
                        self.selectsData[index] = [value];
                    }else{
                        if(self.selectsData[index].indexOf(value)<0){
                            self.selectsData[index].push(value);
                        }
                    }
                }
            });
        });

        //Default selected variant
        $.each(self.selectsData, function(selectName,optionArray){
            self.selectedValues[selectName] = self.variants[0][selectName];
        });
        //Bluilding HTML Select elements
        self.buildChips(self.selectsData);
    }
}