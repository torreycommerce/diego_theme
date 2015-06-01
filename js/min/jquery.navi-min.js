/**
 * JQuery Navi plugin prototype.
 *
 * @author Timothy Lamb <timl@acenda.com>
 * @link http://www.acenda.com/
 * @copyright Copyright &copy; 2008-2011 Acenda Softw@rez
 * @license http://www.acenda.com/license/
 */
!function($){var i=function(i,n){var t=$(i),a=this,e=$.extend({side:"right",open_duration:220,open_easing:"swing",close_duration:220,close_easing:"swing",switch_duration:100,switch_easing:"swing"},n||{});t.click(function(){var i=$("[data-navi="+$(this).attr("data-navi-trigger")+"]");return i.length?(i.is(":visible")?h(i,e.close_duration):("root"==i.attr("data-navi-type")&&$("[data-navi-type=root]").each(function(){$(this).is(":visible")&&h($(this),e.switch_duration)}),o(i,e.open_duration)),!1):void 0}),this.publicMethod=function(){console.log("public method called!")};var o=function(i,n){var t={};t[e.side]=-20,i.css(e.side,-1*i.width()),d(i),i.show(),i.animate(t,n)},h=function(i,n){var t={};t[e.side]=-1*i.width(),s(i,n),i.animate(t,n,function(){i.hide()})},s=function(i,n){var t={};t[e.side]=-1*i.width(),i.find("[data-navi]").each(function(){$(this).animate(t,n,function(){$(this).hide()})})},d=function(i){var n=i.children("ul").height();$(window).height()<n&&i.children("ul").height($(window).height()+"px")}};$.fn.navi=function(n){return this.each(function(){var t=$(this);if(!t.data("navi")){var a=new i(this,n);t.data("navi",a)}})}}(jQuery);