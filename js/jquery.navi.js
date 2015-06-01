/**
 * JQuery Navi plugin prototype.
 *
 * @author Timothy Lamb <timl@acenda.com>
 * @link http://www.acenda.com/
 * @copyright Copyright &copy; 2008-2011 Acenda Softw@rez
 * @license http://www.acenda.com/license/
 */
/**
 * Maintains responsive popout navigation
 * Usage:
 * 
 * <nav id="myNav" data-navi="menu" data-navi-type="root" style="display:none;">
 * <a data-navi-trigger="menu">&times;</a>
 * <ul class="nav navbar-nav">
 *  <li><a href="#"><i class="icon-fixed-width icon-dashboard"></i>Stuff</a></li>
 *  <li><a href="#"><i class="icon-fixed-width icon-dashboard"></i>In a Menu</a></li>
 *  <li>
 *    <a href="#" data-navi-trigger="submenu"><i class="icon-fixed-width icon-dashboard"></i>Is heaps excite</a>
 *    <nav id="submenu" data-navi="submenu" style="display:none;">
 *      <ul class="nav navbar-nav">
 *        <li><a href="#"><i class="icon-fixed-width icon-home"></i>Some menu</a></li>
 *      </ul>
 *    </nav>
 *  </li>
 * </ul>
 * </nav>
 *
 * <script>
 *   
 * (function($) {
 * 		$('[data-navi-trigger]').navi(); //Initialize
 * })(jQuery);
 * 
 * </script>
 *
 * 
 */

(function($){
   var Navi = function(element, options)
   {
        var elem = $(element);
        var obj = this;
        var settings = $.extend({
            side:'right',
            open_duration:220,
            open_easing:'swing',
            close_duration:220,
            close_easing:'swing',
            switch_duration:100,
            switch_easing:'swing',
        }, options || {});

        elem.click(function(){
            var nav = $('[data-navi='+$(this).attr('data-navi-trigger')+']');
            if(nav.length) {
                if(nav.is(':visible')) {
                    close(nav,settings.close_duration);
                } else {
                    if(nav.attr('data-navi-type') == 'root') {
                      $('[data-navi-type=root]').each(function(){
                          if($(this).is(':visible')) {
                            close($(this),settings.switch_duration);
                          }
                      });
                    }
                    open(nav,settings.open_duration);
                }
                return false;
            }
        });

        // Public method - can be called from client code
        this.publicMethod = function()
        {
           console.log('public method called!');
        };

        // Private method - can only be called from within this object
        //
        var open = function(t,d)
        {
            var s= {};
            s[settings.side] = -20;
            t.css(settings.side,(t.width() * -1));
            fixScroll(t);
            t.show();
            t.animate(s,d);
        };
        var close = function(t,d)
        {
            var s= {};
            s[settings.side] = (t.width() * -1);
            closeChildren(t,d);
            t.animate(s,d,function(){
                t.hide();
            });
        };

        var closeChildren = function(t,d)
        {
            var s= {};
            s[settings.side] = (t.width() * -1);

            t.find('[data-navi]').each(function() {
                $(this).animate(s,d,function(){
                    $(this).hide();
                });
            });
        };

        var fixScroll = function(t) {
            //Fix for iOS scroll, make height of ul match window height, 
            //css contains overflow-y for scroll
            var height = t.children('ul').height();
            if($(window).height() < height) {
                t.children('ul').height($(window).height()+'px');
            }
        }
    };

    $.fn.navi = function(options)
    {
        return this.each(function()
        {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('navi')) return;
            // pass options to plugin constructor
            var navi = new Navi(this, options);
            // Store plugin object in this element's data
            element.data('navi', navi);
        });
    };
})(jQuery);