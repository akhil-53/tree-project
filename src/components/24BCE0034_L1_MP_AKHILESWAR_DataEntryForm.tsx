import { useState } from 'react';
import { parseSlots, type FacultyEntry } from '@/lib/24BCE0034_L1_MP_AKHILESWAR_slotEngine';
import { Plus, Trash2, TreePine, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

interface Props {
  entries: FacultyEntry[];
  onAdd: (entry: FacultyEntry) => void;
  onDelete: (id: string) => void;
  onMoveUp: (subjectName: string) => void;
  onMoveDown: (subjectName: string) => void;
  onClearAll: () => void;
  onGenerate: () => void;
}

export default function DataEntryForm_24BCE0034_Akhileswar({
  entries, onAdd, onDelete, onMoveUp, onMoveDown, onClearAll, onGenerate
}: Props) {
  const [subject, setSubject] = useState('');
  const [faculty, setFaculty] = useState('');
  const [slotsRaw, setSlotsRaw] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAdd_24BCE0034 = () => {
    if (!subject.trim() || !faculty.trim() || !slotsRaw.trim()) return;
    const slots = parseSlots(slotsRaw);
    if (slots.length === 0) return;
    onAdd({
      id: crypto.randomUUID(),
      subject: subject.trim(),
      faculty: faculty.trim(),
      slots,
    });
    setFaculty('');
    setSlotsRaw('');
  };

  const grouped = entries.reduce<Record<string, FacultyEntry[]>>((acc, e) => {
    (acc[e.subject] ??= []).push(e);
    return acc;
  }, {});

  const subjects = [...new Set(entries.map((e) => e.subject))];

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#111827',
    fontSize: 13,
    outline: 'none',
    transition: 'border 0.15s ease',
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
    display: 'block' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Entry Form */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
          Add Faculty Entry
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input
              placeholder="e.g. Data Structures"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Faculty</label>
            <input
              placeholder="e.g. Dr. Smith"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Slots (comma-separated)</label>
            <input
              placeholder="e.g. A1, TA1, L35, L36"
              value={slotsRaw}
              onChange={(e) => setSlotsRaw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd_24BCE0034()}
              style={inputStyle}
            />
          </div>
        </div>
        <button
          onClick={handleAdd_24BCE0034}
          style={{
            marginTop: 16,
            padding: '9px 18px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
          }}
        >
          <Plus style={{ width: 15, height: 15 }} /> Add Entry
        </button>
      </div>

      {/* Entries List */}
      {subjects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Added Entries</h2>
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, padding: '6px 12px', borderRadius: 7,
                  border: '1px solid #fecaca',
                  backgroundColor: '#fff5f5', color: '#dc2626', cursor: 'pointer',
                }}
              >
                <RotateCcw style={{ width: 12, height: 12 }} /> Clear All
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ color: '#6b7280' }}>Are you sure?</span>
                <button
                  onClick={() => { onClearAll(); setShowClearConfirm(false); }}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: 'none',
                    backgroundColor: '#dc2626', color: '#ffffff', cursor: 'pointer', fontWeight: 600,
                  }}
                >Yes</button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  style={{
                    padding: '5px 12px', borderRadius: 6,
                    border: '1px solid #e5e7eb', backgroundColor: '#ffffff',
                    color: '#374151', cursor: 'pointer',
                  }}
                >Cancel</button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {subjects.map((sub, idx) => (
              <div key={sub} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                {/* Subject header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>{sub}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
                      backgroundColor: '#eef2ff', color: '#4f46e5',
                    }}>#{idx + 1}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => onMoveUp(sub)}
                      disabled={idx === 0}
                      style={{
                        width: 26, height: 26, borderRadius: 6, border: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb', cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: idx === 0 ? '#d1d5db' : '#6b7280',
                      }}
                    >
                      <ChevronUp style={{ width: 13, height: 13 }} />
                    </button>
                    <button
                      onClick={() => onMoveDown(sub)}
                      disabled={idx === subjects.length - 1}
                      style={{
                        width: 26, height: 26, borderRadius: 6, border: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                        cursor: idx === subjects.length - 1 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: idx === subjects.length - 1 ? '#d1d5db' : '#6b7280',
                      }}
                    >
                      <ChevronDown style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>

                {/* Faculty list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {grouped[sub].map((entry) => (
                    <div key={entry.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 8,
                      backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
                    }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                          {entry.faculty}
                        </span>
                        <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>
                          [{entry.slots.join(', ')}]
                        </span>
                      </div>
                      <button
                        onClick={() => onDelete(entry.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#ef4444', padding: 4, borderRadius: 4,
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Trash2 style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onGenerate}
            style={{
              padding: '11px 24px',
              borderRadius: 10,
              border: 'none',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
              alignSelf: 'flex-start',
            }}
          >
            <TreePine style={{ width: 16, height: 16 }} /> Generate Mind Map
          </button>
        </div>
      )}
    </div>
  );
}