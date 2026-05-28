import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  type FacultyEntry,
  type ShiftLock,
  parseSlot_24BCE0034_Akhileswar,
  determineShift_24BCE0034,
  checkConstraints_24BCE0034_Akhileswar,
} from '@/lib/24BCE0034_L1_MP_AKHILESWAR_slotEngine';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Props {
  entries: FacultyEntry[];
  onBack: () => void;
}

const NODE_W = 148;
const NODE_H = 38;
const H_GAP = 80;
const V_GAP = 14;
const ROW_GAP = 30;
const COL = (c: number) => c * (NODE_W + H_GAP);
const DOT_SPACING = 24;

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  type: 'root' | 'subject' | 'faculty';
  status: 'default' | 'selected' | 'clash' | 'shift' | 'available';
  reason?: string;
  subjectIndex?: number;
  entryId?: string;
  selectionKey?: string;
}

interface LayoutEdge {
  x1: number; y1: number;
  x2: number; y2: number;
  status: 'default' | 'selected' | 'clash' | 'shift';
}

export default function InteractiveTree_24BCE0034_Akhileswar({ entries, onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.75);
  const [pan, setPan] = useState({ x: 60, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const prevNodeCount = useRef(0);

  const grouped: Record<string, FacultyEntry[]> = {};
  entries.forEach((e) => (grouped[e.subject] ??= []).push(e));
  const subjects = [...new Set(entries.map((e) => e.subject))];

  const selKey = (si: number, path: string) => `${si}::${path}`;
  const getSelected = useCallback(
    (si: number, path: string) => selections[selKey(si, path)],
    [selections]
  );

  const calcGroupHeight = useCallback((
    sis: number[],
    takenSlots: Set<string>,
    shiftLock: ShiftLock,
    path: string,
  ): number => {
    let total = 0;
    sis.forEach((si, idx) => {
      total += calcSubjectRowHeight(si, takenSlots, shiftLock, path);
      if (idx < sis.length - 1) total += ROW_GAP;
    });
    return total;
  }, []);

  const calcSubjectRowHeight = useCallback((
    si: number,
    takenSlots: Set<string>,
    shiftLock: ShiftLock,
    path: string,
  ): number => {
    const opts = grouped[subjects[si]] ?? [];
    const facBlockH = Math.max(1, opts.length) * (NODE_H + V_GAP) - V_GAP;
    const selId = getSelected(si, path);
    if (!selId) return facBlockH;
    const selEntry = opts.find((e) => e.id === selId);
    if (!selEntry) return facBlockH;
    const newTaken = new Set(takenSlots);
    selEntry.slots.forEach((s) => newTaken.add(s));
    let newLock = shiftLock;
    if (!newLock) {
      newLock = determineShift_24BCE0034(
        selEntry.slots.map(parseSlot_24BCE0034_Akhileswar)
      );
    }
    const alreadySelected = subjects.map((_, i) => i).filter((i) => !!getSelected(i, ''));
    const remaining = subjects.map((_, i) => i).filter((i) => i !== si && !alreadySelected.includes(i));
    const newPath = path ? `${path}.${selId}` : selId;
    const dynH = calcGroupHeight(remaining, newTaken, newLock, newPath);
    return Math.max(facBlockH, dynH);
  }, [getSelected, subjects, grouped, calcGroupHeight]);

  const buildLayout = useCallback((): { nodes: LayoutNode[]; edges: LayoutEdge[] } => {
    const nodes: LayoutNode[] = [];
    const edges: LayoutEdge[] = [];

    const placeGroup = (
      sis: number[],
      col: number,
      topY: number,
      takenSlots: Set<string>,
      shiftLock: ShiftLock,
      path: string,
      parentX: number,
      parentY: number,
      isStatic: boolean,
      chosenSIs: Set<number>,
    ) => {
      let curY = topY;
      sis.forEach((si) => {
        const sub = subjects[si];
        const opts = grouped[sub] ?? [];
        const rowH = calcSubjectRowHeight(si, takenSlots, shiftLock, path);
        const subCenterY = curY + rowH / 2;
        const subY = subCenterY - NODE_H / 2;
        const isSubSel = !!getSelected(si, path);

        nodes.push({
          id: `sub-${si}-${path}-${col}`,
          x: COL(col), y: subY,
          label: sub, type: 'subject',
          status: isSubSel ? 'selected' : 'default',
          subjectIndex: si,
        });

        edges.push({
          x1: parentX + NODE_W, y1: parentY,
          x2: COL(col), y2: subY + NODE_H / 2,
          status: isSubSel ? 'selected' : 'default',
        });

        const facBlockH = Math.max(1, opts.length) * (NODE_H + V_GAP) - V_GAP;
        const facTopY = subCenterY - facBlockH / 2;

        opts.forEach((entry, fi) => {
          const { disabled, reason } = checkConstraints_24BCE0034_Akhileswar(
            entry, takenSlots, shiftLock, sub
          );
          const isSel = getSelected(si, path) === entry.id;
          let status: LayoutNode['status'] = disabled
            ? (reason.includes('Clash') ? 'clash' : 'shift') : 'available';
          if (isSel) status = 'selected';

          const fy = facTopY + fi * (NODE_H + V_GAP);

          nodes.push({
            id: `fac-${si}-${entry.id}-${path}-${col}`,
            x: COL(col + 1), y: fy,
            label: entry.faculty, sublabel: entry.slots.join(', '),
            type: 'faculty', status, reason: disabled ? reason : '',
            subjectIndex: si, entryId: entry.id,
            selectionKey: selKey(si, path),
          });

          edges.push({
            x1: COL(col) + NODE_W, y1: subY + NODE_H / 2,
            x2: COL(col + 1), y2: fy + NODE_H / 2,
            status: isSel ? 'selected'
              : disabled ? (reason.includes('Clash') ? 'clash' : 'shift')
                : 'default',
          });

          if (isSel && !isStatic) {
            const newTaken = new Set(takenSlots);
            entry.slots.forEach((s) => newTaken.add(s));
            let newLock = shiftLock;
            if (!newLock) {
              newLock = determineShift_24BCE0034(
                entry.slots.map(parseSlot_24BCE0034_Akhileswar)
              );
            }
            const newChosen = new Set(chosenSIs);
            newChosen.add(si);
            const remaining = subjects.map((_, i) => i).filter((i) => !newChosen.has(i));
            const newPath = path ? `${path}.${entry.id}` : entry.id;

            if (remaining.length > 0) {
              const dynH = calcGroupHeight(remaining, newTaken, newLock, newPath);
              const dynTopY = fy + NODE_H / 2 - dynH / 2;
              placeGroup(
                remaining, col + 2, dynTopY,
                newTaken, newLock, newPath,
                COL(col + 1), fy + NODE_H / 2,
                false, newChosen,
              );
            }
          }
        });

        curY += rowH + ROW_GAP;
      });
    };

    const staticRowHeights = subjects.map((_, si) =>
      calcSubjectRowHeight(si, new Set(), null, '')
    );
    const totalStaticH = staticRowHeights.reduce((s, h) => s + h, 0)
      + (subjects.length - 1) * ROW_GAP;
    const rootCenterY = totalStaticH / 2;

    nodes.push({
      id: 'root',
      x: COL(0), y: rootCenterY - NODE_H / 2,
      label: '📅 Start', type: 'root', status: 'default',
    });

    let curY = 0;
    subjects.forEach((sub, si) => {
      const rowH = staticRowHeights[si];
      const subCenterY = curY + rowH / 2;
      const subY = subCenterY - NODE_H / 2;
      const opts = grouped[sub] ?? [];
      const isSubSel = !!getSelected(si, '');

      nodes.push({
        id: `s-sub-${si}`,
        x: COL(1), y: subY,
        label: sub, type: 'subject',
        status: isSubSel ? 'selected' : 'default',
        subjectIndex: si,
      });

      edges.push({
        x1: COL(0) + NODE_W, y1: rootCenterY,
        x2: COL(1), y2: subY + NODE_H / 2,
        status: isSubSel ? 'selected' : 'default',
      });

      const facBlockH = Math.max(1, opts.length) * (NODE_H + V_GAP) - V_GAP;
      const facTopY = subCenterY - facBlockH / 2;

      opts.forEach((entry, fi) => {
        const { disabled, reason } = checkConstraints_24BCE0034_Akhileswar(
          entry, new Set(), null, sub
        );
        const isSel = getSelected(si, '') === entry.id;
        let status: LayoutNode['status'] = disabled
          ? (reason.includes('Clash') ? 'clash' : 'shift') : 'available';
        if (isSel) status = 'selected';

        const fy = facTopY + fi * (NODE_H + V_GAP);

        nodes.push({
          id: `s-fac-${si}-${fi}`,
          x: COL(2), y: fy,
          label: entry.faculty, sublabel: entry.slots.join(', '),
          type: 'faculty', status, reason: disabled ? reason : '',
          subjectIndex: si, entryId: entry.id,
          selectionKey: selKey(si, ''),
        });

        edges.push({
          x1: COL(1) + NODE_W, y1: subY + NODE_H / 2,
          x2: COL(2), y2: fy + NODE_H / 2,
          status: isSel ? 'selected'
            : disabled ? (reason.includes('Clash') ? 'clash' : 'shift')
              : 'default',
        });

        if (isSel) {
          const newTaken = new Set<string>();
          entry.slots.forEach((s) => newTaken.add(s));
          let newLock: ShiftLock = determineShift_24BCE0034(
            entry.slots.map(parseSlot_24BCE0034_Akhileswar)
          );
          const newChosen = new Set<number>();
          newChosen.add(si);
          const remaining = subjects.map((_, i) => i).filter((i) => !newChosen.has(i));
          const newPath = entry.id;

          if (remaining.length > 0) {
            const dynH = calcGroupHeight(remaining, newTaken, newLock, newPath);
            const dynTopY = subCenterY - dynH / 2;
            placeGroup(
              remaining, 3, dynTopY,
              newTaken, newLock, newPath,
              COL(2), fy + NODE_H / 2,
              false, newChosen,
            );
          }
        }
      });

      curY += rowH + ROW_GAP;
    });

    return { nodes, edges };
  }, [selections, subjects, entries, grouped, getSelected,
    calcGroupHeight, calcSubjectRowHeight]);

  const { nodes, edges } = buildLayout();
  const maxX = Math.max(...nodes.map((n) => n.x + NODE_W), 400) + 100;
  const maxY = Math.max(...nodes.map((n) => n.y + NODE_H), 400) + 100;

  // Auto pan
  useEffect(() => {
    if (nodes.length <= prevNodeCount.current) {
      prevNodeCount.current = nodes.length;
      return;
    }
    prevNodeCount.current = nodes.length;
    if (!containerRef.current) return;
    const rightmost = nodes.reduce((best, n) => n.x > best.x ? n : best, nodes[0]);
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const targetX = cw * 0.55 - (rightmost.x + NODE_W / 2) * zoom;
    const targetY = ch * 0.5 - (rightmost.y + NODE_H / 2) * zoom;
    setPan((prev) => ({
      x: prev.x + (targetX - prev.x) * 0.45,
      y: prev.y + (targetY - prev.y) * 0.3,
    }));
  }, [nodes.length]);

  const handleSelect = (node: LayoutNode) => {
    if (node.type !== 'faculty') return;
    if (node.status === 'clash' || node.status === 'shift') return;
    const sk = node.selectionKey!;
    setSelections((prev) => {
      const next = { ...prev };
      if (next[sk] === node.entryId) {
        delete next[sk];
        Object.keys(next).forEach((k) => {
          if (k.includes(node.entryId!)) delete next[k];
        });
      } else {
        const pathPart = sk.split('::')[1];
        Object.keys(next).forEach((k) => {
          const kp = k.split('::')[1];
          if (kp !== pathPart && kp.startsWith(pathPart)) delete next[k];
        });
        next[sk] = node.entryId!;
      }
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-btn')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((p) => Math.min(3, Math.max(0.2, p - e.deltaY * 0.001)));
  };

  const bezier = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  const getNodeStyle = (node: LayoutNode): React.CSSProperties => {
    if (node.type === 'root') return {
      backgroundColor: '#ffffff',
      border: '2px solid #1a1a1a',
      color: '#1a1a1a',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    };
    if (node.type === 'subject') {
      if (node.status === 'selected') return {
        backgroundColor: '#16a34a',
        border: '2px solid #15803d',
        color: '#ffffff',
        boxShadow: '0 2px 12px rgba(22,163,74,0.35)',
      };
      return {
        backgroundColor: '#ffffff',
        border: '1.5px solid #d1d5db',
        color: '#1a1a1a',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      };
    }
    if (node.status === 'selected') return {
      backgroundColor: '#16a34a',
      border: '2px solid #15803d',
      color: '#ffffff',
      boxShadow: '0 2px 10px rgba(22,163,74,0.3)',
    };
    if (node.status === 'clash') return {
      backgroundColor: '#dc2626',
      border: '1.5px solid #b91c1c',
      color: '#ffffff',
      opacity: 0.85,
    };
    if (node.status === 'shift') return {
      backgroundColor: '#ea580c',
      border: '1.5px solid #c2410c',
      color: '#ffffff',
      opacity: 0.85,
    };
    return {
      backgroundColor: '#ffffff',
      border: '1.5px solid #e5e7eb',
      color: '#374151',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    };
  };

  const getEdgeColor = (e: LayoutEdge) => {
    if (e.status === 'selected') return '#16a34a';
    if (e.status === 'clash') return '#dc262644';
    if (e.status === 'shift') return '#ea580c44';
    return '#9ca3af';
  };

  const staticSelections = Object.keys(selections).filter((k) => k.endsWith('::')).length;
  const allSelected = staticSelections === subjects.length;

  return (
    <div style={{ position: 'fixed', top: 52, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>



      {/* Canvas — fills remaining space */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#f8f8f5',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          overflow: 'hidden',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Off-white dot grid */}
        <svg style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%', pointerEvents: 'none',
        }}>
          <defs>
            <pattern id="dotgrid"
              x={pan.x % DOT_SPACING} y={pan.y % DOT_SPACING}
              width={DOT_SPACING} height={DOT_SPACING}
              patternUnits="userSpaceOnUse">
              <circle cx={DOT_SPACING / 2} cy={DOT_SPACING / 2} r={1} fill="#c8c8c0" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" />
        </svg>

        {/* Back button — fixed top left */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 16, left: 16,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#374151', fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 10,
          }}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Tree */}
        <div style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: maxX, height: maxY,
          transition: isDragging ? 'none' : 'transform 0.12s ease',
        }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
            width={maxX} height={maxY}>
            {edges.map((edge, i) => (
              <path key={i}
                d={bezier(edge.x1, edge.y1, edge.x2, edge.y2)}
                fill="none"
                stroke={getEdgeColor(edge)}
                strokeWidth={edge.status === 'selected' ? 2.5 : 1.2}
                strokeOpacity={edge.status === 'selected' ? 1 : 0.8}
                strokeDasharray={
                  edge.status === 'clash' || edge.status === 'shift' ? '4 3' : undefined
                }
              />
            ))}
          </svg>

          <AnimatePresence>
            {nodes.map((node) => {
              const style = getNodeStyle(node);
              const isClickable = node.type === 'faculty'
                && node.status !== 'clash'
                && node.status !== 'shift';
              return (
                <motion.div
                  key={node.id}
                  className="node-btn"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute',
                    left: node.x, top: node.y,
                    width: NODE_W, height: NODE_H,
                    borderRadius: 20,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '0 12px',
                    cursor: isClickable ? 'pointer' : 'default',
                    ...style,
                  }}
                  onClick={() => handleSelect(node)}
                  onMouseEnter={(e) => {
                    if (node.reason) setTooltip({
                      text: node.reason, x: e.clientX, y: e.clientY,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  whileHover={isClickable ? { scale: 1.05 } : undefined}
                  whileTap={isClickable ? { scale: 0.97 } : undefined}
                >
                  <div style={{
                    fontSize: node.type === 'subject' ? 11 : 10,
                    fontWeight: 600,
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: NODE_W - 24, textAlign: 'center',
                  }}>
                    {node.label}
                  </div>
                  {node.sublabel && (
                    <div style={{
                      fontSize: 8,
                      color: node.status === 'selected' ? 'rgba(255,255,255,0.7)'
                        : node.status === 'clash' ? 'rgba(255,255,255,0.7)'
                          : '#9ca3af',
                      whiteSpace: 'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: NODE_W - 24, textAlign: 'center',
                    }}>
                      {node.sublabel}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'fixed',
            left: tooltip.x + 12, top: tooltip.y - 32,
            backgroundColor: '#1e1e2e',
            border: '1px solid #ef444466',
            color: '#ef4444', fontSize: 11,
            padding: '4px 8px', borderRadius: 6,
            pointerEvents: 'none', zIndex: 50,
          }}>
            {tooltip.text}
          </div>
        )}

        {/* Fixed zoom controls — bottom right */}
        <div style={{
          position: 'absolute',
          bottom: 24, right: 24,
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 10,
        }}>
          <button
            onClick={() => setZoom(p => Math.min(3, p + 0.1))}
            style={{
              width: 36, height: 36,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              color: '#374151',
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <div style={{
            width: 36, height: 36,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600,
            color: '#374151',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            {Math.round(zoom * 100)}%
          </div>

          <button
            onClick={() => setZoom(p => Math.max(0.2, p - 0.1))}
            style={{
              width: 36, height: 36,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              color: '#374151',
            }}
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            onClick={() => { setZoom(0.75); setPan({ x: 60, y: 80 }); }}
            style={{
              width: 36, height: 36,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              color: '#374151',
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Legend — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: 24, left: 24,
          display: 'flex', gap: 16,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: '8px 14px',
          fontSize: 11,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          zIndex: 10,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
            Selected
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} />
            Clash
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ea580c', display: 'inline-block' }} />
            Shift Mismatch
          </span>
        </div>
      </div>
    </div>
  );
}
