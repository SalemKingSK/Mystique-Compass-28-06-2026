// src/lib/numerology.ts
import type { AstroInsightInput, PersonalYearData } from '@/components/profile-generator/types';
import { 
  COMPOUND_NUMBER_MEANINGS, 
  DESTINY_NUMBER_MEANINGS, 
  KUA_DATA, 
  PSYCHIC_NUMBER_MEANINGS, 
  REPEATED_NUMBER_MEANINGS,
  lindaGoodmanMeanings
} from './numerology/data';
import { getActiveArrows } from './arrow-analysis';

// --- HELPER FUNCTIONS ---
const reduceToSingleDigit = (n: number): number => {
  if (n <= 9) return n;
  const sum = String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
};

const reduceOnce = (n: number): number => {
    return String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

// --- CORE NUMBER CALCULATIONS ---
export const calculatePsyche = (day: number): number => {
    if (day > 9) {
         const sum = String(day).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
         return reduceToSingleDigit(sum);
    }
    return day;
};

export const calculateDestiny = (day: number, month: number, year: number): number => {
  const fullDateStr = String(day) + String(month) + String(year);
  const sum = fullDateStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
};

/**
 * Core Algorithm for Kua Number Calculation
 * Implements the Solar Trigger, Pre/Post 2000 formulas, and Rule of 5.
 */
export const calculateKua = (year: number, month: number, day: number, gender: string): number => {
  let adjustedYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    adjustedYear = year - 1;
  }

  const lastTwoDigits = adjustedYear % 100;
  let yearRoot = String(lastTwoDigits).split('').reduce((a, d) => a + parseInt(d, 10), 0);
  while (yearRoot > 9) {
    yearRoot = String(yearRoot).split('').reduce((a, d) => a + parseInt(d, 10), 0);
  }

  let kua = 0;
  const isPost2000 = adjustedYear >= 2000;

  if (gender.toLowerCase() === 'male') {
    kua = isPost2000 ? (9 - yearRoot) : (10 - yearRoot);
    if (kua <= 0) kua += 9;
    if (kua === 5) kua = 2;
  } else {
    kua = isPost2000 ? (6 + yearRoot) : (5 + yearRoot);
    while (kua > 9) {
      kua = String(kua).split('').reduce((a, d) => a + parseInt(d, 10), 0);
    }
    if (kua === 5) kua = 8;
  }

  return kua;
};

// --- DATA INTERFACES ---
export interface ArrowData {
    id: string;
    name: string;
    description: string;
    numbers: number[];
    category?: string;
    type?: 'strength' | 'weakness' | 'shadow';
}

export interface NumerologyData {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  psycheNum: number;
  destinyNum: number;
  compoundNum: number | null;
  compoundMeaning: string | null;
  reducedCompoundNum: number | null;
  reducedCompoundMeaning: string | null;
  karmicFateNum: number | null;
  karmicFateMeaning: string | null;
  psychicMeaning: { title: string; description: string; };
  specialTraitMeaning: string | null;
  destinyMeaning: { title: string; description: string; };
  kuaNum: number;
  kuaAttributes: {
    element: string;
    group: string;
    trigram: string;
    lucky_colours: string[];
    directions: { [key: string]: string };
  };
  loShuGrid: (string | null)[][];
  numberCounts: { [key: string]: number };
  repeatedNumberMeanings: { [key: string]: string };
  arrowsOfStrength: ArrowData[];
  arrowsOfWeakness: ArrowData[];
  personalYears?: PersonalYearData[];
}

