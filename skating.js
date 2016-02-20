/*!
 *  SkatingJS by @octav47 - http://tribunsky.com
 *  License - GNU GENERAL PUBLIC LICENSE Version 3
 */

var Skating = {
    validate: function (results) {
        return true; // verification at view module
    },
    fillArrayWithValue: function (n, v) {
        var arr = Array.apply(null, new Array(n));
        return arr.map(function (x, i) {
            return {index: i, value: v}
        });
    },
    judges: 3,
    calc: function (results) {
        var dancers = [];
        if (Skating.validate(results)) {
            var table = [],
                places = {},
                index = 0;
            for (var i in results) {
                if (results.hasOwnProperty(i)) {
                    var d = new Dancer(i);
                    d.index = index;
                    d.points = results[i];
                    d.updateSum();
                    dancers.push(d);
                    index++;
                }
            }

            for (var i = 0; i < dancers.length + 1; i++) {
                var row = [];
                for (var j = 0; j < dancers.length; j++) {
                    row.push([]);
                }
                table.push(row);
            }

            for (var i = 1; i <= dancers.length; i++) {
                places[i] = [];
            }

            var placeCounter = 1;

            var majority = Math.floor(Skating.judges / 2) + 1;

            var roundsCount = dancers.length;

            for (var i = 0; i < roundsCount; i++) {
                table[0][i] = '1' + ((i == 0) ? '' : '-' + (i + 1));
            }

            //console.log(majority);

            for (var round = 1; round <= roundsCount; round++) {
                //console.log('step ' + round + ': ');
                var currentMajorities = Skating.fillArrayWithValue(dancers.length, 0);
                for (var i = 0; i < dancers.length; i++) {
                    var currentPoints = dancers[i].points;
                    for (var j = 0; j < currentPoints.length; j++) {
                        if (currentPoints[j] <= round) {
                            currentMajorities[i].value++;
                        }
                    }
                }

                var winners = [];
                for (var i = 0; i < currentMajorities.length; i++) {
                    if (currentMajorities[i].value >= majority && !dancers[i].excluded) {
                        dancers[i].majority = currentMajorities[i].value;
                        winners.push(dancers[i]);
                    }
                }

                for (var rt = 0; rt < currentMajorities.length; rt++) {
                    table[rt + 1][round - 1] = (dancers[rt].excluded) ? '-' : currentMajorities[rt].value;
                }

                if (winners.length == 1) {
                    console.log(winners[0].num + ' -- ' + placeCounter + ' place');
                    places[placeCounter].push(winners[0].num);
                    placeCounter++;
                    dancers[winners[0].index].excluded = true;
                } else {
                    winners.sort(function (a, b) {
                        return b.value - a.value;
                    });

                    var winnersObj = {};
                    for (var i = 0; i < winners.length; i++) {
                        if (winnersObj[winners[i].majority] === undefined) {
                            winnersObj[winners[i].majority] = [winners[i]];
                        } else {
                            winnersObj[winners[i].majority].push(winners[i]);
                        }
                    }

                    var keys = Object.keys(winnersObj);
                    keys.sort(function (a, b) {
                        return b - a;
                    });

                    while (keys.length > 0) {
                        var cWinners = winnersObj[keys.shift()];
                        cWinners.sort(function (a, b) {
                            return b.sum - a.sum;
                        });
                        var sums = {};
                        for (var i = 0; i < cWinners.length; i++) {
                            if (sums[cWinners[i].sum] === undefined) {
                                sums[cWinners[i].sum] = [cWinners[i]];
                            } else {
                                sums[cWinners[i].sum].push(cWinners[i]);
                            }
                            //console.log(cWinners[i]);
                            //console.log(cWinners[i].num + ' -- ' + placeCounter + ' place');
                            //placeCounter++;
                            //dancers[cWinners[i].index].excluded = true;
                        }
                        var sumsKeys = Object.keys(sums);
                        sumsKeys.sort(function (a, b) {
                            return (+b) - (+a);
                        });
                        for (var i = 0; i < sumsKeys.length; i++) {
                            var w = sums[sumsKeys[i]];
                            for (var j = 0; j < w.length; j++) {
                                //console.log(w[j].num + ' -- ' + placeCounter + ' place');
                                places[placeCounter].push(w[j].num);
                                dancers[w[j].index].excluded = true;
                            }
                            //console.log(w);
                            placeCounter++;
                        }
                    }
                }
                //console.log(winners);
                //console.log('=====');
            }

            //console.log(places);

            return {
                places: places,
                table: table
            };
        } else {

        }
    }
};

var Dancer = function (num) {
    var self = this;

    this.index = 0;

    this.num = num;
    this.points = [];

    this.sum = 0;
    this.updateSum = function () {
        var s = 0;
        for (var i = 0; i < self.points.length; i++) {
            s += self.points[i];
        }
        self.sum = s;
    };

    this.majority = 0;

    this.excluded = false;
};