showProductVariation = function(selector) {

    var parent          = selector.parentsUntil('.product').parent();
    var variationsBlock = parent.parentsUntil('.variations').parent();
    var selection       = selector.prop("selectedIndex");
    var id              = selector.val();
    var quantity        = parent.find('input').val();

    variationsBlock.children('.product').each(function() {
        $(this).hide();
        $(this).find('input').each(function() {
            $(this).val(0);
        });
        $(this).find('select').each(function() {
            $(this).val(id);
        });
    });
    $("#"+id).show();
    $("#"+id).find('input').val(quantity);
}