function fillArrayWithValue(n, v) {
    var arr = Array.apply(null, new Array(n));
    return arr.map(function (x, i) {
        return {index: i, value: v}
    });
}

function validate(results) {
    return true;
}

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

//var results = {
//    '1': [1, 2, 1, 3, 4],
//    '2': [4, 3, 4, 5, 5],
//    '3': [5, 5, 5, 4, 2],
//    '4': [2, 1, 2, 2, 1],
//    '5': [3, 4, 3, 1, 3]
//};

//var results = {
//    '1': [1, 2, 2, 1, 3],
//    '2': [2, 1, 1, 2, 2],
//    '3': [3, 2, 3, 3, 1]
//};

//var results = {
//    '1': [3, 1, 2, 1, 1, 2, 1],
//    '2': [2, 2, 3, 5, 2, 3, 2],
//    '3': [4, 4, 4, 3, 3, 1, 3],
//    '4': [1, 6, 5, 2, 5, 6, 5],
//    '5': [5, 3, 1, 7, 6, 5, 7],
//    '6': [6, 5, 6, 4, 7, 7, 4],
//    '7': [7, 7, 7, 6, 4, 4, 6]
//};

var results = {
    '1': [1, 2, 3],
    '2': [2, 3, 1],
    '3': [3, 1, 2]
};

var judges = 3;

function calc(results) {
    var dancers = [];
    if (validate(results)) {
        var index = 0;
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

        //console.log(dancers);

        var placeCounter = 1;

        var majority = Math.floor(judges / 2) + 1;

        var roundsCount = dancers.length;
        for (var round = 1; round <= roundsCount; round++) {
            console.log('step ' + round + ': ');
            var currentMajorities = fillArrayWithValue(dancers.length, 0);
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
                if (currentMajorities[i].value > majority && !dancers[i].excluded) {
                    dancers[i].majority = currentMajorities[i].value;
                    winners.push(dancers[i]);
                }
            }

            //console.log(winners);

            if (winners.length == 1) {
                console.log(winners[0].num + ' -- ' + placeCounter + ' place');
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
                            console.log(w[i].num + ' -- ' + placeCounter + ' place');
                            dancers[w[i].index].excluded = true;
                        }
                        placeCounter++;
                    }
                }
            }
            //console.log(winners);
            console.log('=====');
        }
    } else {

    }
}

calc(results);