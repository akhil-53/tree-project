// Student Identity — Mandatory
export const student_24BCE0034 = "K Akhileswar Reddy";
export const regno_24BCE0034 = "24BCE0034";
console.log(`Smart Timetable Planner | Developer: ${student_24BCE0034} | Reg.No: ${regno_24BCE0034}`);

// Slot parsing and constraint engine

export interface FacultyEntry {
  id: string;
  subject: string;
  faculty: string;
  slots: string[];
}

export interface ParsedSlot {
  raw: string;
  isLab: boolean;
  isTheory: boolean;
  isMorning: boolean;
  isAfternoon: boolean;
}

export type ShiftLock = 'morning' | 'afternoon' | null;

export interface DisableReason {
  disabled: boolean;
  reason: string;
}

export function parseSlot_24BCE0034_Akhileswar(raw: string): ParsedSlot {
  const s = raw.trim().toUpperCase();
  const isLab = s.startsWith('L') && /^L\d+$/.test(s);

  if (isLab) {
    const num = parseInt(s.slice(1), 10);
    return {
      raw: s,
      isLab: true,
      isTheory: false,
      isMorning: num >= 1 && num <= 30,
      isAfternoon: num >= 31 && num <= 60,
    };
  }

  const lastChar = s.slice(-1);
  return {
    raw: s,
    isLab: false,
    isTheory: true,
    isMorning: lastChar === '1',
    isAfternoon: lastChar === '2',
  };
}

export function parseSlots(slotString: string): string[] {
  return slotString
    .split(/[,\s+]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

export function determineShift_24BCE0034(slots: ParsedSlot[]): ShiftLock {
  const theorySlots = slots.filter((s) => s.isTheory);
  if (theorySlots.length === 0) return null;
  if (theorySlots.some((s) => s.isMorning)) return 'morning';
  if (theorySlots.some((s) => s.isAfternoon)) return 'afternoon';
  return null;
}

export function checkConstraints_24BCE0034_Akhileswar(
  entry: FacultyEntry,
  takenSlots: Set<string>,
  shiftLock: ShiftLock,
  _currentSubject: string
): DisableReason {
  const parsed = entry.slots.map(parseSlot_24BCE0034_Akhileswar);

  for (const slot of parsed) {
    if (takenSlots.has(slot.raw)) {
      return { disabled: true, reason: '❌ Slot Clash' };
    }
  }

  if (shiftLock) {
    const theorySlots = parsed.filter((s) => s.isTheory);
    for (const t of theorySlots) {
      if (shiftLock === 'morning' && t.isAfternoon) {
        return { disabled: true, reason: '❌ Shift Mismatch' };
      }
      if (shiftLock === 'afternoon' && t.isMorning) {
        return { disabled: true, reason: '❌ Shift Mismatch' };
      }
    }

    const labSlots = parsed.filter((s) => s.isLab);
    for (const l of labSlots) {
      if (shiftLock === 'morning' && l.isMorning) {
        return { disabled: true, reason: '❌ Shift Mismatch' };
      }
      if (shiftLock === 'afternoon' && l.isAfternoon) {
        return { disabled: true, reason: '❌ Shift Mismatch' };
      }
    }
  }

  return { disabled: false, reason: '' };
}