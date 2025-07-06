import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address, zeroAddress } from "viem"

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBadgeAddressByLevel = (level: CEFRLevel): Address => {
  switch (level) {
    case 'A1':
      return "0x2b83f2749b92479ad547a2633bb8c5eae8dea1fc"
    case 'A2':
      return '0xcde0ae3249d78031084716b548a02f8b093b2140';
    case 'B1':
      return '0x941a47be52ebb2dfa27b57dc7a3a647e9cb5d36c';
    case 'B2':
      return '0xe4f0e62ac601f4c51f72f5db9e9ff1576f688629';
    case 'C1':
      return '0xd90b6cf1a10525eeceeab84aac3d583b61b1230f';
    case 'C2':
      return '0x916189572166b9711787a5ed07dd24b1f2da10d0';
    default:
      return zeroAddress
  }
}

export const getCertificateAddressByLevel = (level: CEFRLevel): Address => {
  switch (level) {
    case 'A1':
      return "0x48fd1ccb869ec353941e6e217b2961aaebceecbe"
    case 'A2':
      return '0xc1420209ca65750da33c11abe0f48a9a8f044c33';
    case 'B1':
      return '0xbed78013f3f0935f04f93aa83de8a6ea61de5baa';
    case 'B2':
      return '0x7b14c4c66d6d3a28ddc70ea677959c907ada9e1d';
    case 'C1':
      return '0x5921361ed9cd6e67cd8870b84e6c2d4c7244d5bb';
    case 'C2':
      return '0x2c873eaec72c11b412b5886f7be0a5995dd5357b';
    default:
      return zeroAddress
  }
}