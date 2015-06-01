
$(document).ready(function() {
    $('.star-rating-input').css({cursor: 'pointer'});
    $('.star-rating-input').hover(function() { 

    },function() {
        if($(this).data('chosen')===true) return;
        if($(this).find('input').val()>0) return;                
        $(this).find('.star-rating-star').removeClass('choosing');
        $(this).find('.star-rating-star').removeClass('active-choosing');
        $(this).find('.star-rating-star').addClass('disabled-choosing');              
    });    
    $('.star-rating-input').mousemove(function(e) {
         if(!$(this).data()) {
             $(this).data('chosen',false); 
         }       
         if($(this).data('chosen')===true) return;
         if($(this).find('input').val()>0) return;
   
         var numStars = 5;         
         var elemPosition = $(this).offset();
         var elemX=elemPosition.left;
         var elemY=elemPosition.top;
         var iconWidth = $(this).find('.glyphicon').width();
         var width = iconWidth*6;
         var x = (e.pageX- elemX);
         var percentage = x/width;
         var numLitStars = percentage*numStars;

         if(percentage <= 1.0) {
            //console.log(Math.round(numLitStars));
            $(this).data('current_score',percentage.toFixed(2));
            $(this).find('.active').css({"width":  (percentage*6) + 'em' });
            var cnt=0;            
            $(this).find('.star-rating-star').each(function(n,e){
        
                 if(cnt<numLitStars){
                     $(e).addClass('choosing');
                     $(e).removeClass('disabled-choosing');
                     $(e).removeClass('active-choosing');                                   
                 } else {
                     $(e).addClass('disabled-choosing');
                     $(e).removeClass('choosing'); 
                     $(e).removeClass('active-choosing');                                          
                 }
                 cnt++;
            })
         }
    })
    $('.star-rating-input .star-rating-star').click(function(e) {
        var elem =  $(this).parents('.star-rating-input');
        $(elem).data('chosen',true); 
        $(elem).find('.active-choosing').removeClass('choosing');  
        var numStars=5;
        var numLitStars = parseInt( $(this).attr('id').replace('rating-star-',''));

        $(elem).data('current_score',numLitStars/numStars);
        var cnt=0;            
        $(elem).find('.star-rating-star').each(function(n,e){

             if(cnt<numLitStars){ 
                 $(e).addClass('active-choosing');
                 $(e).removeClass('disabled-choosing');
                 $(e).removeClass('choosing');                                  
             } else {
                 $(e).addClass('disabled-choosing');
                 $(e).removeClass('choosing'); 
                 $(e).removeClass('active-choosing');                                          
             }
             cnt++;
        })
        //console.log(percentage);
        $(elem).find('input').val($(elem).data('current_score'));             

    });

    $('.star-rating-input .disabled').click(function(e) {
    })    
})
