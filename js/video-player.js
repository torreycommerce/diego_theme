
var player;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function onYouTubeIframeAPIReady() {
    player = new YT.Player('main-product-video', {
        width: '100%'
    });
}

(function($){
    youtubeUrlToId = function (url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[7].length==11){
            return match[7];
        } else {
            return false;
        }
    }

    $("[data-video-src]").each(function() {
        var id;
        if(id = youtubeUrlToId($(this).attr("data-video-src"))) {
            
            var el = $(this);
            infoUrl = "https://gdata.youtube.com/feeds/api/videos/" + id + "?alt=json";
            $.getJSON( infoUrl, function( data ) {
                var title = data.entry.title['$t'];
                var thumbnail = data.entry['media$group']['media$thumbnail'][0].url;
                el.find('img').first().attr('src',thumbnail);
                el.attr("data-original-title","Video: "+title);
                el.tooltip();
                el.click(function() {
                    $("#main-product-video").show();
                    $("#main-product-image").hide();
                    player.loadVideoById(id);
                    $("[data-image-swap]").click(function() {
                        $("#main-product-video").hide();
                        $("#main-product-image").show();
                        player.stopVideo();

                    });
                });
                console.log( thumbnail );
            });
        }
    });

}( window.jQuery ));