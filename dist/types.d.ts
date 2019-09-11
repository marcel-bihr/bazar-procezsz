export declare type YearIncome = {
    birthday: Date;
    years: YearEntry[];
};
export declare class YearEntry {
    year: number;
    income: number;
}
export declare class Precaution {
    missingyears: number;
    consideredYouthYears: number;
    age: number;
    averageIncomeSingle: number;
    averageIncomeMarried: number;
    lastConsideredYear: number;
    yearsMarried: number;
    gender: Gender;
}
export declare class MinimalIncome {
    startYear: number;
    incomeEmployed: number;
    incomeSelfEmployed: number;
    constructor(startYear: number, incomeEmployed: number, incomeSelfEmployed: number);
}
export declare enum Gender {
    male = 0,
    female = 1,
    other = 2
}
