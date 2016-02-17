(function ($) {
    $(document).ready(function () {
        var container = $('#skating-container');

        function init() {
            container
                .append('<input id="skating-judges">')
                .append('<input id="skating-competitors">')
                .append('<a id="skating-generate-table" href="javascript:void(0);" class="btn btn-default">Сгенерировать таблицу</a>')
                .append('<a id="skating-submit" href="javascript:void(0);" class="btn btn-default">Подсчитать</a>')
                .append('<div id="skating-table"></div>')
                .append('<div id="skating-result"></div>');
        }

        function parse(table) {
            var results = {};
            var selects = table.find('select');
            selects.each(function (i, v) {
                var index = (+$(v).attr('data-i')) + 1,
                    value = +$(v).find('option:selected').val();
                if (results[index] === undefined) {
                    results[index] = [value];
                } else {
                    results[index].push(value);
                }
            });
            return results;
        }

        function verify(data, judges) {
            var keys = Object.keys(data),
                places = {};
            for (var i = 0; i < keys.length; i++) {
                var w = data[keys[i]];
                for (var j = 0; j < w.length; j++) {
                    if (places[w[j]] === undefined) {
                        places[w[j]] = 1;
                    } else {
                        places[w[j]]++;
                    }
                }
            }
            for (var i in places) {
                if (places[i] != judges) {
                    return false;
                }
            }
            return true;
        }

        function showResult(result) {
            var table = result.table;
            var tableW = '<table>';
            var thead = '<thead><tr>';
            for (var i = 0; i < table[0].length; i++) {
                thead += '<th>' + table[0][i] + '</th>';
            }
            thead += '</tr></thead>';
            tableW += thead;
            var tbody = '<tbody>';
            for (var i = 1; i < table.length; i++) {
                tbody += '<tr>';
                for (var j = 0; j < table[i].length; j++) {
                    tbody += '<td>' + table[i][j] + '</td>';
                }
                tbody += '</tr>';
            }
            tbody += '</tbody>';
            tableW += tbody;
            skatingResult.append(tableW);
        }

        init();

        var judgesInput = $('#skating-judges'),
            competitorsInput = $('#skating-competitors'),
            generateTableButton = $('#skating-generate-table'),
            submitButton = $('#skating-submit'),
            skatingResult = $('#skating-result');

        generateTableButton.on('click', function () {
            var judges = +judgesInput.val(),
                competitors = +competitorsInput.val();
            var table = $('#skating-table');
            table.empty();
            for (var k = 0; k < competitors; k++) {
                for (var i = 0; i < judges; i++) {
                    var w = '<select data-i="' + k + '" data-j="' + i + '" ><option value="-" selected="selected" disabled="disabled">-</option>';
                    for (var j = 0; j < competitors; j++) {
                        w += '<option value="' + (j + 1) + '">' + (j + 1) + '</option>';
                    }
                    w += '</select>';
                    table.append(w);
                }
                table.append('<br>');
            }
        });

        submitButton.on('click', function () {
            var table = $('#skating-table'),
                data = parse(table),
                judges = +judgesInput.val();
            if (verify(data, judges)) {
                Skating.judges = judges;
                var result = Skating.calc(data);
                showResult(result);
            } else {
                console.log('not verified');
            }
        })
    })
})(jQuery);