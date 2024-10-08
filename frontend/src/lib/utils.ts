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

export function properizeWord(word: string): string {
  const splittedWords = word.split(" ");
  let result: string = "";
  splittedWords.forEach((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    result += firstLetter + restOfWord + " ";
  });

  return result.trim();
}

export function properizePhoneNumber(phoneNumber: string): string | null {
  const trimmed = phoneNumber.replace(/\s/g, "");
  const firstDigit = phoneNumber.charAt(0);

  const digits = trimmed.match(/\d/g);
  const isValid = digits && digits.length === trimmed.length;

  if (!isValid) return null;

  if (Number(firstDigit) === 0) {
    return trimmed;
  } else if (Number(firstDigit) === 6) {
    const rest = trimmed.slice(2);
    return "0" + rest;
  } else if (firstDigit === "+") {
    return trimmed.slice(1);
  } else if (Number(firstDigit) === 8) {
    return "0" + trimmed;
  } else {
    return null;
  }
}
