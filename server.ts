import express from 'express';
import {YearIncome, YearEntry, Precaution, MinimalIncome} from './types';



function loggerMiddleware(request: express.Request, response: express.Response, next:express.NextFunction) {
    console.log(`${request.method} ${request.path} ${request.body}`);
    next();
}

  var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

function reviveDates(key: string, value: Object){
    var match;
    if (typeof value === "string" && (match = value.match(regexIso8601))) {
      var milliseconds = Date.parse(match[0]);
      if (!isNaN(milliseconds)) {
        return new Date(milliseconds);
      }
    }
    return value;
}

const app = express();

app.use(express.json( {
    reviver: reviveDates
}));
app.use(loggerMiddleware);

app.post('/calculate', (request, response) => {
    const yearIncome: YearIncome = request.body;
    console.log('bd: ' + yearIncome.birthday + ', years: ' + JSON.stringify(yearIncome.years));

    const precautions= calculatePrecautions(yearIncome);
    response.send(precautions);
});

app.listen(5000);

function calculatePrecautions(yearIncome: YearIncome): Precaution {

    let result= new Precaution();

    let currentYear= new Date().getFullYear();
    let firstOrdinaryYear= yearIncome.birthday.getFullYear() + 21;
    if (firstOrdinaryYear >= currentYear) {
        console.log("Too young");
        throw new Error("Too Young - first ordinary year is in " + firstOrdinaryYear);
    }
    
    const sumup= (prev:number, cur:YearEntry) => prev+cur.income;
    const ordinaryYear= (candidate: YearEntry) => candidate.year >= firstOrdinaryYear && candidate.year <= currentYear;
    const sum= yearIncome.years.filter(ordinaryYear).reduce(sumup, 0);
    const max= (prev: number, cur:YearEntry) => cur.year>prev?cur.year:prev;
    let lastOrdinaryYear= yearIncome.years.reduce(max, 0);
    if (lastOrdinaryYear > currentYear) {
        lastOrdinaryYear= currentYear;
    }
    result.averageIncomeSingle= Math.round(sum/(lastOrdinaryYear-firstOrdinaryYear+1));

    // for each year: find all entrie sand sum up, compare to amoutn
    const youthYears= countYouthYears(yearIncome.years, yearIncome.birthday.getFullYear());
    const missingYears= findMissingYears(yearIncome.years, firstOrdinaryYear, lastOrdinaryYear);
    result.missingyears= Math.max(missingYears-youthYears, 0);
    result.consideredYouthYears= youthYears;
    result.lastConsideredYear= lastOrdinaryYear;
    console.log(JSON.stringify(result));
    return result;
}

function findMissingYears(years: YearEntry[], firstYear: number, lastYear: number): number {
    let missingYears= 0;
    for (let year:number= firstYear; year <= lastYear; year++) {
        let summed= getSummedEntryForYear(years, year);
        let expectedIncome= getExpectedIncome(year);
        if (summed.income < expectedIncome) {
            missingYears++;
        }
    }
    return missingYears;
}

function getExpectedIncome(year: number):  number {
    for (var minimalIncome of minimalIncomes) {
        if (year >= minimalIncome.startYear) {
            return minimalIncome.incomeEmployed;
        }
    }
    if (year < 1969) {
        return 0;
    }
}

function countYouthYears(years: YearEntry[], birthyear: number): number {
    let youyea= 0;
    const youthYears= [18+birthyear, 19+birthyear, 20+birthyear];
    for (var year of youthYears) {
        let entry= getSummedEntryForYear(years, year);
        if (entry.income > 0) {
            youyea++;
        }
    }
    return youyea;
}

function getSummedEntryForYear(years: YearEntry[], candidateYear: number): YearEntry {
    const sumup= (prev:number, cur:YearEntry) => prev+cur.income;
    const sum= years.filter((candidate: YearEntry) => candidate.year === candidateYear).reduce(sumup, 0);
    let result= new YearEntry();
    result.year= candidateYear;
    result.income= sum;
    return result;
}

const minimalIncomes= [
    new MinimalIncome(1969, 800, 1540),
    new MinimalIncome(1973, 1000, 2000),
    new MinimalIncome(1976, 1000, 1950),
    new MinimalIncome(1979, 2000, 3960),
    new MinimalIncome(1982, 2500, 4940),
    new MinimalIncome(1986, 3000, 5930),
    new MinimalIncome(1990, 3208, 6334),
    new MinimalIncome(1992, 3564, 7038),
    new MinimalIncome(1996, 3861, 7623),
    new MinimalIncome(2003, 4208, 8307),
    new MinimalIncome(2007, 4406, 8698),
    new MinimalIncome(2009, 4554, 8991),
    new MinimalIncome(2011, 4612, 9094),
    new MinimalIncome(2013, 4667, 9333),
    new MinimalIncome(2019, 4702, 9405)

];