// --- MAIN GRID GENERATION FUNCTION ---
export const generateLoShuData = (input: AstroInsightInput): NumerologyData => {
  const { day, month, year, gender } = input;
  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  const kuaNum = calculateKua(year, month, day, gender);

  // --- LO SHU GRID COUNT CALCULATION ---
  // Layer 1: Birth digits (all non-zero digits from the full date string)
  const birthDigitsForGrid = (String(day) + String(month) + String(year))
    .split('')
    .map(d => parseInt(d, 10))
    .filter(d => d !== 0);

  // Layer 2: Main Compound Number digits only
  // Sum of all date digits. If 2-digit result, add each digit separately.
  // If 1-digit result, add it once.
  const birthDateSum = String(day).split('').reduce((a, b) => a + Number(b), 0) +
                       String(month).split('').reduce((a, b) => a + Number(b), 0) +
                       String(year).split('').reduce((a, b) => a + Number(b), 0);
  const compoundDigitsForGrid = birthDateSum >= 10
    ? String(birthDateSum).split('').map(Number).filter(d => d !== 0)
    : birthDateSum > 0 ? [birthDateSum] : [];

  // Grid = birth digits + compound digits only
  // Psychic Number, Life Path, and Kua are intentionally excluded from grid display
  const allDigitsForGrid = [
    ...birthDigitsForGrid,    // Layer 1: raw birth digits
    ...compoundDigitsForGrid, // Layer 2: compound number digits (e.g. 17 → 1 and 7)
  ];

  const numberCounts: { [key: string]: number } = {};
  for (const digit of allDigitsForGrid) {
    if (digit > 0) numberCounts[digit] = (numberCounts[digit] || 0) + 1;
  }

  const gridContent: { [key: string]: string } = {};
  for (let i = 1; i <= 9; i++) {
    const digitStr = String(i);
    if (numberCounts[digitStr]) gridContent[digitStr] = digitStr.repeat(numberCounts[digitStr]);
  }

  const loShuGrid = [
    [gridContent['4'] || null, gridContent['9'] || null, gridContent['2'] || null],
    [gridContent['3'] || null, gridContent['5'] || null, gridContent['7'] || null],
    [gridContent['8'] || null, gridContent['1'] || null, gridContent['6'] || null],
  ];

  const compoundNum = (birthDateSum >= 10 && COMPOUND_NUMBER_MEANINGS[birthDateSum as keyof typeof COMPOUND_NUMBER_MEANINGS]) ? birthDateSum : null;
  const compoundMeaning = compoundNum ? COMPOUND_NUMBER_MEANINGS[compoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] : null;
  const firstReduction = reduceOnce(birthDateSum);
  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;
  if (firstReduction >= 10 && firstReduction !== birthDateSum && COMPOUND_NUMBER_MEANINGS[firstReduction as keyof typeof COMPOUND_NUMBER_MEANINGS]) {
      reducedCompoundNum = firstReduction;
      reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[firstReduction as keyof typeof COMPOUND_NUMBER_MEANINGS];
  }

  const rawKarmicSum = day + month + year;
  const karmicCandidate = String(rawKarmicSum).split('').reduce((a, b) => a + Number(b), 0);
  const karmicFateNum = (karmicCandidate >= 10 && lindaGoodmanMeanings[karmicCandidate]) ? karmicCandidate : null;
  const karmicFateMeaning = karmicFateNum ? lindaGoodmanMeanings[karmicFateNum] : null;

  const birthDateString = `${day}-${month}-${year}`;
  const allActiveArrows = getActiveArrows(birthDateString, numberCounts);

  const arrowsOfStrength: ArrowData[] = allActiveArrows
    .filter(s => s.definition.state === 'full')
    .map(s => ({
      id: s.definition.id,
      name: s.definition.name,
      description: s.definition.coreTrait,
      numbers: s.definition.numbers,
      category: s.definition.type === 'bridge' ? 'Minor Bridge' : s.definition.type === 'diagonal' && (s.definition.id === 'prosperity' || s.definition.id === 'stability-emotional') ? 'Secondary Plane' : 'Primary Plane',
      type: 'strength'
    }));

  const arrowsOfWeakness: ArrowData[] = allActiveArrows
    .filter(s => s.definition.state === 'empty')
    .map(s => ({
      id: s.definition.id,
      name: s.definition.name,
      description: s.definition.coreTrait,
      numbers: s.definition.numbers,
      category: 'Deficiency',
      type: 'shadow'
    }));

  let kuaLookupKey = String(kuaNum);
  if (kuaNum === 2 && gender.toLowerCase() === 'male' && String(year).split('').reduce((a, b) => a + Number(b), 0) % 9 === 5) kuaLookupKey = '5_male';
  else if (kuaNum === 8 && gender.toLowerCase() === 'female' && String(year).split('').reduce((a, b) => a + Number(b), 0) % 9 === 5) kuaLookupKey = '5_female';
  const kuaAttributes = KUA_DATA[kuaLookupKey] || {};
  const psychicMeaning = PSYCHIC_NUMBER_MEANINGS[psycheNum as keyof typeof PSYCHIC_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No meaning available.'};
  const destinyMeaning = DESTINY_NUMBER_MEANINGS[destinyNum as keyof typeof DESTINY_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No meaning available.'};
  const specialTraitMeaning = (day >= 10 && day <= 31) ? (COMPOUND_NUMBER_MEANINGS[day as keyof typeof COMPOUND_NUMBER_MEANINGS] || null) : null;

  return {
    birthDay: day,
    birthMonth: month,
    birthYear: year,
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid,
    numberCounts,
    repeatedNumberMeanings: REPEATED_NUMBER_MEANINGS,
    compoundNum,
    compoundMeaning,
    reducedCompoundNum,
    reducedCompoundMeaning,
    karmicFateNum,
    karmicFateMeaning,
    psychicMeaning,
    specialTraitMeaning,
    destinyMeaning,
    arrowsOfStrength,
    arrowsOfWeakness,
    kuaAttributes: kuaAttributes || { directions: {} }
  };
};