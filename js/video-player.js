var player;
            var tag = document.createElement('script');
            
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



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

    vimeoUrlToId = function (url) {
        var regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
        var match = url.match(regExp);
        if (match[3]){
            return match[3];
        } else {
            return false;
        }
    }

    $("[data-video-src]").each(function() {
        var url = $(this).attr("data-video-src");
        var el = $(this);
        var title = 'Video Title';
        var thumbnail = '';

        if(id = youtubeUrlToId(url)) {

            window.onYouTubePlayerAPIReady = function() {
                player = new YT.Player('main-product-video', {
                    width: '100%'
                });
            };
            el.find('img').first().attr('src', 'http://img.youtube.com/vi/'+id+'/default.jpg');
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
        }
        else if (id = vimeoUrlToId(url)) {
            var url_info = "https://vimeo.com/api/v2/video/"+id+".json";
            $.get( url_info, function( data ) {
                el.find('img').first().attr('src', data[0].thumbnail_medium);
            });
            el.click(function() {
                    $("#main-product-video").show();
                    $("#main-product-image").hide();
                    alert('tet');
                    $('#main-product-video').html('<iframe src="//player.vimeo.com/video/'+id+'?autoplay=true" width="100%" height="300px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay></iframe>');
                    $("[data-image-swap]").click(function() {
                        $("#main-product-video").hide();
                        $("#main-product-image").show();
                        $('.main-product-video').html('');
                    });
            });
            $('#main-product-video').html('<iframe src="//player.vimeo.com/video/'+id+'?autoplay=true" width="100%" height="300px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay></iframe>');
        }
    });
    
    

}( window.jQuery ));