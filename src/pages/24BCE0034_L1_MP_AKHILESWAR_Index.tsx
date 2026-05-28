import { useState, useEffect } from 'react';
import DataEntryForm from '@/components/24BCE0034_L1_MP_AKHILESWAR_DataEntryForm';
import InteractiveTree from '@/components/24BCE0034_L1_MP_AKHILESWAR_InteractiveTree';
import type { FacultyEntry } from '@/lib/24BCE0034_L1_MP_AKHILESWAR_slotEngine';

const STORAGE_KEY = 'timetable_24BCE0034_entries';

export default function Index_24BCE0034_Akhileswar() {
  const [phase, setPhase] = useState<1 | 2>(1);

  const [entries, setEntries] = useState<FacultyEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAdd_24BCE0034 = (entry: FacultyEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const handleDelete_24BCE0034 = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleMoveUp_24BCE0034 = (subjectName: string) => {
    setEntries((prev) => {
      const subjects = [...new Set(prev.map((e) => e.subject))];
      const idx = subjects.indexOf(subjectName);
      if (idx <= 0) return prev;
      [subjects[idx - 1], subjects[idx]] = [subjects[idx], subjects[idx - 1]];
      return subjects.flatMap((s) => prev.filter((e) => e.subject === s));
    });
  };

  const handleMoveDown_24BCE0034 = (subjectName: string) => {
    setEntries((prev) => {
      const subjects = [...new Set(prev.map((e) => e.subject))];
      const idx = subjects.indexOf(subjectName);
      if (idx >= subjects.length - 1) return prev;
      [subjects[idx + 1], subjects[idx]] = [subjects[idx], subjects[idx + 1]];
      return subjects.flatMap((s) => prev.filter((e) => e.subject === s));
    });
  };

  const handleClearAll_24BCE0034 = () => {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f8f5' }}>
      {phase === 1 ? (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
          <header style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{
              fontSize: 28, fontWeight: 800, color: '#111827',
              letterSpacing: '-0.03em', marginBottom: 8,
            }}>
              Smart Timetable Planner
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Build a valid timetable with automatic constraint enforcement
            </p>
          </header>
          <DataEntryForm
            entries={entries}
            onAdd={handleAdd_24BCE0034}
            onDelete={handleDelete_24BCE0034}
            onMoveUp={handleMoveUp_24BCE0034}
            onMoveDown={handleMoveDown_24BCE0034}
            onClearAll={handleClearAll_24BCE0034}
            onGenerate={() => entries.length > 0 && setPhase(2)}
          />
        </div>
      ) : (
        <InteractiveTree
          entries={entries}
          onBack={() => setPhase(1)}
        />
      )}
    </div>
  );
}