'use client';

import './styles.css';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
    ZoomIn, 
    ZoomOut, 
    FilePlus, 
    Undo2, 
    Ban, 
    Crosshair, 
    Maximize, 
    MousePointerSquareDashed, 
    Spline, 
    RotateCw, 
    Magnet, 
    RefreshCw, 
    ExternalLink,
    MapPin,
    Trash2,
    PenTool,
    Save,
    Eraser,
    Activity,
    Cpu,
    Database,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import SketchHeader from '@/components/sketch-header';
import { useUser, useAuth } from '@/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import Link from 'next/link';

type Stroke = {
  points: { x: number, y: number, bearing: number }[];
  color: string;
  lineWidth: number;
};

type Parcel = {
    id: number;
    acres: number;
    points: { x: number, y: number }[];
};

type WorkspacePoint = {
    id: number;
    name: string;
    x: number;
    y: number;
    status: 'active' | 'deleted';
};

type DraftMode = 'line' | 'arc' | 'rotate-all' | 'rotate-item' | 'delete-point' | 'delete-stroke' | 'none';

export default function ArithmaSketchPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const { user } = useUser();
    const auth = useAuth();

    // --- WORKSPACE STATE ---
    const [jobTitle, setJobTitle] = useState('ArithmaGen\nField Sketch\nDate: ...');
    const [jobTimestamp, setJobTimestamp] = useState('Loading...');
    
    // --- DRAWING STATE ---
    const [penPos, setPenPos] = useState({ x: 0, y: 0, bearing: 0 }); 
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 2 });
    const cameraRef = useRef({ x: 0, y: 0, zoom: 2 });
    
    useEffect(() => {
        cameraRef.current = camera;
    }, [camera]);

    const [history, setHistory] = useState<Stroke[]>([]);
    const [savedParcels, setSavedParcels] = useState<Parcel[]>([]);
    const [savedPoints, setSavedPoints] = useState<WorkspacePoint[]>([]);
    
    const pointCounterRef = useRef(1);
    const [nextPointNum, setNextPointNum] = useState(1);
    
    const [isPenBlinkOn, setIsPenBlinkOn] = useState(true);
    const [showPen, setShowPen] = useState(true);
    
    // --- MANUAL DRAFTING STATE ---
    const [draftMode, setDraftMode] = useState<DraftMode>('none');
    const [drawStep, setDrawStep] = useState<number>(0); 
    const [draftPoints, setDraftPoints] = useState<{x: number, y: number}[]>([]);
    const [mouseWorldPos, setMouseWorldPos] = useState({ x: 0, y: 0 });
    const [snapEnabled, setSnapToPoints] = useState(true);
    const [selectedStrokeIndex, setSelectedStrokeIndex] = useState<number | null>(null);
    const [isRotatingCurrent, setIsRotatingCurrent] = useState(false);
    
    const [hoveredPointId, setHoveredPointId] = useState<number | null>(null);
    const [hoveredStrokeIndex, setHoveredStrokeIndex] = useState<number | null>(null);

    // --- STYLE STATE ---
    const [activeColor, setActiveColor] = useState('#60A5FA');
    const [activeWeight, setActiveWeight] = useState(2);
    
    const [currentStroke, setCurrentStroke] = useState<Stroke>({ 
        points: [{ x: 0, y: 0, bearing: 0 }], 
        color: '#60A5FA',
        lineWidth: 2
    });

    // --- POINT INPUT STATE ---
    const [manualX, setManualX] = useState('');
    const [manualY, setManualY] = useState('');

    // --- CURVE INPUT STATE ---
    const [curveRadius, setCurveRadius] = useState('500');
    const [curveLength, setCurveLength] = useState('100');

    // --- INTERFACE STATE ---
    const [traverseMode, setTraverseMode] = useState<'bearing' | 'azimuth'>('bearing');
    
    // --- PAPER SPACE DRAGGING ---
    const [arrowPos, setArrowPos] = useState({ x: 20, y: 80 });
    const [scalePos, setScalePos] = useState({ x: 20, y: 550 });
    const [notePos, setNotePos] = useState({ x: 20, y: 160 });
    const [activeDrag, setActiveDrag] = useState<null | 'arrow' | 'scale' | 'note'>(null);

    // --- REFS ---
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const inputBearingRef = useRef<HTMLInputElement>(null);
    const inputAzimuthRef = useRef<HTMLInputElement>(null);
    const inputDistRef = useRef<HTMLInputElement>(null);
    const areaDisplayRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setJobTitle('ArithmaGen\nField Sketch\nDate: ' + new Date().toLocaleDateString());
        setJobTimestamp(new Date().toLocaleString());
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsPenBlinkOn(v => !v);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const addWorkspacePoint = useCallback((x: number, y: number) => {
        const num = pointCounterRef.current;
        const pointName = `pnt. ${num}`;
        
        setSavedPoints(prev => [
            ...prev, 
            {
                id: Date.now() + Math.random(),
                name: pointName,
                x,
                y,
                status: 'active'
            }
        ]);

        pointCounterRef.current = num + 1;
        setNextPointNum(num + 1);
    }, []);

    const handlePointDeletion = useCallback((id: number) => {
        setSavedPoints(prev => prev.map(p => p.id === id ? { ...p, status: 'deleted' } : p));
    }, []);

    const handleStrokeDeletion = useCallback((index: number) => {
        setHistory(prev => prev.filter((_, i) => i !== index));
    }, []);

    const getShapeArea = (shape: any[]) => {
        if (!shape || shape.length < 3) return { sqft: 0, acres: 0 };
        let sum1 = 0, sum2 = 0;
        for (let i = 0; i < shape.length - 1; i++) {
            sum1 += shape[i].x * shape[i+1].y;
            sum2 += shape[i].y * shape[i+1].x;
        }
        const first = shape[0]; const last = shape[shape.length - 1];
        if (first.x !== last.x || first.y !== last.y) { sum1 += last.x * first.y; sum2 += last.y * first.x; }
        const sqft = Math.abs(0.5 * (sum1 - sum2));
        return { sqft: sqft, acres: sqft / 43560 };
    };

    const getMouseWorldPos = useCallback((e: MouseEvent | React.MouseEvent): { x: number, y: number } => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const { zoom, x, y } = cameraRef.current;
        return {
            x: (sx - cx) / zoom + x,
            y: -(sy - cy) / zoom + y
        };
    }, []);

    const getSnappedPoint = useCallback((world: { x: number, y: number }): { x: number, y: number, isSnapped: boolean } => {
        if (!snapEnabled) return { ...world, isSnapped: false };
        
        const activeSavedPoints = savedPoints.filter(p => p.status === 'active');
        const allEndpoints = [
            ...history.flatMap(s => [s.points[0], s.points[s.points.length - 1]]),
            ...activeSavedPoints,
            currentStroke.points[0],
            currentStroke.points[currentStroke.points.length - 1]
        ].filter(Boolean);

        let closest = world;
        let isSnapped = false;
        let minDist = 15 / cameraRef.current.zoom; 

        allEndpoints.forEach(p => {
            const d = Math.hypot(p.x - world.x, p.y - world.y);
            if (d < minDist) {
                minDist = d;
                closest = { x: p.x, y: p.y };
                isSnapped = true;
            }
        });

        return { ...closest, isSnapped };
    }, [history, currentStroke, savedPoints, snapEnabled]);

    const getArcPoints = (p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}) => {
        const x1 = p1.x, y1 = p1.y;
        const x2 = p2.x, y2 = p2.y;
        const x3 = p3.x, y3 = p3.y;
        const D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        if (Math.abs(D) < 1e-6) return [{x: p1.x, y: p1.y, bearing: 0}, {x: p3.x, y: p3.y, bearing: 0}];
        const h = ((x1**2 + y1**2) * (y2 - y3) + (x2**2 + y2**2) * (y3 - y1) + (x3**2 + y3**2) * (y1 - y2)) / D;
        const k = ((x1**2 + y1**2) * (x3 - x2) + (x2**2 + y2**2) * (x1 - x3) + (x3**2 + y3**2) * (x2 - x1)) / D;
        const r = Math.sqrt((x1 - h)**2 + (y1 - k)**2);
        const startAng = Math.atan2(p1.y - k, p1.x - h);
        const endAng = Math.atan2(p3.y - k, p3.x - h);
        const crossProduct = (p2.x - p1.x) * (p3.y - p2.y) - (p2.y - p1.y) * (p3.x - p2.x);
        const isCCW = crossProduct > 0;
        let diff = endAng - startAng;
        if (isCCW && diff < 0) diff += Math.PI * 2;
        if (!isCCW && diff > 0) diff -= Math.PI * 2;
        const steps = 30;
        const arcPoints = [];
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const currentAng = startAng + diff * t;
            const dx = Math.cos(currentAng);
            const dy = Math.sin(currentAng);
            const tangentAzimuth = isCCW ? Math.atan2(dx, dy) - Math.PI / 2 : Math.atan2(dx, dy) + Math.PI / 2;
            arcPoints.push({ x: h + r * Math.cos(currentAng), y: k + r * Math.sin(currentAng), bearing: tangentAzimuth });
        }
        return arcPoints;
    };

    const renderCanvas = useCallback((includePen: boolean = true) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const { x: camX, y: camY, zoom: camZoom } = cameraRef.current;
        const gridSize = 20 * camZoom; 

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, width, height);
        
        if (gridSize > 10) {
            const offsetX = (cx - (camX * camZoom)) % gridSize;
            const offsetY = (cy + (camY * camZoom)) % gridSize; 
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 0.5;
            for (let x = offsetX; x < width; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
            for (let y = offsetY; y < height; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
        }

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(camZoom, -camZoom); 
        ctx.translate(-camX, -camY); 

        history.forEach((stroke, idx) => {
            if (!stroke || stroke.points.length < 2) return;
            const isDeleting = draftMode === 'delete-stroke' && hoveredStrokeIndex === idx;
            const isRotating = draftMode === 'rotate-item' && drawStep > 0 && selectedStrokeIndex === idx;
            
            ctx.strokeStyle = isRotating ? '#4ADE80' : isDeleting ? '#EF4444' : stroke.color;
            ctx.lineWidth = (isDeleting ? (stroke.lineWidth + 2) : stroke.lineWidth) / camZoom;
            
            if (isDeleting) {
                ctx.shadowBlur = 10 / camZoom;
                ctx.shadowColor = '#EF4444';
            }

            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) { ctx.lineTo(stroke.points[i].x, stroke.points[i].y); }
            ctx.stroke();
            
            ctx.shadowBlur = 0;
        });

        if (currentStroke && currentStroke.points.length > 1) {
            const isSelected = draftMode === 'rotate-item' && drawStep > 0 && isRotatingCurrent;
            ctx.strokeStyle = isSelected ? '#4ADE80' : currentStroke.color;
            ctx.lineWidth = currentStroke.lineWidth / camZoom;
            ctx.beginPath();
            ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y);
            for (let i = 1; i < currentStroke.points.length; i++) { ctx.lineTo(currentStroke.points[i].x, currentStroke.points[i].y); }
            ctx.stroke();
        }

        savedPoints.filter(p => p.status === 'active').forEach(pt => {
            const isHovered = draftMode === 'delete-point' && hoveredPointId === pt.id;
            
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, (isHovered ? 5 : 3) / camZoom, 0, Math.PI * 2);
            ctx.fillStyle = isHovered ? '#EF4444' : '#FBBF24';
            ctx.fill();
            
            if (isHovered) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 1 / camZoom;
                ctx.stroke();
            }

            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.scale(1/camZoom, -1/camZoom);
            ctx.fillStyle = isHovered ? '#EF4444' : '#FFFFFF';
            ctx.font = `bold ${isHovered ? 12 : 10}px sans-serif`;
            ctx.fillText(pt.name, 5, -5);
            ctx.restore();
        });

        if (draftMode !== 'none' && !['delete-point', 'delete-stroke'].includes(draftMode)) {
            const snapped = getSnappedPoint(mouseWorldPos);
            if (snapped.isSnapped) {
                ctx.strokeStyle = '#4ADE80';
                ctx.lineWidth = 2 / camZoom;
                ctx.strokeRect(snapped.x - 5 / camZoom, snapped.y - 5 / camZoom, 10 / camZoom, 10 / camZoom);
            }
            ctx.setLineDash([5 / camZoom, 5 / camZoom]);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1 / camZoom;
            ctx.beginPath();
            if (draftMode === 'line' && drawStep === 1) {
                ctx.moveTo(penPos.x, penPos.y); ctx.lineTo(snapped.x, snapped.y);
            } else if (draftMode === 'arc') {
                if (drawStep === 1) { ctx.moveTo(penPos.x, penPos.y); ctx.lineTo(snapped.x, snapped.y); }
                else if (drawStep === 2 && draftPoints.length >= 2) {
                    const previewPoints = getArcPoints(draftPoints[0], draftPoints[1], snapped);
                    if (previewPoints.length > 1) { ctx.moveTo(previewPoints[0].x, previewPoints[0].y); for (let i = 1; i < previewPoints.length; i++) { ctx.lineTo(previewPoints[i].x, previewPoints[i].y); } }
                }
            } else if (draftMode === 'rotate-all' || draftMode === 'rotate-item') {
                if (drawStep === 1 && draftPoints[0]) { ctx.moveTo(draftPoints[0].x, draftPoints[0].y); ctx.lineTo(snapped.x, snapped.y); }
                else if (drawStep === 2 && draftPoints[0] && draftPoints[1]) {
                    ctx.moveTo(draftPoints[0].x, draftPoints[0].y); ctx.lineTo(draftPoints[1].x, draftPoints[1].y);
                    ctx.moveTo(draftPoints[0].x, draftPoints[0].y); ctx.lineTo(snapped.x, snapped.y);
                }
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        if (includePen && showPen && isPenBlinkOn) {
            ctx.beginPath(); ctx.arc(penPos.x, penPos.y, 5 / camZoom, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
        }
        ctx.restore();
    }, [penPos, history, currentStroke, isPenBlinkOn, showPen, draftMode, drawStep, mouseWorldPos, draftPoints, getSnappedPoint, selectedStrokeIndex, isRotatingCurrent, savedPoints, hoveredPointId, hoveredStrokeIndex]);

    useEffect(() => {
        if (!activeDrag) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            const container = canvasContainerRef.current;
            if (!container) return;
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (activeDrag === 'arrow') setArrowPos({ x: x - 20, y: y - 20 });
            else if (activeDrag === 'scale') setScalePos({ x: x - 50, y: y - 10 });
            else if (activeDrag === 'note') setNotePos({ x: x - 110, y: y - 40 });
        };

        const handleGlobalMouseUp = () => setActiveDrag(null);

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [activeDrag]);

    useEffect(() => {
        renderCanvas();
    }, [renderCanvas, camera]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvasContainerRef.current;
        if (!canvas || !container) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry && canvas) {
                const { width, height } = entry.contentRect;
                canvas.width = Math.floor(width) || 800;
                canvas.height = Math.floor(height) || 600;
                renderCanvas();
            }
        });
        observer.observe(container);
        const handleWheel = (e: WheelEvent) => { e.preventDefault(); const zoomIntensity = 0.1; const delta = e.deltaY < 0 ? 1 : -1; setCamera(c => { const newZoom = c.zoom + (delta * zoomIntensity * c.zoom); return { ...c, zoom: Math.max(0.1, Math.min(newZoom, 500)) }; }); };
        
        const handleMouseDown = (e: MouseEvent) => {
            if (activeDrag) return;
            const world = getMouseWorldPos(e);
            const snapped = getSnappedPoint(world);

            if (draftMode === 'delete-point') {
                const pt = savedPoints.find(p => p.status === 'active' && Math.hypot(p.x - world.x, p.y - world.y) < 15 / cameraRef.current.zoom);
                if (pt) {
                    handlePointDeletion(pt.id);
                    toast({ title: 'Point Removed' });
                }
                return;
            }

            if (draftMode === 'delete-stroke') {
                let foundIdx = -1;
                for (let i = history.length - 1; i >= 0; i--) {
                    const isClose = history[i].points.some(p => Math.hypot(p.x - world.x, p.y - world.y) < 15 / cameraRef.current.zoom);
                    if (isClose) { foundIdx = i; break; }
                }
                if (foundIdx !== -1) {
                    handleStrokeDeletion(foundIdx);
                    toast({ title: 'Line/Arc Removed' });
                }
                return;
            }

            if (draftMode !== 'none') {
                if (draftMode === 'line') {
                    if (drawStep === 0) {
                        if (currentStroke.points.length > 1) setHistory(h => [...h, currentStroke]);
                        const newPos = { x: snapped.x, y: snapped.y, bearing: penPos.bearing }; setPenPos(newPos);
                        setCurrentStroke({ points: [newPos], color: activeColor, lineWidth: activeWeight }); setDrawStep(1);
                    } else {
                        const dx = snapped.x - penPos.x; const dy = snapped.y - penPos.y; const newBearing = Math.atan2(dx, dy);
                        const newPos = { x: snapped.x, y: snapped.y, bearing: newBearing }; setPenPos(newPos);
                        setCurrentStroke(s => ({ ...s, points: [...s.points, newPos] })); 
                        addWorkspacePoint(newPos.x, newPos.y);
                        setDrawStep(0);
                    }
                } else if (draftMode === 'arc') {
                    if (drawStep === 0) {
                        if (currentStroke.points.length > 1) setHistory(h => [...h, currentStroke]);
                        const newPos = { x: snapped.x, y: snapped.y, bearing: penPos.bearing }; setPenPos(newPos);
                        setDraftPoints([newPos]); setCurrentStroke({ points: [newPos], color: activeColor, lineWidth: activeWeight }); setDrawStep(1);
                    } else if (drawStep === 1) { setDraftPoints(p => [...p, snapped]); setDrawStep(2);
                    } else {
                        const arcPoints = getArcPoints(draftPoints[0], draftPoints[1], snapped); const finalPoint = arcPoints[arcPoints.length - 1];
                        setPenPos(finalPoint); setCurrentStroke(s => ({ ...s, points: [...s.points, ...arcPoints.slice(1)] })); 
                        addWorkspacePoint(finalPoint.x, finalPoint.y);
                        setDrawStep(0); setDraftPoints([]);
                    }
                } else if (draftMode === 'rotate-all' || draftMode === 'rotate-item') {
                    if (drawStep === 0) {
                        if (draftMode === 'rotate-item') {
                            let foundIdx: number | null = null; let foundCurrent = false;
                            history.forEach((s, i) => s.points.forEach(p => { if (Math.hypot(p.x - snapped.x, p.y - snapped.y) < 50 / cameraRef.current.zoom) { foundIdx = i; foundCurrent = false; } }));
                            currentStroke.points.forEach(p => { if (Math.hypot(p.x - snapped.x, p.y - snapped.y) < 50 / cameraRef.current.zoom) { foundIdx = null; foundCurrent = true; } });
                            if (foundIdx !== null || foundCurrent) { setSelectedStrokeIndex(foundIdx); setIsRotatingCurrent(foundCurrent); setDraftPoints([snapped]); setDrawStep(1); }
                            else { toast({ variant: 'destructive', title: 'No Item Found' }); }
                        } else { setDraftPoints([snapped]); setDrawStep(1); }
                    } else if (drawStep === 1) { setDraftPoints(p => [...p, snapped]); setDrawStep(2);
                    } else {
                        const pivot = draftPoints[0]; const iRefPt = draftPoints[1]; const target = snapped;
                        const da = Math.atan2(target.x - pivot.x, target.y - pivot.y) - Math.atan2(iRefPt.x - pivot.x, iRefPt.y - pivot.y);
                        const rot = (p: {x: number, y: number}) => { const d = Math.hypot(p.x - pivot.x, p.y - pivot.y); const ang = Math.atan2(p.x - pivot.x, p.y - pivot.y) + da; return { x: pivot.x + d * Math.sin(ang), y: pivot.y + d * Math.cos(ang) }; };
                        if (draftMode === 'rotate-all') {
                            setHistory(prev => prev.map(s => ({ ...s, points: s.points.map(p => ({ ...rot(p), bearing: p.bearing + da })) })));
                            setCurrentStroke(s => ({ ...s, points: s.points.map(p => ({ ...rot(p), bearing: p.bearing + da })) }));
                            setSavedPoints(prev => prev.map(p => ({ ...p, ...rot(p) })));
                            setPenPos(p => ({ ...rot(p), bearing: p.bearing + da }));
                        } else if (isRotatingCurrent) {
                            setCurrentStroke(s => { const np = s.points.map(p => ({ ...rot(p), bearing: p.bearing + da })); setPenPos(np[np.length - 1]); return { ...s, points: np }; });
                        } else if (selectedStrokeIndex !== null) {
                            setHistory(prev => prev.map((s, i) => i === selectedStrokeIndex ? { ...s, points: s.points.map(p => ({ ...rot(p), bearing: p.bearing + da })) } : s));
                        }
                        setDrawStep(0); setDraftMode('none'); setDraftPoints([]); setSelectedStrokeIndex(null); setIsRotatingCurrent(false);
                    }
                }
                return;
            }
            isDragging.current = true; lastMousePos.current = { x: e.clientX, y: e.clientY }; canvas.style.cursor = 'grabbing';
        };

        const handleMouseUp = () => { 
            isDragging.current = false; 
            canvas.style.cursor = draftMode !== 'none' ? 'crosshair' : 'default'; 
        };

        const handleMouseMove = (e: MouseEvent) => { 
            const world = getMouseWorldPos(e); 
            setMouseWorldPos(world); 
            
            const zoom = cameraRef.current.zoom;
            const threshold = 15 / zoom;

            if (draftMode === 'delete-point') {
                const pt = savedPoints.find(p => p.status === 'active' && Math.hypot(p.x - world.x, p.y - world.y) < threshold);
                setHoveredPointId(pt ? pt.id : null);
                canvas.style.cursor = pt ? 'pointer' : 'crosshair';
            } else if (draftMode === 'delete-stroke') {
                let foundIdx = -1;
                for (let i = history.length - 1; i >= 0; i--) {
                    const isClose = history[i].points.some(p => Math.hypot(p.x - world.x, p.y - world.y) < 15 / zoom);
                    if (isClose) { foundIdx = i; break; }
                }
                setHoveredStrokeIndex(foundIdx !== -1 ? foundIdx : null);
                canvas.style.cursor = foundIdx !== -1 ? 'pointer' : 'crosshair';
            }

            if (isDragging.current) { 
                const dx = e.clientX - lastMousePos.current.x; 
                const dy = e.clientY - lastMousePos.current.y; 
                setCamera(c => ({ ...c, x: c.x - dx / c.zoom, y: c.y + dy / c.zoom })); 
                lastMousePos.current = { x: e.clientX, y: e.clientY }; 
            } 
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        return () => { observer.unobserve(container); canvas.removeEventListener('wheel', handleWheel); canvas.removeEventListener('mousedown', handleMouseDown); window.removeEventListener('mouseup', handleMouseUp); canvas.removeEventListener('mousemove', handleMouseMove); };
    }, [activeDrag, renderCanvas, draftMode, drawStep, penPos, currentStroke, activeColor, activeWeight, getMouseWorldPos, draftPoints, getSnappedPoint, selectedStrokeIndex, isRotatingCurrent, savedPoints, addWorkspacePoint, handlePointDeletion, handleStrokeDeletion, history]);

    const handleCenterPen = () => {
        setCamera(c => ({ ...c, x: penPos.x, y: penPos.y }));
    };
    
    const handleZoomIn = () => setCamera(c => ({ ...c, zoom: Math.min(c.zoom * 1.2, 500) }));
    const handleZoomOut = () => setCamera(c => ({ ...c, zoom: Math.max(c.zoom / 1.2, 0.1) }));

    const handleZoomExtents = () => {
        const activeSavedPoints = savedPoints.filter(p => p.status === 'active');
        const allPoints = [...history.flatMap(s => s.points), ...currentStroke.points, ...activeSavedPoints];
        if (allPoints.length < 2) { toast({ title: "No Data" }); return; }
        const xs = allPoints.map(p => p.x); const ys = allPoints.map(p => p.y);
        const minX = Math.min(...xs); const maxX = Math.max(...xs);
        const minY = Math.min(...ys); const maxY = Math.max(...ys);
        const centerX = (minX + maxX) / 2; const centerY = (minY + maxY) / 2;
        const dw = maxX - minX; const dh = maxY - minY;
        const canvas = canvasRef.current; if (!canvas) return;
        const aw = canvas.width * 0.8; const ah = canvas.height * 0.8;
        const newZoom = Math.min(aw / (dw || 1), ah / (dh || 1));
        setCamera({ x: centerX, y: centerY, zoom: Math.max(0.1, Math.min(newZoom, 500)) });
    };

    const handleNewJob = () => {
        setHistory([]); setSavedParcels([]); setSavedPoints([]); 
        pointCounterRef.current = 1;
        setNextPointNum(1); 
        setPenPos({ x: 0, y: 0, bearing: 0 });
        setCurrentStroke({ points: [{ x: 0, y: 0, bearing: 0 }], color: activeColor, lineWidth: activeWeight });
        setCamera({ x: 0, y: 0, zoom: 2 }); setDraftMode('none'); setDrawStep(0); setDraftPoints([]);
        setJobTitle('ArithmaGen\nField Sketch\nDate: ' + new Date().toLocaleDateString());
        setJobTimestamp(new Date().toLocaleString());
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast({ variant: 'destructive', title: 'Popup Blocked', description: 'Please allow popups to view the sketch export.' });
            return;
        }
        
        printWindow.document.write(`
            <html>
            <head>
                <title>ArithmaGen Export - ${new Date().toLocaleDateString()}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono&display=swap');
                    body { 
                        margin: 0; 
                        background: #020617; 
                        color: #f8fafc; 
                        font-family: 'Inter', sans-serif; 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                        padding: 40px; 
                        min-height: 100vh;
                    }
                    .container { 
                        max-width: 1200px; 
                        width: 100%; 
                        display: flex; 
                        flex-direction: column; 
                        gap: 32px; 
                    }
                    header { 
                        border-bottom: 1px solid #1e293b; 
                        padding-bottom: 24px; 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: flex-end; 
                    }
                    .branding h1 { 
                        margin: 0; 
                        font-size: 28px; 
                        font-weight: 900; 
                        letter-spacing: -0.05em; 
                        color: #fbbf24; 
                        text-transform: uppercase;
                    }
                    .branding p { margin: 4px 0 0; font-size: 12px; color: #64748b; font-weight: 600; letter-spacing: 0.1em; }
                    .meta { text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8; line-height: 1.6; }
                    .canvas-frame { 
                        border: 1px solid #334155; 
                        border-radius: 16px; 
                        overflow: hidden; 
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); 
                        background: #000;
                        position: relative;
                    }
                    img { display: block; max-width: 100%; height: auto; }
                    .controls { display: flex; justify-content: center; gap: 12px; margin-top: 24px; }
                    .btn { 
                        background: #1e293b; 
                        color: white; 
                        border: none; 
                        padding: 8px 16px; 
                        border-radius: 6px; 
                        font-size: 12px; 
                        font-weight: 600; 
                        cursor: pointer; 
                        transition: all 0.2s;
                    }
                    .btn:hover { background: #334155; transform: translateY(-1px); }
                    footer { margin-top: auto; padding-top: 40px; font-size: 10px; color: #475569; text-align: center; text-transform: uppercase; letter-spacing: 0.2em; }
                    @media print { .btn { display: none; } body { padding: 0; background: white; color: black; } .canvas-frame { box-shadow: none; border: 1px solid #ccc; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <div class="branding">
                            <h1>ArithmaGen Studio</h1>
                            <p>Spatial Data Export</p>
                        </div>
                        <div class="meta">
                            <div>TIMESTAMP: ${jobTimestamp}</div>
                            <div>SOURCE: FIELD_SKETCH_MODULE</div>
                        </div>
                    </header>
                    <div class="canvas-frame">
                        <img id="export-image" src="" alt="Sketch Export" />
                    </div>
                    <div class="controls">
                        <button class="btn" onclick="window.print()">Print Report</button>
                        <button class="btn" onclick="window.close()">Close Window</button>
                    </div>
                    <footer>Generated via ArithmaGen Precision Toolkit &copy; ${new Date().getFullYear()}</footer>
                </div>
            </body>
            </html>
        `);

        // Draw overlays for the capture
        renderCanvas(false);
        ctx.save();
        
        // --- DRAW OVERLAYS FOR EXPORT ---
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; ctx.beginPath();
        const nx = notePos.x; const ny = notePos.y;
        const lines = jobTitle.split('\n'); const nh = 40 + (lines.length * 16);
        ctx.roundRect(nx, ny, 220, nh, 8); ctx.fill(); ctx.strokeStyle = '#334155'; ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('SKETCH LOG', nx + 12, ny + 18);
        ctx.fillStyle = '#ffffff'; ctx.font = '500 12px sans-serif'; lines.forEach((line, i) => ctx.fillText(line, nx + 12, ny + 38 + (i * 16)));
        ctx.fillStyle = '#94a3b8'; ctx.font = '9px monospace'; ctx.fillText(jobTimestamp, nx + 12, ny + nh - 8);
        const ax = arrowPos.x + 20; const ay = arrowPos.y + 20;
        ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('N', ax, ay - 12);
        ctx.beginPath(); ctx.moveTo(ax, ay - 18); ctx.lineTo(ax - 10, ay + 12); ctx.lineTo(ax, ay + 6); ctx.lineTo(ax + 10, ay + 12); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
        const sx = scalePos.x; const sy = scalePos.y;
        ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.font = '10px monospace'; ctx.fillText('Scale: 100 Units', sx, sy - 5);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1; for (let i = 0; i < 4; i++) { ctx.fillStyle = (i % 2 === 0) ? '#000' : '#fff'; ctx.fillRect(sx + (i * 25), sy, 25, 6); ctx.strokeRect(sx + (i * 25), sy, 25, 6); }
        
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/png');
        
        // Finalize image in the new window
        const img = printWindow.document.getElementById('export-image') as HTMLImageElement;
        if (img) img.src = dataUrl;

        renderCanvas(); // Redraw normal state
        toast({ title: "Export Ready", description: "High-resolution studio view generated." });
    };

    const handleUndo = useCallback(() => {
        if (currentStroke.points.length > 1) {
            const newPoints = [...currentStroke.points]; newPoints.pop();
            const newPenPos = newPoints[newPoints.length - 1]; setPenPos(newPenPos); setCurrentStroke(s => ({ ...s, points: newPoints }));
            setCamera(c => ({...c, x: newPenPos.x, y: newPenPos.y}));
        } else if (history.length > 0) {
            const lastHistory = [...history]; const restoredStroke = lastHistory.pop();
            if (restoredStroke) { setHistory(lastHistory); const newPenPos = restoredStroke.points[restoredStroke.points.length - 1]; setPenPos(newPenPos); setCurrentStroke(restoredStroke); setCamera(c => ({...c, x: newPenPos.x, y: newPenPos.y})); }
        }
    }, [history, currentStroke]);

    const handleClose = () => {
        if (currentStroke.points.length < 2) return;
        const startPt = currentStroke.points[0]; const newPenPos = { x: startPt.x, y: startPt.y, bearing: penPos.bearing };
        setPenPos(newPenPos); const closedStroke = { ...currentStroke, points: [...currentStroke.points, newPenPos]};
        setCurrentStroke({ points: [newPenPos], color: activeColor, lineWidth: activeWeight }); setHistory(h => [...h, closedStroke]);
        setCamera(c => ({...c, x: newPenPos.x, y: newPenPos.y}));
        addWorkspacePoint(newPenPos.x, newPenPos.y);
    };

    const handleTraverse = () => {
        if (!inputDistRef.current) return;
        const dist = parseFloat(inputDistRef.current.value); if (isNaN(dist) || dist <= 0) return;
        let az = null;
        if (traverseMode === 'bearing' && inputBearingRef.current) {
            let str = inputBearingRef.current.value.trim().toUpperCase();
            const qbMatch = str.match(/^([NS])\s*([\d.-]+(?:\s*-\s*[\d.-]+){0,2})\s*([EW])$/);
            if (qbMatch) {
                const [, ns, angleStr, ew] = qbMatch as [string, 'N' | 'S', string, 'E' | 'W'];
                const parts = angleStr.split(/\s*-\s*/).map(parseFloat);
                const dec = (parts[0] || 0) + (parts[1] || 0) / 60 + (parts[2] || 0) / 3600;
                if (ns === 'N' && ew === 'E') az = dec; else if (ns === 'S' && ew === 'E') az = 180 - dec;
                else if (ns === 'S' && ew === 'W') az = 180 + dec; else if (ns === 'N' && ew === 'W') az = 360 - dec;
            } else az = parseFloat(str);
        } else if (traverseMode === 'azimuth' && inputAzimuthRef.current) az = parseFloat(inputAzimuthRef.current.value);
        if (az === null || isNaN(az)) return;
        const rad = (az * Math.PI) / 180; const newPos = { x: penPos.x + dist * Math.sin(rad), y: penPos.y + dist * Math.cos(rad), bearing: rad };
        setPenPos(newPos); setCurrentStroke(s => ({ ...s, points: [...s.points, newPos]})); setCamera(c => ({...c, x: newPos.x, y: newPos.y}));
        addWorkspacePoint(newPos.x, newPos.y);
    };

    const handleStakeCurve = (direction: 'left' | 'right') => {
        const R = parseFloat(curveRadius);
        const L = parseFloat(curveLength);
        if (isNaN(R) || R <= 0 || isNaN(L) || L <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Curve Data' });
            return;
        }

        const delta = L / R;
        const steps = 30; 
        const newPoints = [];
        const startAz = penPos.bearing;
        
        for (let i = 1; i <= steps; i++) {
            const partialL = (L * i) / steps;
            const partialDelta = partialL / R;
            const chord = 2 * R * Math.sin(partialDelta / 2);
            const chordAz = direction === 'right' 
                ? startAz + (partialDelta / 2) 
                : startAz - (partialDelta / 2);
            
            const px = penPos.x + chord * Math.sin(chordAz);
            const py = penPos.y + chord * Math.cos(chordAz);
            const pAz = direction === 'right' 
                ? startAz + partialDelta 
                : startAz - partialDelta;
                
            newPoints.push({ x: px, y: py, bearing: pAz });
        }

        const lastPt = newPoints[newPoints.length - 1];
        setPenPos(lastPt);
        setCurrentStroke(s => ({ ...s, points: [...s.points, ...newPoints] }));
        setCamera(c => ({ ...c, x: lastPt.x, y: lastPt.y }));
        addWorkspacePoint(lastPt.x, lastPt.y);
        toast({ title: `Curve ${direction === 'right' ? 'Right' : 'Left'} Staked` });
    };

    const handleStakeTangent = () => {
        const R = parseFloat(curveRadius);
        const L = parseFloat(curveLength);
        if (isNaN(R) || R <= 0 || isNaN(L) || L <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Curve Data' });
            return;
        }
        const delta = L / R;
        const T = R * Math.tan(delta / 2);
        
        const rad = penPos.bearing;
        const newPos = { x: penPos.x + T * Math.sin(rad), y: penPos.y + T * Math.cos(rad), bearing: rad };
        setPenPos(newPos);
        setCurrentStroke(s => ({ ...s, points: [...s.points, newPos] }));
        setCamera(c => ({ ...c, x: newPos.x, y: newPos.y }));
        addWorkspacePoint(newPos.x, newPos.y);
        toast({ title: 'Tangent Line Staked' });
    };

    const handleStyleChange = (color?: string, weight?: number) => {
        if (color !== undefined) setActiveColor(color);
        if (weight !== undefined) setActiveWeight(weight);
        if (currentStroke.points.length > 1) {
            setHistory(prev => [...prev, currentStroke]);
            setCurrentStroke({ points: [penPos], color: color ?? activeColor, lineWidth: weight ?? activeWeight });
        } else setCurrentStroke(s => ({ ...s, color: color ?? activeColor, lineWidth: weight ?? activeWeight }));
    };

    const handleDropManualPoint = () => {
        const x = parseFloat(manualX);
        const y = parseFloat(manualY);
        if (isNaN(x) || isNaN(y)) {
            toast({ variant: 'destructive', title: 'Invalid Coordinates' });
            return;
        }
        addWorkspacePoint(x, y);
        setManualX('');
        setManualY('');
        toast({ title: 'Point Dropped' });
    };

    const handleSignOut = async () => {
        if (!auth) return;
        try {
            await firebaseSignOut(auth);
            toast({ title: 'Signed out.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Sign Out Failed', description: error.message });
        }
    };

    useEffect(() => {
        if (!areaDisplayRef.current) return;
        let target = currentStroke.points.length > 2 ? currentStroke.points : (history.length > 0 ? history[history.length - 1].points : null);
        if(target) { const a = getShapeArea(target); areaDisplayRef.current.innerText = `${a.acres.toFixed(3)} Ac`; }
    }, [currentStroke, history]);

    return (
        <div className="flex flex-col h-screen bg-background relative overflow-hidden">
            <SketchHeader />
            <div className="flex-1 flex overflow-hidden pt-10 max-w-[1920px] mx-auto w-full">
                <main ref={canvasContainerRef} className="relative flex-grow bg-black overflow-hidden select-none">
                    <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
                    
                    {/* Floating Paper Space UI */}
                    <div style={{ left: arrowPos.x, top: arrowPos.y }} className="absolute z-30 flex flex-col items-center cursor-move select-none p-2 hover:bg-white/5 rounded-md" onMouseDown={() => setActiveDrag('arrow')}>
                        <div className="text-amber-400 font-bold text-xl drop-shadow-md">N</div>
                        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 2L10 32L20 26L30 32L20 2Z" fill="#fbbf24" stroke="#000" strokeWidth="1"/></svg>
                    </div>
                    <div style={{ left: notePos.x, top: notePos.y }} className="absolute z-30 p-3 cursor-move select-none bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl min-w-[220px]" onMouseDown={() => setActiveDrag('note')}>
                        <div className="text-amber-400 text-[10px] font-bold uppercase tracking-tighter mb-1 border-b border-amber-400/20 pb-1">Sketch Log</div>
                        <div className="text-white text-xs font-medium whitespace-pre-wrap leading-tight">{jobTitle}</div>
                        <div className="text-slate-400 text-[9px] mt-2 font-mono">{jobTimestamp}</div>
                    </div>
                    <div style={{ left: scalePos.x, top: scalePos.y }} className="absolute z-30 p-2 cursor-move select-none bg-slate-900/40 rounded-md" onMouseDown={() => setActiveDrag('scale')}>
                        <div className="text-white text-[10px] font-mono mb-1">Scale: 100 Units</div>
                        <div className="w-[100px] h-[6px] bg-white border border-black flex overflow-hidden"><div className="w-1/4 h-full bg-black"></div><div className="w-1/4 h-full bg-white"></div><div className="w-1/4 h-full bg-black"></div><div className="w-1/4 h-full bg-white"></div></div>
                    </div>
                </main>

                {/* Right Workspace Sidebar - Fixed Width, Anchored Right */}
                <aside className="w-80 border-l bg-[#020617] flex flex-col z-50 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] overflow-hidden shrink-0">
                    {/* Fixed Sidebar Header */}
                    <div className="h-14 flex items-center px-6 border-b border-white/5 bg-[#020617] text-white flex-shrink-0 z-10">
                        <div className="flex items-center gap-3">
                            <PenTool className="h-5 w-5 text-amber-400" />
                            <div className="flex flex-col">
                                <span className="font-black text-xs uppercase tracking-widest">Sketch Console</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-none mt-0.5">Control & Analysis</span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <ScrollArea className="flex-1 bg-[#020617]">
                        <div className="p-5 space-y-6 pb-12">
                            {/* Job Controls */}
                            <div className="card-sketch group">
                                <div className="flex items-center justify-between mb-2">
                                    <strong className="text-amber-400/80">Project Workspace</strong>
                                    <Activity className="h-3 w-3 opacity-20" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[9px] mb-3 font-mono">
                                    <div className="p-1.5 bg-background/5 border border-white/5 rounded">
                                        <span className="text-muted-foreground uppercase">Pen X:</span>
                                        <span className="text-blue-400 ml-1">{penPos.x.toFixed(2)}</span>
                                    </div>
                                    <div className="p-1.5 bg-background/5 border border-white/5 rounded">
                                        <span className="text-muted-foreground uppercase">Pen Y:</span>
                                        <span className="text-blue-400 ml-1">{penPos.y.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Textarea 
                                    value={jobTitle} 
                                    onChange={(e) => setJobTitle(e.target.value)} 
                                    className="min-h-[80px] text-xs font-semibold resize-none bg-background/5 border-white/5 focus:border-amber-400/30 transition-colors text-white" 
                                    placeholder="Enter Project Details..." 
                                />
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <Button size="sm" variant="secondary" className="h-8 text-[10px] font-bold uppercase" onClick={handlePrint}><ExternalLink className="h-3 w-3 mr-1.5" /> Standalone</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase border-white/10 text-white" onClick={handleNewJob}><FilePlus className="h-3 w-3 mr-1.5" /> New Session</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase border-white/10 text-white" onClick={handleZoomOut}><ZoomOut className="h-3 w-3 mr-1.5" /> Scale Out</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase border-white/10 text-white" onClick={handleZoomIn}><ZoomIn className="h-3 w-3 mr-1.5" /> Scale In</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase border-white/10 text-white" onClick={handleCenterPen}><Crosshair className="h-3 w-3 mr-1.5" /> Center View</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase border-white/10 text-white" onClick={handleZoomExtents}><Maximize className="h-3 w-3 mr-1.5" /> Fit Extents</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase border-white/10 text-white" onClick={handleUndo}><Undo2 className="h-3 w-3 mr-1.5" /> Undo</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase border-white/10 text-white" onClick={handleClose}><Ban className="h-3 w-3 mr-1.5" /> Terminate</Button>
                                </div>
                                <Separator className="my-3 opacity-5" />
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="show-pen" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Instrument Visible</Label>
                                    <Switch id="show-pen" checked={showPen} onCheckedChange={setShowPen} className="scale-75" />
                                </div>
                            </div>
                            
                            {/* Point Management */}
                            <div className="card-sketch">
                                <strong className="text-amber-400/80 mb-2">Coordinate Input</strong>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] uppercase font-black tracking-tighter opacity-40 text-white">Easting (X)</Label>
                                        <Input value={manualX} onChange={e => setManualX(e.target.value)} className="h-8 text-xs font-mono bg-white/5 border-white/5 text-white" placeholder="0.000"/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] uppercase font-black tracking-tighter opacity-40 text-white">Northing (Y)</Label>
                                        <Input value={manualY} onChange={e => setManualY(e.target.value)} className="h-8 text-xs font-mono bg-white/5 border-white/5 text-white" placeholder="0.000"/>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full h-9 mt-2 font-black uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-blue-500 text-white" onClick={handleDropManualPoint}>Drop Point</Button>
                                
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <Label className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-2 block text-white">Visual Select Tools</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant={draftMode === 'delete-point' ? "destructive" : "outline"} size="sm" className="h-9 text-[10px] font-black uppercase text-white border-white/10" onClick={() => setDraftMode(draftMode === 'delete-point' ? 'none' : 'delete-point')}>
                                            <MapPin className="h-3.5 w-3.5 mr-1.5"/> Kill Point
                                        </Button>
                                        <Button variant={draftMode === 'delete-stroke' ? "destructive" : "outline"} size="sm" className="h-9 text-[10px] font-black uppercase text-white border-white/10" onClick={() => setDraftMode(draftMode === 'delete-stroke' ? 'none' : 'delete-stroke')}>
                                            <Eraser className="h-3.5 w-3.5 mr-1.5"/> Kill Line
                                        </Button>
                                    </div>
                                </div>

                                {savedPoints.length > 0 && (
                                    <div className="mt-4">
                                        <ScrollArea className="h-48 border border-white/5 rounded-lg bg-black/40 p-1.5">
                                            <div className="space-y-1.5">
                                                {savedPoints.slice().reverse().map(pt => (
                                                    <div key={pt.id} className={cn("flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] p-2 rounded-md transition-colors", pt.status === 'deleted' && "opacity-30 grayscale italic")}>
                                                        <div className="flex flex-col">
                                                            <span className={cn("text-[11px] font-black uppercase tracking-tight", pt.status === 'active' ? "text-amber-400" : "line-through text-slate-500")}>{pt.name}</span>
                                                            <span className="font-mono text-[9px] text-slate-400">{pt.x.toFixed(3)}, {pt.y.toFixed(3)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {pt.status === 'active' ? (
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={() => handlePointDeletion(pt.id)}><Trash2 className="h-3.5 w-3.5"/></Button>
                                                            ) : (
                                                                <span className="text-[8px] font-black uppercase tracking-tighter text-destructive/50 px-1.5 py-0.5 border border-destructive/10 rounded">Void</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>

                            {/* Drafting Suite */}
                            <div className="card-sketch">
                                <strong className="text-amber-400/80 mb-2">Drafting Suite</strong>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant={draftMode === 'line' ? "default" : "outline"} className="h-10 text-[10px] font-black uppercase text-white border-white/10" onClick={() => { if (draftMode === 'line') setDraftMode('none'); else { setDraftMode('line'); setDrawStep(0); } }}><MousePointerSquareDashed className="h-4 w-4 mr-2" /> Line</Button>
                                    <Button variant={draftMode === 'arc' ? "default" : "outline"} className="h-10 text-[10px] font-black uppercase text-white border-white/10" onClick={() => { if (draftMode === 'arc') setDraftMode('none'); else { setDraftMode('arc'); setDrawStep(0); } }}><Spline className="h-4 w-4 mr-2" /> Arc</Button>
                                    <Button variant={draftMode === 'rotate-all' ? "default" : "outline"} className="h-10 text-[10px] font-black uppercase text-white border-white/10" onClick={() => { if (draftMode === 'rotate-all') setDraftMode('none'); else { setDraftMode('rotate-all'); setDrawStep(0); } }}><RefreshCw className="h-4 w-4 mr-2" /> Global Rot</Button>
                                    <Button variant={draftMode === 'rotate-item' ? "default" : "outline"} className="h-10 text-[10px] font-black uppercase text-white border-white/10" onClick={() => { if (draftMode === 'rotate-item') setDraftMode('none'); else { setDraftMode('rotate-item'); setDrawStep(0); } }}><RotateCw className="h-4 w-4 mr-2" /> Item Rot</Button>
                                </div>
                                <Separator className="my-3 opacity-5" />
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="snap-pts" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 flex items-center gap-2"><Magnet className="h-3.5 w-3.5 text-blue-400"/> Magnetic Snap</Label>
                                    <Switch id="snap-pts" checked={snapEnabled} onCheckedChange={setSnapToPoints} className="scale-75" />
                                </div>
                                {draftMode !== 'none' && (
                                    <div className={cn("mt-3 p-2 rounded-md bg-background/40 border border-white/5 text-center animate-pulse", ['delete-point', 'delete-stroke'].includes(draftMode) ? "text-destructive" : "text-blue-400")}>
                                        <p className="text-[10px] font-black uppercase tracking-widest">
                                            {draftMode === 'line' && (drawStep === 0 ? "Click Origin" : "Click Destination")}
                                            {draftMode === 'arc' && (drawStep === 0 ? "Click Start" : drawStep === 1 ? "Click Mid" : "Click End")}
                                            {draftMode === 'rotate-all' && (drawStep === 0 ? "Pick Pivot" : drawStep === 1 ? "Pick Ref" : "Pick Target")}
                                            {draftMode === 'rotate-item' && (drawStep === 0 ? "Pick Item" : drawStep === 1 ? "Pick Ref" : "Pick Target")}
                                            {draftMode === 'delete-point' && "Identify Point to Kill"}
                                            {draftMode === 'delete-stroke' && "Identify Line to Kill"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Styles */}
                            <div className="card-sketch">
                                <strong className="text-amber-400/80 mb-2">Style Profile</strong>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 text-white">Active Color</Label>
                                        <input type="color" className="w-12 h-7 p-0 border-none cursor-pointer rounded-md overflow-hidden bg-transparent" value={activeColor} onChange={(e) => handleStyleChange(e.target.value)} />
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 text-white">Pen Weight</Label>
                                        <div className="flex-1 px-2">
                                            <input type="range" min="1" max="10" step="0.5" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" value={activeWeight} onChange={(e) => handleStyleChange(undefined, parseFloat(e.target.value))} />
                                        </div>
                                        <span className="text-[10px] font-mono font-bold w-6 text-right text-white">{activeWeight}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Coordinate Geometry & Curves */}
                            <div className="card-sketch">
                                <strong className="text-amber-400/80 mb-2">Coordinate Geometry</strong>
                                <RadioGroup value={traverseMode} onValueChange={(v: any) => setTraverseMode(v)} className="flex gap-4 my-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="bearing" id="r-bearing" className="border-white/20" />
                                        <Label htmlFor="r-bearing" className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">Bearing</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="azimuth" id="r-azimuth" className="border-white/20" />
                                        <Label htmlFor="r-azimuth" className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">Azimuth</Label>
                                    </div>
                                </RadioGroup>
                                <div className="space-y-2 mt-2">
                                    {traverseMode === 'bearing' ? 
                                        <Input ref={inputBearingRef} defaultValue="N0.0000E" className="h-9 font-mono text-xs bg-white/5 border-white/5 text-white" /> : 
                                        <Input ref={inputAzimuthRef} type="number" defaultValue="0.0000" className="h-9 font-mono text-xs bg-white/5 border-white/5 text-white" />
                                    }
                                    <Input ref={inputDistRef} type="number" defaultValue="100" placeholder="Distance" className="h-9 font-mono text-xs bg-white/5 border-white/5 text-white" />
                                </div>
                                <Button className="w-full mt-3 h-10 font-black uppercase text-[10px] tracking-widest border-2 border-amber-400/20 text-amber-400 hover:bg-amber-400/10 transition-all" variant="outline" onClick={handleTraverse}>Stake Precision Line</Button>
                                
                                <Separator className="my-4 opacity-5" />
                                
                                <strong className="text-blue-400/80 mb-2">Curve Precision</strong>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] uppercase font-black tracking-tighter opacity-40 text-white">Radius</Label>
                                        <Input value={curveRadius} onChange={e => setCurveRadius(e.target.value)} className="h-8 text-xs font-mono bg-white/5 border-white/5 text-white" placeholder="500.000"/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] uppercase font-black tracking-tighter opacity-40 text-white">Arc Length</Label>
                                        <Input value={curveLength} onChange={e => setCurveLength(e.target.value)} className="h-8 text-xs font-mono bg-white/5 border-white/5 text-white" placeholder="100.000"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button size="sm" variant="outline" className="h-9 text-[9px] font-black uppercase border-blue-500/20 text-blue-400 hover:bg-blue-500/10" onClick={handleStakeTangent}>Tangent</Button>
                                    <Button size="sm" variant="outline" className="h-9 text-[9px] font-black uppercase border-blue-500/20 text-blue-400 hover:bg-blue-500/10" onClick={() => handleStakeCurve('left')}>Curve L</Button>
                                    <Button size="sm" variant="outline" className="h-9 text-[9px] font-black uppercase border-blue-500/20 text-blue-400 hover:bg-blue-500/10" onClick={() => handleStakeCurve('right')}>Curve R</Button>
                                </div>
                            </div>

                            {/* Area */}
                            <div className="card-sketch">
                                <strong className="text-amber-400/80 mb-2">Spatial Analysis</strong>
                                <div className="flex justify-between items-center bg-black/40 border border-white/5 p-3 rounded-lg mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Live Analysis:</span>
                                    <span ref={areaDisplayRef} className="text-primary font-mono text-sm font-black">0.000 Ac</span>
                                </div>
                                <Button size="sm" variant="secondary" className="w-full h-10 font-black uppercase text-[10px] tracking-widest" onClick={() => { let pts = currentStroke.points.length > 2 ? currentStroke.points : (history.length > 0 ? history[history.length - 1].points : null); if (pts) { const a = getShapeArea(pts); if (a.acres > 0) { setSavedParcels(prev => [...prev, { id: prev.length + 1, acres: a.acres, points: [...pts!] }]); toast({ title: 'Parcel Logged' }); } } }}>
                                    <Save className="h-3.5 w-3.5 mr-2" /> Log Parcel
                                </Button>
                                {savedParcels.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <Separator className="opacity-5" />
                                        {savedParcels.map(p => (
                                            <div key={p.id} className="flex justify-between items-center p-2.5 rounded-md bg-white/[0.03] border border-white/5 group/parcel">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Parcel ID</span>
                                                    <span className="text-xs font-bold font-mono text-white">#{p.id.toString().padStart(3, '0')}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-[11px] font-black text-primary">{p.acres.toFixed(3)} AC</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/40 hover:text-destructive opacity-0 group-hover/parcel:opacity-100 transition-opacity" onClick={() => setSavedParcels(prev => prev.filter(x => x.id !== p.id))}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Fixed Sidebar Footer with Session Intel */}
                    <div className="h-14 border-t border-white/5 bg-[#020617] px-4 flex items-center shrink-0 z-10">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-9 text-[10px] font-black uppercase tracking-widest border-white/10 text-blue-400 hover:bg-blue-500/5 transition-all"
                            onClick={() => {
                                const activePnts = savedPoints.filter(p => p.status === 'active').length;
                                toast({
                                    title: "System Telemetry",
                                    description: `Points: ${activePnts} active | Parcels: ${savedParcels.length} | Instrument: (${penPos.x.toFixed(2)}, ${penPos.y.toFixed(2)})`,
                                });
                            }}
                        >
                            <Cpu className="h-3 w-3 mr-2" />
                            <div className="flex flex-col items-start leading-none gap-0.5">
                                <span>{user ? "Cloud Sync Active" : "Local Session Intel"}</span>
                                <span className="text-[8px] opacity-50 lowercase tracking-normal">Inst: {penPos.x.toFixed(1)}, {penPos.y.toFixed(1)}</span>
                            </div>
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
