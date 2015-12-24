if(acenda.google_analytics_id){
	new AcendaAnalytics(acenda.google_analytics_id).init();
}else if(acenda.google_tag_manager){
	new AcendaTagManager().init();
}

function AcendaAnalytics(trackingID){
	this.trackingID = trackingID;
	this.currency = 'USD';

	this.init = function(){
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	 	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	 	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	 	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		ga('create', this.trackingID , 'auto');  
		ga('require', 'displayfeatures'); 						// Enable demographics
		ga('send', 'pageview');

		if(acenda.enhanced_ecommerce){ // if Enhanced Ecommerce
			this.ECroute(window.location.pathname);
		}else{
			this.route(window.location.pathname);
		}	
	}

	this.route = function(route){
		if(route.includes('place')){
			this.transaction();
		}
	}

	this.ECroute = function(route){
		ga('require', 'ec');
		ga('set', '&cu', this.currency)
		this.addToCartTracking();

		if(route.includes('place')){
			this.ECtransaction();
		}
		if(route.includes('product')){
			this.productDetails();
		}
		if(route.includes('cart')){
			this.removeToCartTracking();
		}
		if(route.includes('checkout') || route.includes('cart')){
			this.checkoutProcess(route);
		}
	}

	this.getCheckoutStep = function(route){
		if(route.includes('cart')){
			return 1;
		}else if(route.includes('checkout/billing')){
			return 3;
		}else if(route.includes('checkout/place') || route.includes('checkout/paypal/place')){
			return 4;
		}else if(route.includes('checkout') || route.includes('checkout/paypal/review')){
			return 2;
		}
	}

	this.getCheckoutMethod = function(link){
		if(link.includes("paypal")){
			return "PayPal Checkout";
		}else{
			return "Regular Checkout";
		}
	}

	this.getShippingMethod = function(){
		var value = $('select[name=shipping\\[shipping_method\\]]').val();
		var shippingMethod = $("option[value="+value+"]").text();
		return shippingMethod;
	}

	this.getPaymentMethod = function(){
		var number = $('input[name=checkout\\[card_number\\]]').val();
        var re = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
        };
        if (re.visa.test(number)) {
            return 'visa';
        } else if (re.mastercard.test(number)) {
            return 'mastercard';
        } else if (re.amex.test(number)) {
            return 'amex';
        } else if (re.discover.test(number)) {
            return 'discover';
        } else {
            return null;
        }
	}


	this.checkoutProcess = function(route){
		self = this;

		var checkout_step = self.getCheckoutStep(route)

		if(checkout_step == 1){
			self.checkoutStep1();
		}	
		if(checkout_step == 2){
			self.checkoutStep2(route);
		}
		if(checkout_step == 3){
			self.checkoutStep3();
		}
		if(checkout_step == 4){
			self.checkoutStep4();
		}
	}

	//Checkout Step 1
	//On arrival on /cart page "Viewed Checkout - Cart"
		//add product -> send Step 1
		//When clicking on proceed to checkout -> send Step 1 of checkout with  option:paypal/regular "Started Checkout"
	this.checkoutStep1 = function(){
		//attach click action on checkout buttons 
		$('a[href*=checkout]').click(function(event) {
			event.stopPropagation();
			var link = $(event.currentTarget);
			var checkout_method = self.getCheckoutMethod(link.attr("href"));
			ga('ec:setAction', 'checkout_option', {'step': 1, 'option': checkout_method});
			ga("send", "event", "EnhancedEcommerce", "Started Checkout",
				{
					nonInteraction: 1,
					hitCallback: function() {
						link.off("click");
						link.trigger("click");
					}
				}
			);
		});

		//create and send checkout step
		if(acenda.cart){
            if(acenda.cart.items){
            	for(x in acenda.cart.items){
            		ga('ec:addProduct', {               // Provide product details in an productFieldObject.
					  'id': acenda.cart.items[x].id,    // Product ID (string).
					  'name': acenda.cart.items[x].name, // Product name (string).
					  'price': acenda.cart.items[x].price,         // Product price (currency).
					  'brand': acenda.cart.items[x].brand,			// Product brand (string).
					  //'coupon': 'APPARELSALE',          // Product coupon (string).
					  'quantity': acenda.cart.items[x].quantity   // Product quantity (number).
					});
            	}
            }
			ga('ec:setAction', 'checkout', {          // Transaction details are provided in an actionFieldObject.
			  	'step': 1,
			});
			ga("send", "event", "EnhancedEcommerce", "Viewed Checkout - Cart", {nonInteraction: 1});
		}
	}

	//Checkout Step 2
	//On arrival on /checkout page (or checkout/paypal/review) "Viewed Checkout - Shipping Info"
		//add product -> send Step 2
		//When clicking on continue checkout -> send Step 2 of checkout with  option:shipping_method "Completed Checkout - Shipping Info"
	this.checkoutStep2 = function(route){
		var button;
		if(route.includes('paypal')){
			button = 'button[name=place]';
		}else{
			button = 'button[name=continue]';
		}
		//attach click action on continue buttons 
		$(button).click(function(event) {
			event.stopPropagation();
			var button = $(event.currentTarget);
			var shipping_method = self.getShippingMethod();
			ga('ec:setAction', 'checkout_option', {'step': 2, 'option': shipping_method});
			ga("send", "event", "EnhancedEcommerce", "Completed Checkout - Shipping Info",
				{
					nonInteraction: 1,
					hitCallback: function() {
						button.off("click");
						button.trigger("click");
					}
				}
			);
		});

		//create and send checkout step
		if(acenda.cart){
            if(acenda.cart.items){
            	for(x in acenda.cart.items){
            		ga('ec:addProduct', {               // Provide product details in an productFieldObject.
					  'id': acenda.cart.items[x].id,    // Product ID (string).
					  'name': acenda.cart.items[x].name, // Product name (string).
					  'price': acenda.cart.items[x].price,         // Product price (currency).
					  'brand': acenda.cart.items[x].brand,			// Product brand (string).
					  //'coupon': 'APPARELSALE',          // Product coupon (string).
					  'quantity': acenda.cart.items[x].quantity   // Product quantity (number).
					});
            	}
            }
			ga('ec:setAction', 'checkout', {          // Transaction details are provided in an actionFieldObject.
			  	'step': 2,
			});
			ga("send", "event", "EnhancedEcommerce", "Viewed Checkout - Shipping Info", {nonInteraction: 1});
		}
	}

	//Checkout Step 3
	//On arrival on /checkout/billing (or paypal page) page "Viewed Checkout - Billing Info"
		//When clicking on continue checkout -> send Step 3 of checkout with  option:payement_method "Completed Checkout - Billing Info"
		//What should I do for PAYPAL payement ?
	this.checkoutStep3 = function(){
		//attach click action on continue buttons 
		$('button[name=place_order]').click(function(event) {
			event.stopPropagation();
			var button = $(event.currentTarget);
			var payment_method = self.getPaymentMethod();
			ga('ec:setAction', 'checkout_option', {'step': 3, 'option': payment_method});
			ga("send", "event", "EnhancedEcommerce", "Completed Checkout - Billing Info",
				{
					nonInteraction: 1,
					hitCallback: function() {
						button.off("click");
						button.trigger("click");
					}
				}
			);
		});

		//create and send checkout step
		if(acenda.cart){
            if(acenda.cart.items){
            	for(x in acenda.cart.items){
            		ga('ec:addProduct', {               // Provide product details in an productFieldObject.
					  'id': acenda.cart.items[x].id,    // Product ID (string).
					  'name': acenda.cart.items[x].name, // Product name (string).
					  'price': acenda.cart.items[x].price,         // Product price (currency).
					  'brand': acenda.cart.items[x].brand,			// Product brand (string).
					  //'coupon': 'APPARELSALE',          // Product coupon (string).
					  'quantity': acenda.cart.items[x].quantity   // Product quantity (number).
					});
            	}
            }
			ga('ec:setAction', 'checkout', {
			  	'step': 3,
			});
			ga("send", "event", "EnhancedEcommerce", "Viewed Checkout - Billing Info", {nonInteraction: 1});
		}
	}

	//Checkout Step 4
	//On arrival on /checkout/place page "Checkout Completed"
		//add product -> send Step 4
	this.checkoutStep4 = function(){
		if(acenda.order){
            if(acenda.order.items){
            	for(x in acenda.order.items){
            		ga('ec:addProduct', {               // Provide product details in an productFieldObject.
					  'id': acenda.order.items[x].id,    // Product ID (string).
					  'name': acenda.order.items[x].name, // Product name (string).
					  'price': acenda.order.items[x].price,         // Product price (currency).
					  //'coupon': 'APPARELSALE',          // Product coupon (string).
					  'quantity': acenda.order.items[x].quantity   // Product quantity (number).
					});
            	}
            }
			ga('ec:setAction', 'checkout', {          // Transaction details are provided in an actionFieldObject.
			  	'step': 4,
			});
			ga("send", "event", "EnhancedEcommerce", "Checkout Completed", {nonInteraction: 1});
		}
	}

	this.removeToCartTracking = function(){
		var self = this;
		$('button[value*=remove\\/]').click(function(event) {
			event.stopPropagation();
			var button = $(event.currentTarget);
			var item_index = button.attr("value").replace('remove/','');
			var item_index = parseInt(item_index);
			if(Number.isInteger(item_index)){
				var variant = acenda.cart.items[item_index];
			}
			ga("ec:addProduct", {id: variant.id, name: variant.name, quantity: variant.quantity, price: variant.price, brand: variant.brand, currency: self.currency});
			ga("ec:setAction", "remove");
			ga("send", "event", "EnhancedEcommerce", "Removed Product", 
				{
					nonInteraction: 1,
					hitCallback: function() {
						button.off("click");
						button.trigger("click");
					}
				}
			);
		});
	}

	this.addToCartTracking = function(){
		var self = this;
		$('button[value=cart]').click(function(event) {
    		var addedProducts = false;
		    event.preventDefault();
		    var cartButton = event.currentTarget;
		    var form = cartButton.parentElement;
		    while(form.nodeName != 'FORM'){
		        form = form.parentElement;
		    }
		    form = $(form);
		    form.find('.quantity-selector').each(function() {
		        if (!isNaN($(this).val())) {
		        	var qty = parseInt($(this).val());
		            var variant_id = $(this).attr("name").replace('items[','').replace(']','');
		            var variant = self.getVariant(variant_id);
		            if(variant && qty > 0){
		            	ga("ec:addProduct", {id: variant.id, name: variant.name, quantity: qty, price: variant.price, brand: variant.brand, currency: self.currency});
		            	addedProducts = true;
		            }
		        }
		    });
		    if(addedProducts){
		    	ga("ec:setAction", "add");
		    	ga("send", "event", "EnhancedEcommerce", "Added Product", {nonInteraction: 1});
		    }
		});
	}

	this.getVariant = function(variant_id){
		if(acenda.products){
			for(x in acenda.products){
				for(y in acenda.products[x].variants){
					if( variant_id == acenda.products[x].variants[y].id){
						acenda.products[x].variants[y].brand = acenda.products[x].brand;
						return acenda.products[x].variants[y];
					}
				}
			}
		}
		return null;
	}

	this.productDetails = function(){
		if(acenda.collection){
			ga('ec:addProduct', {
			  'id': acenda.collection.id,
			  'name': acenda.collection.name,
			  'brand': acenda.collection.brand,
			});
			ga('ec:setAction', 'detail');
			ga("send", "event", "EnhancedEcommerce", "Viewed Product", {nonInteraction: 1})
		}else{
			ga('ec:addProduct', {
			  'id': acenda.products[0].id,
			  'name': acenda.products[0].name,
			  'brand': acenda.products[0].brand,
			});
			ga('ec:setAction', 'detail');
			ga("send", "event", "EnhancedEcommerce", "Viewed Product", {nonInteraction: 1})
		}
	}

	//Add coupons used on the order
	this.ECtransaction = function(){
		if(acenda.order){
            if(acenda.order.items){
            	for(x in acenda.order.items){
            		ga('ec:addProduct', {               // Provide product details in an productFieldObject.
					  'id': acenda.order.items[x].id,    // Product ID (string).
					  'name': acenda.order.items[x].name, // Product name (string).
					  'price': acenda.order.items[x].price,         // Product price (currency).
					  //'coupon': 'APPARELSALE',          // Product coupon (string).
					  'quantity': acenda.order.items[x].quantity   // Product quantity (number).
					});
            	}
            }
			ga('ec:setAction', 'purchase', {          // Transaction details are provided in an actionFieldObject.
			  'id': acenda.order.id,                  // (Required) Transaction id (string).
			  'affiliation': acenda.site, 			  // Affiliation (string).
			  'revenue': acenda.order.revenue,        // Revenue (currency).
			  'tax': acenda.order.tax,                // Tax (currency).
			  'shipping': acenda.order.shipping,      // Shipping (currency).
			  //'coupon': 'SUMMER2013'                // Transaction coupon (string).
			});
			ga("send", "event", "EnhancedEcommerce", "Completed Order", {nonInteraction: 1});
		}
	}

	this.transaction = function(){
		if(acenda.order){
			ga('require', 'ecommerce', 'ecommerce.js');			// Load the ecommerce plug-in.
			ga('ecommerce:addTransaction', {
	            'id': acenda.order.id,							// Transaction ID. Required
	            'affiliation': acenda.site,						// Affiliation or store name
	            'revenue': acenda.order.revenue,				// Grand Total
	            'shipping': acenda.order.shipping,				// Shipping
	            'tax': acenda.order.tax,						// Tax
	            'currency': this.currency						//local currency
            });
            if(acenda.order.items){
            	for(x in acenda.order.items){
            		ga('ecommerce:addItem', {
		                'id': acenda.order.id,						// Transaction ID. Required
		                'name': acenda.order.items[x].name,			// Product name. Required
		                'sku': acenda.order.items[x].sku,			// SKU/code
		                //'category': 'Green Medium',       		// Category or variation
		                'price': acenda.order.items[x].price,		// Unit price
		                'quantity': acenda.order.items[x].quantity,	// Quantity
		                'currency': this.currency					//local currency
	                });
            	}
            }
            ga('ecommerce:send');
		}
	}
}

