import { CapacityStatus } from '../types';
import { APP_CONFIG } from './constants';

export function getCapacityStatus(allocatedHours: number, capacityHours: number = 40): CapacityStatus {
  if (capacityHours <= 0) return 'balanced';
  const ratio = allocatedHours / capacityHours;
  
  if (ratio > 1.0) {
    return 'overloaded';
  }
  if (ratio >= 0.86) {
    return 'approaching';
  }
  if (ratio >= 0.70) {
    return 'balanced';
  }
  return 'underutilized';
}

export function getCapacityStatusLabel(status: CapacityStatus): string {
  switch (status) {
    case 'underutilized':
      return 'Underutilized';
    case 'balanced':
      return 'Balanced';
    case 'approaching':
      return 'Approaching Capacity';
    case 'overloaded':
      return 'Overloaded';
    case 'overtime':
      return 'In Overtime';
  }
}

export function getCapacityStatusTheme(status: CapacityStatus) {
  switch (status) {
    case 'overloaded':
      return {
        bg: 'bg-[#ffdad6]',
        text: 'text-[#ba1a1a]',
        border: 'border-[#ba1a1a]',
        badgeBg: 'bg-[#ffdad6]',
        badgeText: 'text-[#ba1a1a]',
        barColor: '#ba1a1a',
        accentHex: '#ba1a1a'
      };
    case 'approaching':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-500',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        barColor: '#d97706',
        accentHex: '#d97706'
      };
    case 'balanced':
      return {
        bg: 'bg-[#f0eded]',
        text: 'text-[#141a32]',
        border: 'border-[#141a32]',
        badgeBg: 'bg-[#dce1ff]',
        badgeText: 'text-[#141a32]',
        barColor: '#141a32',
        accentHex: '#141a32'
      };
    case 'underutilized':
      return {
        bg: 'bg-blue-50',
        text: 'text-[#497cff]',
        border: 'border-[#497cff]',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-[#003ea8]',
        barColor: '#497cff',
        accentHex: '#497cff'
      };
    case 'overtime':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-500',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800',
        barColor: '#7c3aed',
        accentHex: '#7c3aed'
      };
  }
}
