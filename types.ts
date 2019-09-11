export type YearIncome = {
    birthday: Date;
    years: YearEntry[];
}

export class YearEntry {
    year: number;
    income: number;
}

export class Precaution {
    missingyears: number;
    consideredYouthYears: number;
    age: number;
    averageIncomeSingle: number;
    averageIncomeMarried: number;
    lastConsideredYear: number;
    yearsMarried: number;
    gender: Gender;
}

export class MinimalIncome {
    startYear: number;
    incomeEmployed: number;
    incomeSelfEmployed: number;
    constructor(startYear: number, incomeEmployed: number, incomeSelfEmployed: number) {
        this.startYear= startYear;
        this.incomeEmployed= incomeEmployed;
        this.incomeSelfEmployed= incomeSelfEmployed;
    }
}

export enum Gender {male, female, other}