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

export const getCertificateAddressByLevel = (level: CEFRLevel): Address => {
  switch (level) {
    case 'A1':
      return "0x1983d9d42defef35a6be64c0669d979e4b878247"
    case 'A2':
      return '0xc1420209ca65750da33c11abe0f48a9a8f044c33';
    case 'B1':
      return '0xbed78013f3f0935f04f93aa83de8a6ea61de5baa';
     case 'B2':
      return '0x7b14c4c66d6d3a28ddc70ea677959c907ada9e1d';
    case 'C1':
      return '0x5921361ed9cd6e67cd8870b84e6c2d4c7244d5bb';
    case 'C2':
      return '0x41ed27f978463b21639704883f1466a67c0e56af';
    default:
      return zeroAddress
  }
}