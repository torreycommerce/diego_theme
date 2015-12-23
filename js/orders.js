// Submit when date selector changes
$('select').change(function(){
    $(this).closest('form').submit();
});
