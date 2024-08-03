import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomColors() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function getRandomNumber(minNum: number, maxNum: number): number {
  return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
}

export function getRandomMultipleOfFive(
  minNum: number,
  maxNum: number
): number {
  if (minNum % 5 !== 0) {
    minNum = Math.ceil(minNum / 5) * 5;
  }

  const multiplesOfFive: number[] = [];
  for (let i = minNum; i <= maxNum; i += 5) {
    multiplesOfFive.push(i);
  }

  if (multiplesOfFive.length === 0) {
    return maxNum;
  }

  const randomIndex = Math.floor(Math.random() * multiplesOfFive.length);
  return multiplesOfFive[randomIndex];
}
