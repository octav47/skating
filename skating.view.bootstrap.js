(function ($) {
    $(document).ready(function () {
        var container = $('#skating-container');

        function init() {
            container
                .append('<div class="col col-lg-6 col-md-6 col-sm-6 col-sx-6"><label class="label">Количтество судей</label><label class="input"><input id="skating-judges" placeholder="Введите число судей"></label></div>')
                .append('<div class="col col-lg-6 col-md-6 col-sm-6 col-sx-6"><label class="label">Количество участников</label><label class="input"><input id="skating-competitors" placeholder="Введите число участников"></label></div>')
                .append('<div class="col col-lg-12 col-md-12 col-sm-12 col-sx-12"><div class="row"><a id="skating-generate-table" href="javascript:void(0);" class="btn btn-default">Сгенерировать таблицу</a></div><div class="row"><a id="skating-submit" href="javascript:void(0);" class="btn btn-default">Подсчитать</a></div></div>')
                .append('<div class="col col-lg-12 col-md-12 col-sm-12 col-sx-12"><div id="skating-table"></div></div>')
                .append('<div class="col col-lg-12 col-md-12 col-sm-12 col-sx-12"><div id="skating-result"></div></div>');
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
            var tableW = '<table class="table table-hover table-striped table-bordered">';
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
                    var w = '<label class="select"><select data-i="' + k + '" data-j="' + i + '" ><option value="-" selected="selected" disabled="disabled">-</option>';
                    for (var j = 0; j < competitors; j++) {
                        w += '<option value="' + (j + 1) + '">' + (j + 1) + '</option>';
                    }
                    w += '</select></label>';
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