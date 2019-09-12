"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var types_1 = require("./types");
function loggerMiddleware(request, response, next) {
    console.log(request.method + " " + request.path + " " + request.body);
    next();
}
var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
function reviveDates(key, value) {
    var match;
    if (typeof value === "string" && (match = value.match(regexIso8601))) {
        var milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
            return new Date(milliseconds);
        }
    }
    return value;
}
var app = express_1.default();
app.use(express_1.default.json({
    reviver: reviveDates
}));
app.use(loggerMiddleware);
app.post('/calculate', function (request, response) {
    var yearIncome = request.body;
    console.log('bd: ' + yearIncome.birthday + ', years: ' + JSON.stringify(yearIncome.years));
    var precautions = calculatePrecautions(yearIncome);
    response.send(precautions);
});
app.listen(5000);
function calculatePrecautions(yearIncome) {
    var result = new types_1.Precaution();
    var currentYear = new Date().getFullYear();
    var firstOrdinaryYear = yearIncome.birthday.getFullYear() + 21;
    if (firstOrdinaryYear >= currentYear) {
        console.log("Too young");
        throw new Error("Too Young - first ordinary year is in " + firstOrdinaryYear);
    }
    var sumup = function (prev, cur) { return prev + cur.income; };
    var ordinaryYear = function (candidate) { return candidate.year >= firstOrdinaryYear && candidate.year <= currentYear; };
    var sum = yearIncome.years.filter(ordinaryYear).reduce(sumup, 0);
    var max = function (prev, cur) { return cur.year > prev ? cur.year : prev; };
    var lastOrdinaryYear = yearIncome.years.reduce(max, 0);
    if (lastOrdinaryYear > currentYear) {
        lastOrdinaryYear = currentYear;
    }
    result.averageIncomeSingle = Math.round(sum / (lastOrdinaryYear - firstOrdinaryYear + 1));
    // for each year: find all entrie sand sum up, compare to amoutn
    var youthYears = countYouthYears(yearIncome.years, yearIncome.birthday.getFullYear());
    var missingYears = findMissingYears(yearIncome.years, firstOrdinaryYear, lastOrdinaryYear);
    result.missingyears = Math.max(missingYears - youthYears, 0);
    result.consideredYouthYears = youthYears;
    result.lastConsideredYear = lastOrdinaryYear;
    console.log(JSON.stringify(result));
    return result;
}
function findMissingYears(years, firstYear, lastYear) {
    var missingYears = 0;
    for (var year = firstYear; year <= lastYear; year++) {
        var summed = getSummedEntryForYear(years, year);
        var expectedIncome = getExpectedIncome(year);
        if (summed.income < expectedIncome) {
            missingYears++;
        }
    }
    return missingYears;
}
function getExpectedIncome(year) {
    for (var _i = 0, minimalIncomes_1 = minimalIncomes; _i < minimalIncomes_1.length; _i++) {
        var minimalIncome = minimalIncomes_1[_i];
        if (year >= minimalIncome.startYear) {
            return minimalIncome.incomeEmployed;
        }
    }
    if (year < 1969) {
        return 0;
    }
}
function countYouthYears(years, birthyear) {
    var youyea = 0;
    var youthYears = [18 + birthyear, 19 + birthyear, 20 + birthyear];
    for (var _i = 0, youthYears_1 = youthYears; _i < youthYears_1.length; _i++) {
        var year = youthYears_1[_i];
        var entry = getSummedEntryForYear(years, year);
        if (entry.income > 0) {
            youyea++;
        }
    }
    return youyea;
}
function getSummedEntryForYear(years, candidateYear) {
    var sumup = function (prev, cur) { return prev + cur.income; };
    var sum = years.filter(function (candidate) { return candidate.year === candidateYear; }).reduce(sumup, 0);
    var result = new types_1.YearEntry();
    result.year = candidateYear;
    result.income = sum;
    return result;
}
var minimalIncomes = [
    new types_1.MinimalIncome(1969, 800, 1540),
    new types_1.MinimalIncome(1973, 1000, 2000),
    new types_1.MinimalIncome(1976, 1000, 1950),
    new types_1.MinimalIncome(1979, 2000, 3960),
    new types_1.MinimalIncome(1982, 2500, 4940),
    new types_1.MinimalIncome(1986, 3000, 5930),
    new types_1.MinimalIncome(1990, 3208, 6334),
    new types_1.MinimalIncome(1992, 3564, 7038),
    new types_1.MinimalIncome(1996, 3861, 7623),
    new types_1.MinimalIncome(2003, 4208, 8307),
    new types_1.MinimalIncome(2007, 4406, 8698),
    new types_1.MinimalIncome(2009, 4554, 8991),
    new types_1.MinimalIncome(2011, 4612, 9094),
    new types_1.MinimalIncome(2013, 4667, 9333),
    new types_1.MinimalIncome(2019, 4702, 9405)
];
//# sourceMappingURL=server.js.map