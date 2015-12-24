$('[id^=couponrule_values]').parents('.form-group').hide();
$('#couponrule_operation').parents('.form-group').hide();
$('.form-horizontal').cascadingDropdown({
    onReady: function(event, allValues) {
        var rule_id = $('[name=couponrule\\[id\\]').val();
        if (rule_id == '') {
            return;
        }
        $.getJSON(acendaBaseUrl + '/api/couponrule/' + rule_id, function(data) {
            console.log(data);
            $('#couponrule_name').val(data.result.name);
            if (data.result.operation) {
                $('#couponrule_operation').val(data.result.operation);
                $('#couponrule_operation').parents('.form-group').show();
                $('#couponrule_operation').parsley('addConstraint',{required:true});
                $('#couponrule_operation').prop('disabled',false);
            }
            $('[name=couponrule\\[rule_type\\]]').val(data.result.rule_type);
            $('#couponrule_values\\[' + data.result.type + '\\]').parents('.form-group').show();
            $('#couponrule_values\\[' + data.result.type + '\\]').parsley('addConstraint',{required:true});
            $('#couponrule_values\\[' + data.result.type + '\\]').val(data.result.value);
            if ($('#couponrule_name').val().indexOf('discount') !== -1) {
                $('#couponrule_logic').parents('.form-group').hide();
            } else {
                $('#couponrule_logic').parents('.form-group').show();
            }
        });
    },
    selectBoxes: [
        {
            selector: '#couponrule_name',
            source: function(request, response) {
                $.getJSON(acendaBaseUrl + '/api/couponrule/name', request, function(data) {
                    response($.map(data.result, function(item, index) {
                        return {
                            label: item.label,
                            value: item.value,
                        };
                    }));
                });
            }
        },
        {
            selector: '#couponrule_operation',
            requires: ['#couponrule_name'],
            source: function(request, response) {
                $.getJSON(acendaBaseUrl + '/api/couponrule/rule', request, function(data) {
                    if (data.result.operations) {
                        $('#couponrule_operation').parents('.form-group').show();
                        $('#couponrule_operation').prop('disabled',false);
                        $('#couponrule_operation').parsley('addConstraint',{required:true});
                        // Make operation required by parsley
                    } else {
                        $('#couponrule_operation').parents('.form-group').hide();
                        $('#couponrule_operation').prop('disabled',true);
                        $('#couponrule_operation').parsley('removeConstraint','required');
                    }

                    $('[id^=couponrule_values]').parents('.form-group').hide();
                    $('[id^=couponrule_values]').each(function() {$(this).parsley('removeConstraint','required')});
                    $('[name=couponrule\\[rule_type\\]]').val(data.result.rule_type);
                    $('#couponrule_values\\[' + data.result.type + '\\]').parents('.form-group').show();
                    $('#couponrule_values\\[' + data.result.type + '\\]').parsley('addConstraint',{required:true});
                });
            },
        }
    ]
});
$('#couponrule_name').change(function() {
    if ($('#couponrule_name').val().indexOf('discount') !== -1) {
        $('#couponrule_logic').parents('.form-group').hide();
    } else {
        $('#couponrule_logic').parents('.form-group').show();
    }
});
