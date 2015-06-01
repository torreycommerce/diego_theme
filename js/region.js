$('.form-horizontal').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=country]',
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/region', request, function(data) {
                var country = $('[name$=\\[country_select\\]]').val();
                if (country == undefined || country == '') {
                    country = 'US';
                }
                response($.map(data.result, function(item, index) {
                    return {
                        label: item.label,
                        value: item.value,
                        selected: item.value.indexOf(country) != -1
                    };
                }));
            });
        }
    },
    {
        selector: 'select[id$=state]',
        requires: ['select[id$=country]'],
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
                var state = $('[name$=\\[state_select\\]]').val();
                if (state == undefined || state == '') {
                    state = 'CA';
                }
                response($.map(data.result, function(item, index) {
                    return {
                        label: item.label,
                        value: item.value,
                        selected: item.value.indexOf(state) != -1
                    };
                }));
            });
        },
    }
    ]
});
