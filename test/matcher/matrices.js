/**
 * @fileoverview jasmine custom matcher for test
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var undef = (function() {})();
module.exports = function() {
    function pickTitle(matrix) {
        var titleList = [],
            i, cnt;

        for (i = 0, cnt = matrix.length; i < cnt; i += 1) {
            if (!matrix[i]) {
                titleList.push(undef);
                continue;
            }

            titleList.push(matrix[i].valueOf().title);
        }

        return titleList;
    }

    function fail(msg) {
        return {
            message: msg,
            pass: false
        };
    }

    function getMatcher(comparator) {
        return function matcher(actual, expected) {
            var i, j, cnt, cnt2,
                aMatrix, aLength, bMatrix, bLength,
                aColumn, aViewModel, bValue,
                result = {
                    message: '매트릭스 일치',
                    pass: true
                };

            if (actual.length !== expected.length) {
                return fail('매트릭스 갯수 불일치\n' +
                            'actual: ' + actual + '\n' +
                            'expected: ' + expected);
            }

            for (i = 0, cnt = actual.length; i < cnt; i += 1) {
                aMatrix = actual[i];
                aLength = aMatrix.length;
                bMatrix = expected[i];
                bLength = bMatrix.length;

                if (aLength !== bLength) {
                    return fail(i + ' 번째 매트릭스 다름\n' +
                                'actual: ' + pickTitle(aMatrix) + '\n' +
                                'expected: ' + bMatrix);
                }

                for (j = 0, cnt2 = aMatrix.length; j < cnt2; j += 1) {
                    aColumn = aMatrix[j];

                    if (!aColumn) {
                        continue;
                    }

                    aViewModel = aColumn;
                    bValue = bMatrix[j];

                    if (!comparator(aViewModel, bValue)) {
                        return fail('[' + i + '][' + j + '] 번째 매트릭스 다름\n' +
                                    'actual: ' + aViewModel + '\n' +
                                    'expected: ' + bValue);
                    }
                }
            }

            return result;
        };
    }

    function titleComparator(viewModel, title) {
        return viewModel.model.title === title;
    }

    function topComparator(viewModel, top) {
        return viewModel.top === top;
    }

    return {
        toEqualMatricesTitle: function() {
            return {
                compare: getMatcher(titleComparator)
            };
        },
        toEqualMatricesTop: function() {
            return {
                compare: getMatcher(topComparator)
            };
        }
    };
};

