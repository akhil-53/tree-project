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
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#111827',
    fontSize: 14,
    outline: 'none',
    transition: 'border 0.2s ease',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 8,
    display: 'block' as const,
  };

  const fieldWrapperStyle = {
    flex: '1 1 min(100%, 220px)',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  return (
      // OUTERNMOST WRAPPER
      <div style={{
        width: '100%',
        flex: 1,           // Take up remaining space
        minHeight: 0,      // Crucial for flex children to allow scrolling
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box',
      }}>
      {/* INNER CONTAINER: Controls width and applies massive bottom padding */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 32, 
        width: '100%',
        maxWidth: 800, // Keeps it professional on desktop
        margin: '0 auto',
        padding: '16px 16px 120px 16px', // 120px bottom padding protects the button
      }}>

        {/* Entry Form */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #f3f4f6',
          borderRadius: 16,
          padding: '24px 28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 24 }}>
            Add Faculty Entry
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Subject</label>
              <input
                placeholder="e.g. Data Structures"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>Faculty</label>
              <input
                placeholder="e.g. Dr. Smith"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ ...fieldWrapperStyle, flex: '1 1 min(100%, 280px)' }}>
              <label style={labelStyle}>Slots (comma / space / plus separated)</label>
              <input
                placeholder="e.g. A1, TA1"
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
              marginTop: 24,
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(79,70,229,0.2)',
              width: 'max-content',
              minWidth: '140px',
              touchAction: 'manipulation' // Prevents tap delays
            }}
          >
            <Plus style={{ width: 16, height: 16 }} /> Add Entry
          </button>
        </div>

        {/* Entries List */}
        {subjects.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Added Entries</h2>
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 8,
                    border: '1px solid #fecaca',
                    backgroundColor: '#fff5f5', color: '#dc2626', cursor: 'pointer',
                    transition: 'background 0.2s',
                    touchAction: 'manipulation'
                  }}
                >
                  <RotateCcw style={{ width: 14, height: 14 }} /> Clear All
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, flexWrap: 'wrap' }}>
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>Are you sure?</span>
                  <button
                    onClick={() => { onClearAll(); setShowClearConfirm(false); }}
                    style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none',
                      backgroundColor: '#dc2626', color: '#ffffff', cursor: 'pointer', fontWeight: 600,
                      touchAction: 'manipulation'
                    }}
                  >Yes</button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    style={{
                      padding: '8px 16px', borderRadius: 8,
                      border: '1px solid #d1d5db', backgroundColor: '#ffffff',
                      color: '#374151', cursor: 'pointer', fontWeight: 500,
                      touchAction: 'manipulation'
                    }}
                  >Cancel</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {subjects.map((sub, idx) => (
                <div key={sub} style={{
                  flex: '1 1 min(100%, 300px)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f3f4f6',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#4f46e5' }}>{sub}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 12,
                        backgroundColor: '#eef2ff', color: '#4f46e5',
                      }}>#{idx + 1}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => onMoveUp(sub)}
                        disabled={idx === 0}
                        style={{
                          width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb',
                          backgroundColor: '#ffffff', cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: idx === 0 ? '#d1d5db' : '#6b7280',
                          touchAction: 'manipulation'
                        }}
                      >
                        <ChevronUp style={{ width: 14, height: 14 }} />
                      </button>
                      <button
                        onClick={() => onMoveDown(sub)}
                        disabled={idx === subjects.length - 1}
                        style={{
                          width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb',
                          backgroundColor: '#ffffff',
                          cursor: idx === subjects.length - 1 ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: idx === subjects.length - 1 ? '#d1d5db' : '#6b7280',
                          touchAction: 'manipulation'
                        }}
                      >
                        <ChevronDown style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {grouped[sub].map((entry) => (
                      <div key={entry.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', borderRadius: 10,
                        backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                            {entry.faculty}
                          </span>
                          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
                            [{entry.slots.join(' + ')}]
                          </span>
                        </div>
                        <button
                          onClick={() => onDelete(entry.id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#ef4444', padding: 6, borderRadius: 6,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            touchAction: 'manipulation'
                          }}
                        >
                          <Trash2 style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Elevated z-index to ensure it sits above everything */}
            <div style={{ 
              marginTop: 16, 
              display: 'flex', 
              justifyContent: 'center', 
              width: '100%',
              position: 'relative',
              zIndex: 20 
            }}>
              <button
                onClick={onGenerate}
                style={{
                  padding: '16px 32px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                  width: '100%',
                  justifyContent: 'center',
                  maxWidth: '400px',
                  touchAction: 'manipulation' 
                }}
              >
                <TreePine style={{ width: 18, height: 18 }} /> Generate Mind Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}