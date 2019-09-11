"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var YearEntry = /** @class */ (function () {
    function YearEntry() {
    }
    return YearEntry;
}());
exports.YearEntry = YearEntry;
var Precaution = /** @class */ (function () {
    function Precaution() {
    }
    return Precaution;
}());
exports.Precaution = Precaution;
var MinimalIncome = /** @class */ (function () {
    function MinimalIncome(startYear, incomeEmployed, incomeSelfEmployed) {
        this.startYear = startYear;
        this.incomeEmployed = incomeEmployed;
        this.incomeSelfEmployed = incomeSelfEmployed;
    }
    return MinimalIncome;
}());
exports.MinimalIncome = MinimalIncome;
var Gender;
(function (Gender) {
    Gender[Gender["male"] = 0] = "male";
    Gender[Gender["female"] = 1] = "female";
    Gender[Gender["other"] = 2] = "other";
})(Gender = exports.Gender || (exports.Gender = {}));
//# sourceMappingURL=types.js.map