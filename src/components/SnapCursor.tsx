'use client';

import { useState, useEffect } from 'react';

// --- DEFINITIONS ---
type Node = {
  id: string;
  x: number;
  y: number;
  type: 'endpoint' | 'midpoint' | 'intersection';
};

// --- MOCK DATA (The "Magnet" Targets) ---
const EXISTING_NODES: Node[] = [
  { id: '1', x: 200, y: 200, type: 'endpoint' },
  { id: '2', x: 500, y: 200, type: 'endpoint' },
  { id: '3', x: 350, y: 400, type: 'intersection' },
];

const SNAP_RADIUS = 15;

export default function SnapCursor() {
  // FIX IS HERE: We explicitly tell React this can be a Node OR null
  const [snappedNode, setSnappedNode] = useState<Node | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Safety check: Don't run this on the server
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      let nearest: Node | null = null;
      let minDistance = SNAP_RADIUS;

      // Check all nodes to see if we are close
      EXISTING_NODES.forEach((node) => {
        const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = node;
        }
      });

      if (nearest) {
        // SNAP! Lock to the node position
        setSnappedNode(nearest);
        setCursor({ x: nearest.x, y: nearest.y }); 
      } else {
        // FLOAT: Follow the mouse
        setSnappedNode(null);
        setCursor({ x: mouseX, y: mouseY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        // This moves the div to the cursor position efficiently
        transform: `translate(${cursor.x}px, ${cursor.y}px)`, 
      }}
    >
      {snappedNode ? (
        // STATE A: SNAPPED (Yellow Box)
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-yellow-400 bg-transparent" />
          <span className="absolute left-4 top-[-10px] text-yellow-400 font-bold text-xs uppercase bg-black/80 px-1">
            {snappedNode.type}
          </span>
        </div>
      ) : (
        // STATE B: FLOATING (Crosshair)
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="relative w-8 h-8 opacity-50">
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/80"></div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/80"></div>
          </div>
        </div>
      )}
    </div>
  );
}