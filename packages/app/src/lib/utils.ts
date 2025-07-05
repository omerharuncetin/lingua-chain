import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address, zeroAddress } from "viem"

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBadgeAddressByLevel = (level: CEFRLevel): Address => {
  return zeroAddress;
}