function AcendaTagManager(){
	this.currency = 'USD';

	this.init = function(){
		if(acenda.enhanced_ecommerce){ // if Enhanced Ecommerce
			this.ECroute(window.location.pathname);
		}
	}

	this.ECroute = function(route){
		this.addToCartTracking();
		if(route.includes('cart')){
			this.removeToCartTracking();
		}
		if(route.includes('checkout') || route.includes('cart')){
			this.checkoutProcess(route);
		}
	}

	this.getCheckoutStep = function(route){
		if(route.includes('cart')){
			return 1;
		}else if(route.includes('checkout/billing')){
			return 3;
		}else if(route.includes('checkout/place') || route.includes('checkout/paypal/place')){
			return 4;
		}else if(route.includes('checkout') || route.includes('checkout/paypal/review')){
			return 2;
		}
	}

	this.getCheckoutMethod = function(link){
		if(link.includes("paypal")){
			return "PayPal Checkout";
		}else{
			return "Regular Checkout";
		}
	}

	this.getShippingMethod = function(){
		var value = $('select[name=shipping\\[shipping_method\\]]').val();
		var shippingMethod = $("option[value="+value+"]").text();
		return shippingMethod;
	}

	this.getPaymentMethod = function(){
		var number = $('input[name=checkout\\[card_number\\]]').val();
        var re = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
        };
        if (re.visa.test(number)) {
            return 'visa';
        } else if (re.mastercard.test(number)) {
            return 'mastercard';
        } else if (re.amex.test(number)) {
            return 'amex';
        } else if (re.discover.test(number)) {
            return 'discover';
        } else {
            return null;
        }
	}


	this.checkoutProcess = function(route){
		self = this;

		var checkout_step = self.getCheckoutStep(route)

		if(checkout_step == 1){
			self.checkoutStep1();
		}	
		if(checkout_step == 2){
			self.checkoutStep2(route);
		}
		if(checkout_step == 3){
			self.checkoutStep3();
		}
		if(checkout_step == 4){
			self.checkoutStep4();
		}
	}

	//Checkout Step 1
	//On arrival on /cart page "Viewed Checkout - Cart"
		//add product -> send Step 1
		//When clicking on proceed to checkout -> send Step 1 of checkout with  option:paypal/regular "Started Checkout"
	this.checkoutStep1 = function(){
		//attach click action on checkout buttons 
		$('a[href*=checkout]').click(function(event) {
			event.stopPropagation();
			var link = $(event.currentTarget);
			var checkout_method = self.getCheckoutMethod(link.attr("href"));
			dataLayer.push({
			    'event': 'checkoutOption',
			    'ecommerce': {
			      'checkout_option': {
			        'actionField': {'step': 1, 'option': checkout_method}
			      }
			    }
   			});
			link.off("click");
			link.trigger("click");
		});
	}

	//Checkout Step 2
	//On arrival on /checkout page (or checkout/paypal/review) "Viewed Checkout - Shipping Info"
		//add product -> send Step 2
		//When clicking on continue checkout -> send Step 2 of checkout with  option:shipping_method "Completed Checkout - Shipping Info"
	this.checkoutStep2 = function(route){
		var button;
		if(route.includes('paypal')){
			button = 'button[name=place]';
		}else{
			button = 'button[name=continue]';
		}
		//attach click action on continue buttons 
		$(button).click(function(event) {
			event.stopPropagation();
			var button = $(event.currentTarget);
			var shipping_method = self.getShippingMethod();
			dataLayer.push({
			    'event': 'checkoutOption',
			    'ecommerce': {
			      'checkout_option': {
			        'actionField': {'step': 2, 'option': shipping_method}
			      }
			    }
   			});
			button.off("click");
			button.trigger("click");
		});
	}

	//Checkout Step 3
	//On arrival on /checkout/billing (or paypal page) page "Viewed Checkout - Billing Info"
		//When clicking on continue checkout -> send Step 3 of checkout with  option:payement_method "Completed Checkout - Billing Info"
		//What should I do for PAYPAL payement ?
	this.checkoutStep3 = function(){
		//attach click action on continue buttons 
		$('button[name=place_order]').click(function(event) {
			event.stopPropagation();
			var button = $(event.currentTarget);
			var payment_method = self.getPaymentMethod();
			dataLayer.push({
			    'event': 'checkoutOption',
			    'ecommerce': {
			      'checkout_option': {
			        'actionField': {'step': 3, 'option': payment_method}
			      }
			    }
   			});
   			button.off("click");
			button.trigger("click");
		});
	}

	//Checkout Step 4
	//On arrival on /checkout/place page "Checkout Completed"
		//add product -> send Step 4
	this.checkoutStep4 = function(){
	}

	this.getVariant = function(variant_id){
		if(acenda.products){
			for(x in acenda.products){
				for(y in acenda.products[x].variants){
					if( variant_id == acenda.products[x].variants[y].id){
						acenda.products[x].variants[y].brand = acenda.products[x].brand;
						return acenda.products[x].variants[y];
					}
				}
			}
		}
		return null;
	}

	this.removeToCartTracking = function(){
		var self = this;
		$('button[value*=remove\\/]').click(function(event) {
			event.stopPropagation();
			var button = $(event.currentTarget);
			var item_index = button.attr("value").replace('remove/','');
			var item_index = parseInt(item_index);
			if(Number.isInteger(item_index)){
				var variant = acenda.cart.items[item_index];
			}
			var product =  {id: variant.id, name: variant.name, quantity: variant.quantity, price: variant.price, brand: variant.brand};
			
			dataLayer.push({
			  	'event': 'removeFromCart',
			  	'ecommerce': {
			  		'currencyCode': self.currency,
			    	'remove': {                               // 'remove' actionFieldObject measures.
			      		'products': [product]
			    	}
			  	}
			});
			button.off("click");
			button.trigger("click");
		});
	}

	this.addToCartTracking = function(){
		var self = this;
		$('button[value=cart]').click(function(event) {
    		var addedProducts = [];
		    event.preventDefault();
		    var cartButton = event.currentTarget;
		    var form = cartButton.parentElement;
		    while(form.nodeName != 'FORM'){
		        form = form.parentElement;
		    }
		    form = $(form);
		    form.find('.quantity-selector').each(function() {
		        if (!isNaN($(this).val())) {
		        	var qty = parseInt($(this).val());
		            var variant_id = $(this).attr("name").replace('items[','').replace(']','');
		            var variant = self.getVariant(variant_id);
		            if(variant && qty > 0){
		            	addedProducts.push({id: variant.id, name: variant.name, quantity: qty, price: variant.price, brand: variant.brand});
		            }
		        }
		    });
		    if(addedProducts.length>0){
		    	dataLayer.push({
					'event': 'addToCart',
				  	'ecommerce': {
				    	'currencyCode': self.currency,
				    	'add': {                                // 'add' actionFieldObject measures.
				      		'products': addedProducts
				    	}
				  	}
				});
		    }
		});
	}
}