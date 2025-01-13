import { PackId } from "./types";

export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CreditsPacks = {
  [PackId.SMALL]: {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "500 credits",
    credits: 500,
    price: 199,
  },
  [PackId.MEDIUM]: {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 299,
  },
  [PackId.LARGE]: {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 999,
  },
};
