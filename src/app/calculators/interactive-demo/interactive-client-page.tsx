'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
    Plus, 
    Minus, 
    Trash2, 
    Lightbulb, 
    RotateCw, 
    Save, 
    FolderOpen, 
    Loader2, 
    LayoutGrid,
    ChevronDown,
    Zap,
    ExternalLink,
    Activity,
    Terminal as TerminalIcon,
    Database
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as Labs from './labs';
import type { MathPoint, LabFunction, ParametricLabFunction } from './labs/types';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { useFirestore, useMemoFirebase, useCollection, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const GRID_SIZE = 800; 

const ScaleBar = ({ pixelsPerUnit, foregroundColor }: { pixelsPerUnit: number, foregroundColor: string }) => {
    const targetPixelWidth = 100;
    if (pixelsPerUnit <= 0 || !isFinite(pixelsPerUnit)) return null;
    const targetMathUnits = targetPixelWidth / pixelsPerUnit;
    const getNiceNumber = (num: number) => {
        if (num === 0) return 0;
        const power = Math.pow(10, Math.floor(Math.log10(num)));
        const magnitude = num / power;
        if (magnitude >= 5) return 5 * power;
        if (magnitude >= 2) return 2 * power;
        return 1 * power;
    };
    const scaleBarMathUnits = getNiceNumber(targetMathUnits);
    const scaleBarPixelWidth = scaleBarMathUnits * pixelsPerUnit;
    const label = scaleBarMathUnits < 1 ? scaleBarMathUnits.toFixed(2) : Math.round(scaleBarMathUnits).toString();
    return (
        <g transform={`translate(20, ${GRID_SIZE - 30})`}>
            <line x1="0" y1="5" x2={scaleBarPixelWidth} y2="5" stroke={foregroundColor} strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="10" stroke={foregroundColor} strokeWidth="1.5" />
            <line x1={scaleBarPixelWidth} y1="0" x2={scaleBarPixelWidth} y2="10" stroke={foregroundColor} strokeWidth="1.5" />
            <text x={scaleBarPixelWidth / 2} y="-5" textAnchor="middle" fontSize="10" fill={foregroundColor} className="font-sans">{label} units</text>
        </g>
    );
};

const InteractiveDemoClientPage = () => {
    const { toast } = useToast();
    const { theme } = useTheme();
    const svgRef = useRef<SVGSVGElement>(null);
    const firestore = useFirestore();
    const { user } = useUser();

    const defaultPoints = 'G,4935.257,5128.375\nJ,4956.755,4914.259\nK,5053.834,4893.170\nE,5110.888,4970.696';

    const LAB_LIBRARY: Record<string, any> = {
        '01': { id: 'parabola', title: 'Parabola Lab (01)', Component: Labs.ParabolaLab, defaultCoeffs: { a: 1, h: 2, k: -1 }, yString: 'a * Math.pow(x - h, 2) + k', dyString: '2 * a * (x - h)', params: ['a', 'h', 'k']},
        '02': { id: 'line', title: 'Line Lab (02)', Component: Labs.LineLab, defaultCoeffs: { m: 0.5, b: -2 }, yString: 'm * x + b', dyString: 'm', params: ['m', 'b']},
        '03': { id: 'circle', title: 'Circle Lab (03)', Component: Labs.CircleLab, defaultCoeffs: { h: 0, k: 0, r: 5}, isParametric: true, xTString: 'h + r * Math.cos(t)', yTString: 'k + r * Math.sin(t)', dxTString: '-r * Math.sin(t)', dyTString: 'r * Math.cos(t)', tMin: 0, tMax: () => 2 * Math.PI, tParams: ['h','k','r']},
        '04': { id: 'constant', title: 'Constant Lab (04)', Component: Labs.ConstantLab, defaultCoeffs: { k: 5 }, yString: 'k', dyString: '0', params: ['k']},
        '05': { id: 'absolute_value', title: 'Absolute Value (05)', Component: Labs.AbsoluteValueLab, defaultCoeffs: { a: 1, h: 2, k: 0}, yString: 'a * Math.abs(x - h) + k', dyString: 'a * (x - h) / Math.abs(x - h)', params: ['a','h','k']},
        '06': { id: 'greatest_integer', title: 'Greatest Integer (06)', Component: Labs.GreatestIntegerLab, defaultCoeffs: { h: 0, k: 0 }, yString: 'Math.floor(x - h) + k', dyString: '0', params: ['h','k']},
        '07': { id: 'logarithmic', title: 'Logarithmic Lab (07)', Component: Labs.LogarithmicLab, defaultCoeffs: { a: 3, b: Math.E, h: 0, k: 0 }, yString: 'a * (Math.log(x-h)/Math.log(b)) + k', dyString: 'a / ((x-h)*Math.log(b))', params: ['a','b','h','k'], minX: (c:any) => c.h },
        '08': { id: 'exponential', title: 'Exponential Lab (08)', Component: Labs.ExponentialLab, defaultCoeffs: { a: 5, b: Math.E, h: -0.5, k: 0}, yString: 'a * Math.pow(b, (x-h)) + k', dyString: 'a*Math.log(b)*Math.pow(b, (x-h))', params: ['a','b','h','k']},
        '09': { id: 'reciprocal', title: 'Reciprocal Lab (09)', Component: Labs.ReciprocalLab, defaultCoeffs: { a: 10, h: 0, k: 0}, yString: 'a / (x-h) + k', dyString: '-a / Math.pow(x-h, 2)', params: ['a','h','k'], excludeX: (c:any) => c.h},
        '10': { id: 'square_root', title: 'Square Root Lab (10)', Component: Labs.SquareRootLab, defaultCoeffs: { a: 1, h: -4, k: 0}, yString: 'a * Math.sqrt(x - h) + k', dyString: 'a / (2*Math.sqrt(x - h))', params: ['a','h','k'], minX: (c:any) => c.h},
        '11': { id: 'goniometric', title: 'Goniometric Lab (11)', Component: Labs.GoniometricLab, defaultCoeffs: { type: 'cos', a: 4, b: 3, h: 0, k: 0 }, yString: 'a * Math.cos(b * (x - h)) + k', dyString: '-a * b * Math.sin(b * (x - h))', params: ['type', 'a','b','h','k']},
        '12': { id: 'cubing', title: 'Cubing Lab (12)', Component: Labs.CubingLab, defaultCoeffs: { a: 1, h: 0, k: 0}, yString: 'a * Math.pow(x-h, 3) + k', dyString: '3 * a * Math.pow(x-h, 2)', params: ['a','h','k']},
        '13': { id: 'logistic', title: 'Logistic Lab (13)', Component: Labs.LogisticLab, defaultCoeffs: { L: 10, k: 1, x0: 0 }, yString: 'L / (1 + Math.exp(-k * (x - x0)))', params: ['L', 'k', 'x0']},
        '14': { id: 'tangential', title: 'Tangential Lab (14)', Component: Labs.TangentialLab, defaultCoeffs: { type: 'tan', a: 1, b: 1, h: 0, k: 0 }, yString: 'a * Math.tan(b * (x - h)) + k', params: ['a', 'b', 'h', 'k']},
        '15': { id: 'bell_curve', title: 'Bell Curve Lab (15)', Component: Labs.BellCurveLab, defaultCoeffs: { mu: 0, sigma: 1 }, yString: '(1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))', params: ['mu', 'sigma']},
        '16': { id: 'archimedean', title: 'Archimedean Spiral (16)', Component: Labs.ArchimedeanSpiralLab, defaultCoeffs: { growthFactor: 0.5, rotations: 5 }, isParametric: true, xTString: 'growthFactor * t * Math.cos(t)', yTString: 'growthFactor * t * Math.sin(t)', tMin: 0, tMax: (c:any) => c.rotations * 2 * Math.PI, tParams: ['growthFactor']},
        '17': { id: 'rose_star', title: 'Rose Star (17)', Component: Labs.RoseStarLab, defaultCoeffs: { a: 5, k: 4 }, isParametric: true, xTString: 'a * Math.cos(k * t) * Math.cos(t)', yTString: 'a * Math.cos(k * t) * Math.sin(t)', tMin: 0, tMax: () => 2 * Math.PI, tParams: ['a', 'k']},
        '18': { id: 'traverse', title: 'Traverse Lab (18)', Component: Labs.TraverseLab, defaultCoeffs: { start: {x: 0, y: 0}, legs: [{id: 1, direction: 45, distance: 5}], showCurve: true }, isPolyline: true },
        '19': { id: 'vertical_curve', title: 'Vertical Curve (19)', Component: Labs.VerticalCurveLab, defaultCoeffs: { g1: -3, g2: 2, L: 600, pvcStation: 1000, pvcElevation: 500 }, yString: '(g1/100)*(x-pvcStation) + (((g2-g1)/(100*L))/2)*Math.pow(x-pvcStation, 2) + pvcElevation', params: ['g1', 'g2', 'L', 'pvcStation', 'pvcElevation']},
        '20': { id: 'horizontal_curve', title: 'Horizontal Curve (20)', Component: Labs.HorizontalCurveLab, defaultCoeffs: { r: 5, delta: 45, pcx: 0, pcy: 0, bearing: 90, showCurve: true }},
        '21': { id: 'star_polygon', title: 'Star Polygon (21)', Component: Labs.StarPolygonLab, defaultCoeffs: { p: 5, q: 2, radius: 5 }},
        '22': { id: 'lissajous', title: 'Lissajous Lab (22)', Component: Labs.LissajousLab, defaultCoeffs: { A: 5, B: 5, a: 3, b: 2, delta: 90 }, isParametric: true, xTString: 'A * Math.sin(a * t + delta * Math.PI / 180)', yTString: 'B * Math.sin(b * t)', tMin: 0, tMax: () => 2 * Math.PI, tParams: ['A', 'B', 'a', 'b', 'delta']},
        '32': { id: 'damped_oscillation', title: 'Damped Oscillation (32)', Component: Labs.DampedOscillationLab, defaultCoeffs: { amplitude: 5, decay: 0.5, frequency: 5 }, yString: 'amplitude * Math.exp(-decay * x) * Math.cos(frequency * x)', params: ['amplitude', 'decay', 'frequency']},
        '33': { id: 'power_law', title: 'Power Law Lab (33)', Component: Labs.PowerLawLab, defaultCoeffs: { coefficient: 1, power: 2 }, yString: 'coefficient * Math.pow(x, power)', params: ['coefficient', 'power']},
        '34': { id: 'projectile', title: 'Projectile Motion (34)', Component: Labs.ProjectileMotionLab, defaultCoeffs: { a: -0.05, b: 1, c: 0 }, yString: 'a * x * x + b * x + c', params: ['a', 'b', 'c']},
        '35': { id: 'blackbody', title: 'Blackbody Lab (35)', Component: Labs.BlackbodyRadiationLab, defaultCoeffs: { c1: 5, c2: 1 }, yString: 'c1 / (Math.pow(x, 5) * (Math.exp(c2 / x) - 1))', params: ['c1', 'c2']},
        '37': { id: 'atom', title: 'Atom Lab (37)', Component: Labs.AtomLab, defaultCoeffs: { a: 1 }, yString: '4 * x * x * Math.exp(-a * x)', params: ['a']},
        '38': { id: 'gaussian_phys', title: 'Gaussian Physics (38)', Component: Labs.GaussianLab, defaultCoeffs: { A: 5, c: 1, x0: 0 }, yString: 'A * Math.exp(-c * Math.pow(x - x0, 2))', params: ['A', 'c', 'x0']},
        '39': { id: 'gravitational', title: 'Gravitation Lab (39)', Component: Labs.GravitationalPotentialLab, defaultCoeffs: { GMm: 10 }, yString: '-GMm / Math.abs(x)', params: ['GMm']},
        '43': { id: 'point_plotter', title: 'Point Plotter Lab (43)', Component: Labs.PointPlotterLab, defaultCoeffs: { points: defaultPoints, showCurve: true }, isPointPlot: true },
    };

    const [labStates, setLabStates] = useState<Record<string, any>>({});
    const [systemLogs, setSystemLog] = useState<string[]>(['> ArithmaGen Studio v1.2 Initialized.', '> System state: Ready.']);
    const [colors, setColors] = useState({ primary: 'hsl(217.2 91.2% 59.8%)', destructive: 'hsl(0 62.8% 30.6%)', foreground: 'hsl(210 40% 98%)', mutedForeground: 'hsl(215 20.2% 65.1%)', border: 'hsl(217.2 32.6% 17.5%)', card: 'hsl(222.2 84% 4.9%)', grid: 'hsl(217.2 32.6% 17.5%)' });
    const [slotColors] = useState(['#60A5FA', '#F87171', '#4ADE80', '#FBBF24', '#A78BFA']);
    const [openLabs, setOpenLabs] = useState<string[]>([]);
    const [command, setCommand] = useState('');
    const [viewport, setViewport] = useState({ zoom: 1, offset: { x: 0, y: 0 }});
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ clientX: 0, clientY: 0 });
    const [isPanEnabled, setIsPanEnabled] = useState(true);
    const [workspaceName, setWorkspaceName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setSystemLog(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
    };

    const workspacesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'workspaces'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    }, [firestore, user]);

    const { data: savedWorkspaces, isLoading: isLoadingWorkspaces } = useCollection(workspacesQuery);

    const handleSaveWorkspace = async () => {
        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Login Required', description: 'Please log in to save workspaces.' });
            return;
        }
        if (!workspaceName.trim()) {
            toast({ variant: 'destructive', title: 'Invalid Name', description: 'Enter a name for this workspace.' });
            return;
        }
        if (openLabs.length === 0) {
            toast({ variant: 'destructive', title: 'Empty Workspace', description: 'Open at least one lab before saving.' });
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(firestore, 'workspaces'), {
                name: workspaceName,
                openLabs,
                labStates,
                userId: user.uid,
                createdAt: serverTimestamp()
            });
            addLog(`Workspace "${workspaceName}" archived to cloud.`);
            setWorkspaceName('');
            toast({ title: 'Workspace Saved', description: `Configuration "${workspaceName}" is now in the cloud.` });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Save Failed', description: e.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoadWorkspace = (ws: any) => {
        setOpenLabs(ws.openLabs);
        setLabStates(ws.labStates);
        addLog(`Restored workspace: ${ws.name}`);
        toast({ title: 'Workspace Restored', description: `Loaded "${ws.name}" configuration.` });
    };

    const handleDeleteWorkspace = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'workspaces', id));
            addLog(`Purged workspace ID: ${id}`);
            toast({ title: 'Workspace Deleted' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Delete Failed', description: e.message });
        }
    };

    const basePixelsPerUnit = GRID_SIZE / 20;
    const pixelsPerUnit = useMemo(() => viewport.zoom * basePixelsPerUnit, [viewport.zoom, basePixelsPerUnit]);
    
    const screenToMath = useCallback((sx: number, sy: number) => {
        const effectivePPU = viewport.zoom * basePixelsPerUnit;
        return { x: (sx - GRID_SIZE / 2 - viewport.offset.x) / effectivePPU, y: -(sy - GRID_SIZE / 2 - viewport.offset.y) / effectivePPU };
    }, [viewport, basePixelsPerUnit]);
    
    const mathToScreen = useCallback((mx: number, my: number) => {
        const effectivePPU = viewport.zoom * basePixelsPerUnit;
        return { x: mx * effectivePPU + GRID_SIZE / 2 + viewport.offset.x, y: -my * effectivePPU + GRID_SIZE / 2 + viewport.offset.y };
    }, [viewport, basePixelsPerUnit]);
    
    useEffect(() => {
        if (typeof window === 'undefined' || !theme) return;
        const rootStyle = getComputedStyle(document.documentElement);
        const getCssVar = (name: string) => `hsl(${rootStyle.getPropertyValue(name).trim()})`;
        setColors({ primary: getCssVar('--primary'), destructive: getCssVar('--destructive'), foreground: getCssVar('--foreground'), mutedForeground: getCssVar('--muted-foreground'), border: getCssVar('--border'), card: getCssVar('--card'), grid: getCssVar('--border') });
    }, [theme]);
    
    const viewMin = useMemo(() => screenToMath(0, GRID_SIZE), [screenToMath]);
    const viewMax = useMemo(() => screenToMath(GRID_SIZE, 0), [screenToMath]);

    const handleSummonLab = useCallback((baseLabId: string) => {
        if (!LAB_LIBRARY[baseLabId]) return;
        setOpenLabs(prev => {
            let newLabId = baseLabId;
            if (prev.includes(baseLabId)) {
                for (const char of "abcdef") { if (!prev.includes(`${baseLabId}${char}`)) { newLabId = `${baseLabId}${char}`; break; } }
            }
            setLabStates(ls => ({...ls, [newLabId]: { ...LAB_LIBRARY[baseLabId].defaultCoeffs, showCurve: true }}));
            addLog(`Module summoned: ${LAB_LIBRARY[baseLabId].title}`);
            return [...prev, newLabId];
        });
    }, [LAB_LIBRARY]);
    
    const handleCloseLab = (labId: string) => {
        setLabStates(ls => { const s = { ...ls }; delete s[labId]; return s; });
        setOpenLabs(prev => prev.filter(id => id !== labId));
        addLog(`Module terminated: Lab ${labId}`);
    };

    const handleGenerateReport = (labId: string) => {
        const labState = labStates[labId];
        if (!labState || !svgRef.current) return;
        addLog(`Compiling high-fidelity report for ${labId}...`);

        const reportWindow = window.open('', '_blank');
        if (!reportWindow) {
            toast({ variant: 'destructive', title: 'Popup Blocked', description: 'Please allow popups to view the laboratory report.' });
            return;
        }
        reportWindow.document.write('<html><head><title>ArithmaGen Report</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;background:#020617;color:white;font-family:sans-serif;}</style></head><body><p>Generating Laboratory Report PDF...</p></body></html>');

        const baseId = labId.replace(/[a-z]$/, '');
        const svg = svgRef.current;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const scale = 2;
        canvas.width = GRID_SIZE * scale;
        canvas.height = GRID_SIZE * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            ctx.fillStyle = colors.card;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const doc = new jsPDF('p', 'mm', 'a4');
            doc.setFontSize(16);
            doc.text(LAB_LIBRARY[baseId].title, 20, 20);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 28);
            doc.addImage(canvas.toDataURL('image/jpeg', 0.75), 'JPEG', 20, 40, 170, 100);
            
            let analysis: string[] = [];
            const c = labState;
            switch(baseId) {
                case '01': 
                    const root1 = c.a !== 0 && -c.k/c.a >= 0 ? (c.h + Math.sqrt(-c.k/c.a)).toFixed(3) : 'None';
                    const root2 = c.a !== 0 && -c.k/c.a >= 0 ? (c.h - Math.sqrt(-c.k/c.a)).toFixed(3) : 'None';
                    analysis = [`Vertex: (${c.h}, ${c.k})`, `Equation: y = ${c.a}(x-${c.h})² + ${c.k}`, `Roots: ${root1}, ${root2}`]; 
                    break;
                case '02': 
                    const xInt = c.m !== 0 ? (-c.b / c.m).toFixed(3) : 'None';
                    analysis = [`Slope: ${c.m}`, `Intercept: ${c.b}`, `Equation: y = ${c.m}x + ${c.b}`, `X-Intercept: ${xInt}`]; 
                    break;
                case '03': analysis = [`Center: (${c.h}, ${c.k})`, `Radius: ${c.r}`, `Area: ${(Math.PI*c.r*c.r).toFixed(3)}`, `Circumference: ${(2*Math.PI*c.r).toFixed(3)}` ]; break;
                case '07':
                    const xIntercept = c.a !== 0 ? (c.h + Math.pow(c.b, -c.k / c.a)).toFixed(3) : 'None';
                    analysis = [
                        `Base: ${c.b.toFixed(3)}`,
                        `Shift: (h: ${c.h}, k: ${c.k})`,
                        `Equation: y = ${c.a} * log(${c.b})(x - ${c.h}) + ${c.k}`,
                        `Domain: x > ${c.h}`,
                        `Vertical Asymptote: x = ${c.h}`,
                        `X-Intercept: ${xIntercept}`
                    ];
                    break;
                case '19':
                    const r_val = (c.g2 - c.g1) / (100 * c.L);
                    analysis = [
                        `Initial Grade (g1): ${c.g1}%`,
                        `Final Grade (g2): ${c.g2}%`,
                        `Curve Length (L): ${c.L}`,
                        `Rate of Change (r): ${(r_val * 100).toFixed(4)}% per unit`,
                        `PVC: Station ${c.pvcStation}, Elevation ${c.pvcElevation}`,
                        `PVI: Station ${c.pvcStation + c.L/2}, Elevation ${(c.pvcElevation + (c.g1/100)*(c.L/2)).toFixed(3)}`,
                        `PVT: Station ${c.pvcStation + c.L}, Elevation ${(c.pvcElevation + (c.g1/100)*c.L + (r_val/2)*c.L*c.L).toFixed(3)}`
                    ];
                    break;
            }
            
            let yPos = 150;
            doc.setFontSize(12);
            analysis.forEach(line => { doc.text(line, 25, yPos); yPos += 7; });
            
            const pdfBlob = doc.output('bloburl');
            reportWindow.location.href = pdfBlob;
            addLog(`Report generated successfully.`);
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    const createLabObject = useCallback((labId: string, state: any): LabFunction | ParametricLabFunction | null => {
        const baseId = labId.replace(/[a-z]$/, '');
        const d = LAB_LIBRARY[baseId];
        if (!d || !state) return null;
        if (d.isParametric) {
            const p = d.tParams.map((k:string) => state[k]);
            const getX = new Function('t', ...d.tParams, `return ${d.xTString}`);
            const getY = new Function('t', ...d.tParams, `return ${d.yTString}`);
            return { isParametric: true, getX: (t) => getX(t, ...p), getY: (t) => getY(t, ...p), getSlopeX: (t) => null, getSlopeY: (t) => null, getTMin: () => d.tMin, getTMax: () => typeof d.tMax === 'function' ? d.tMax(state) : d.tMax } as any;
        }
        if (!d.params) return null;
        const p = d.params.map((k:string) => state[k]);
        const getY = new Function('x', ...d.params, `return ${d.yString}`);
        const getSlope = d.dyString ? new Function('x', ...d.params, `return ${d.dyString}`) : () => null;
        return { getY: (x) => getY(x, ...p), getSlope: (x) => getSlope(x, ...p) } as any;
    }, [LAB_LIBRARY]);

    const renderLabCard = (id: string) => {
        const b = id.replace(/[a-z]$/, '');
        const lab = LAB_LIBRARY[b];
        const reportable = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '18', '19'].includes(b);
        return <lab.Component key={id} title={lab.title} coeffs={labStates[id]} setCoeffs={(u:any) => setLabStates(s => ({...s, [id]: typeof u === 'function' ? u(s[id]) : u}))} onClose={() => handleCloseLab(id)} onGenerateReport={reportable ? () => handleGenerateReport(id) : undefined} />;
    };

    const handleCommandSubmit = (e: React.FormEvent) => { e.preventDefault(); let id = command.trim().padStart(2, '0'); handleSummonLab(id); setCommand(''); };

    const sortedLabEntries = useMemo(() => {
        return Object.entries(LAB_LIBRARY).sort((a, b) => a[0].localeCompare(b[0]));
    }, []);

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                            <Zap className="h-4 w-4" /> Command Center
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black tracking-widest opacity-50">Module Selection</Label>
                            <Select onValueChange={handleSummonLab}>
                                <SelectTrigger className="bg-muted/50 border-primary/10 h-10">
                                    <SelectValue placeholder="Search & Summon..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-80">
                                    <SelectGroup>
                                        <SelectLabel className="text-[10px] uppercase tracking-widest py-2">Analytical Modules</SelectLabel>
                                        {sortedLabEntries.map(([id, lab]) => (
                                            <SelectItem key={id} value={id} className="text-xs font-bold py-2">
                                                {lab.title}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator className="bg-primary/5" />
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black tracking-widest opacity-50">Direct ID Command</Label>
                            <form onSubmit={handleCommandSubmit} className="flex gap-2">
                                <Input placeholder="Module #..." value={command} onChange={e => setCommand(e.target.value)} className="h-9 text-xs font-mono" />
                                <Button variant="destructive" size="icon" className="h-9 w-9 shrink-0" onClick={() => {setOpenLabs([]); setLabStates({}); addLog('Studio matrix cleared.');}}><Trash2 className="h-4 w-4"/></Button>
                            </form>
                        </div>
                        <Separator className="bg-primary/5" />
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black tracking-widest opacity-50">Workspace Sync</Label>
                            <div className="flex gap-2">
                                <Input placeholder="Checkpoint Name..." value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} className="h-9 text-xs" />
                                <Button size="sm" onClick={handleSaveWorkspace} disabled={isSaving || !user} className="h-9 shrink-0">
                                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                                    Save
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="md:col-span-2 flex flex-col gap-4">
                    <Alert className="border-primary/20 bg-primary/5">
                        <Lightbulb className="h-4 w-4 text-primary"/><AlertTitle className="text-primary font-black uppercase text-xs tracking-widest">Operational Insight</AlertTitle>
                        <AlertDescription className="text-sm">Select a module from the dropdown to initialize its plot on the expanded high-resolution stage. You can <span className="font-bold text-primary">Save Workspaces</span> to checkpoint your entire configuration to the cloud.</AlertDescription>
                    </Alert>
                    
                    <Card className="flex-1 border-primary/10 bg-slate-950/40 font-mono text-[10px] overflow-hidden group">
                        <CardHeader className="py-2 px-4 border-b border-white/5 bg-slate-950/60 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TerminalIcon className="h-3 w-3 text-primary" />
                                <span className="font-black uppercase tracking-widest text-primary opacity-80">Live System Log</span>
                            </div>
                            <span className="text-[8px] font-bold text-muted-foreground/40 uppercase">Studio Engine v1.2</span>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[100px] p-4">
                                <div className="space-y-1">
                                    {systemLogs.map((log, i) => (
                                        <p key={i} className={cn("text-blue-100/60 leading-tight", i === 0 && "text-blue-400 font-bold")}>
                                            {log}
                                        </p>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Unified Sidebar for all labs */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    {openLabs.map(renderLabCard)}
                    {openLabs.length === 0 && (
                        <Card className="border-dashed border-primary/20 bg-muted/20 opacity-40">
                            <CardContent className="py-12 text-center text-muted-foreground text-xs uppercase font-black tracking-widest">
                                MODULE MATRIX EMPTY
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Expanded High-Resolution stage spanning 2 columns */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-primary/20 shadow-2xl overflow-hidden aspect-square flex flex-col">
                        <CardHeader className="bg-slate-950/50 border-b border-white/5 py-3 shrink-0">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-[10px] uppercase font-black tracking-[0.3em] text-primary">Interactive Analysis Stage</CardTitle>
                                <LayoutGrid className="h-3 w-3 text-primary/40" />
                            </div>
                        </CardHeader>
                        <CardContent 
                            className="relative bg-[#020617] p-0 overflow-hidden shadow-inner flex-1" 
                            onMouseDown={e => {if(!isPanEnabled)return; setIsDragging(true); dragStartRef.current={clientX:e.clientX, clientY:e.clientY};}} 
                            onMouseMove={e => {if(isDragging){setViewport(v => ({...v, offset: {x: v.offset.x + e.clientX - dragStartRef.current.clientX, y: v.offset.y + e.clientY - dragStartRef.current.clientY}})); dragStartRef.current={clientX:e.clientX, clientY:e.clientY};}}} 
                            onMouseUp={() => setIsDragging(false)} 
                            onMouseLeave={() => setIsDragging(false)}
                        >
                            <svg 
                                ref={svgRef} 
                                width="100%" 
                                height="100%" 
                                viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`} 
                                className={cn(isPanEnabled ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair", "block")}
                            >
                                <rect width="100%" height="100%" fill="#020617" />
                                <g key="grid-system">
                                    {(() => {
                                        const mathStepCandidate = 50 / pixelsPerUnit;
                                        const power = Math.pow(10, Math.floor(Math.log10(mathStepCandidate)));
                                        const rel = mathStepCandidate / power;
                                        let step = power; if (rel > 5) step = 10 * power; else if (rel > 2) step = 5 * power; else if (rel > 1) step = 2 * power;
                                        const items = [];
                                        const startX = Math.floor(viewMin.x / step) * step;
                                        for (let x = startX; x <= viewMax.x; x += step) {
                                            const p = mathToScreen(x, 0); const isAxis = Math.abs(x) < 1e-9;
                                            items.push(<line key={`v-${x}`} x1={p.x} y1={0} x2={p.x} y2={GRID_SIZE} stroke={colors.grid} strokeWidth={isAxis ? 2 : 0.5} opacity={isAxis ? 0.8 : 0.3} />);
                                            if (!isAxis) items.push(<text key={`v-val-${x}`} x={p.x + 2} y={GRID_SIZE - 5} fill={colors.foreground} fontSize="9" fontWeight="bold" opacity="0.6">{x.toFixed(x % 1 === 0 ? 0 : 1)}</text>);
                                        }
                                        const startY = Math.floor(viewMin.y / step) * step;
                                        for (let y = startY; y <= viewMax.y; y += step) {
                                            const p = mathToScreen(0, y); const isAxis = Math.abs(y) < 1e-9;
                                            items.push(<line key={`h-${y}`} x1={0} y1={p.y} x2={GRID_SIZE} y2={p.y} stroke={colors.grid} strokeWidth={isAxis ? 2 : 0.5} opacity={isAxis ? 0.8 : 0.3} />);
                                            if (!isAxis) items.push(<text key={`h-val-${y}`} x={5} y={p.y - 2} fill={colors.foreground} fontSize="9" fontWeight="bold" opacity="0.6">{y.toFixed(y % 1 === 0 ? 0 : 1)}</text>);
                                        }
                                        const origin = mathToScreen(0, 0);
                                        if (origin.y > 0 && origin.y < GRID_SIZE) items.push(<text key="x-label" x={GRID_SIZE - 25} y={origin.y - 8} fill={colors.foreground} fontSize="12" fontWeight="black" opacity="0.4">X-AXIS</text>);
                                        if (origin.x > 0 && origin.x < GRID_SIZE) items.push(<text key="y-label" x={origin.x + 8} y={25} fill={colors.foreground} fontSize="12" fontWeight="black" opacity="0.4">Y-AXIS</text>);
                                        return items;
                                    })()}
                                </g>
                                {openLabs.map((id, idx) => {
                                    const baseId = id.replace(/[a-z]$/, '');
                                    const state = labStates[id];
                                    if(!state || !state.showCurve) return null;

                                    // Special Case: Traverse Lab (18)
                                    if (baseId === '18') {
                                        const pts: string[] = [];
                                        let curX = state.start.x;
                                        let curY = state.start.y;
                                        const startScreen = mathToScreen(curX, curY);
                                        pts.push(`${startScreen.x},${startScreen.y}`);
                                        
                                        state.legs.forEach((leg: any) => {
                                            const rad = (leg.direction * Math.PI) / 180;
                                            curX += leg.distance * Math.sin(rad); // Easting (X)
                                            curY += leg.distance * Math.cos(rad); // Northing (Y)
                                            const p = mathToScreen(curX, curY);
                                            pts.push(`${p.x},${p.y}`);
                                        });
                                        
                                        return <polyline key={id} points={pts.join(' ')} fill="none" stroke={slotColors[idx % slotColors.length]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
                                    }

                                    // Special Case: Star Polygon (21)
                                    if (baseId === '21') {
                                        const { p, q, radius } = state;
                                        const stepGcd = gcd(p, q);
                                        const orbitElements: React.ReactNode[] = [];
                                        
                                        for (let start = 0; start < stepGcd; start++) {
                                            let current = start;
                                            const loopPts: string[] = [];
                                            do {
                                                const ang = (2 * Math.PI * current) / p;
                                                const screen = mathToScreen(radius * Math.cos(ang), radius * Math.sin(ang));
                                                loopPts.push(`${screen.x},${screen.y}`);
                                                current = (current + q) % p;
                                            } while (current !== start);
                                            
                                            // Close the orbit
                                            const angStart = (2 * Math.PI * start) / p;
                                            const screenStart = mathToScreen(radius * Math.cos(angStart), radius * Math.sin(angStart));
                                            loopPts.push(`${screenStart.x},${screenStart.y}`);
                                            
                                            orbitElements.push(
                                                <polyline 
                                                    key={`${id}-orbit-${start}`} 
                                                    points={loopPts.join(' ')} 
                                                    fill="none" 
                                                    stroke={slotColors[idx % slotColors.length]} 
                                                    strokeWidth="3" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                            );
                                        }
                                        return <g key={id}>{orbitElements}</g>;
                                    }

                                    // Special Case: Point Plotter (43)
                                    if (baseId === '43') {
                                        const parsedPoints = state.points.trim().split('\n').map((line: string) => {
                                            const parts = line.split(/[,\s]+/);
                                            if (parts.length < 3) return null;
                                            return { name: parts[0], y: parseFloat(parts[1]), x: parseFloat(parts[2]) };
                                        }).filter((p: any) => p && !isNaN(p.x) && !isNaN(p.y));

                                        return (
                                            <g key={id}>
                                                {parsedPoints.map((p: any, pIdx: number) => {
                                                    const screen = mathToScreen(p.x, p.y);
                                                    return (
                                                        <g key={pIdx}>
                                                            <circle cx={screen.x} cy={screen.y} r="4" fill={slotColors[idx % slotColors.length]} />
                                                            <text x={screen.x + 6} y={screen.y - 6} fill={colors.foreground} fontSize="10" fontWeight="black" className="select-none">{p.name}</text>
                                                        </g>
                                                    );
                                                })}
                                            </g>
                                        );
                                    }

                                    // Special Case: Horizontal Curve (20)
                                    if (baseId === '20') {
                                        const { r, delta, pcx, pcy, bearing } = state;
                                        const deltaRad = (delta * Math.PI) / 180;
                                        const startAzRad = (bearing * Math.PI) / 180;
                                        const steps = 50;
                                        const curvePts: string[] = [];
                                        
                                        for(let i=0; i<=steps; i++) {
                                            const currentL = (i / steps) * (r * deltaRad);
                                            const currentDelta = currentL / r;
                                            const chord = 2 * r * Math.sin(currentDelta / 2);
                                            const chordAz = startAzRad + (currentDelta / 2);
                                            const x = pcx + chord * Math.sin(chordAz);
                                            const y = pcy + chord * Math.cos(chordAz);
                                            const screen = mathToScreen(x, y);
                                            curvePts.push(`${screen.x},${screen.y}`);
                                        }
                                        
                                        return <polyline key={id} points={curvePts.join(' ')} fill="none" stroke={slotColors[idx % slotColors.length]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
                                    }

                                    const lab = createLabObject(id, state);
                                    if(!lab) return null;
                                    const pts: string[] = [];
                                    if(lab.isParametric) {
                                        const tm = lab.getTMin(); const tM = lab.getTMax();
                                        for(let i=0; i<=300; i++){ const t=tm+(i/300)*(tM-tm); const px = lab.getX(t); const py = lab.getY(t); if(px !== null && py !== null){ const p=mathToScreen(px, py); pts.push(`${p.x},${p.y}`); } }
                                    } else {
                                        for(let i=0; i<=300; i++){ const x=viewMin.x+(i/300)*(viewMax.x-viewMin.x); const y=lab.getY(x); if(y!==null && isFinite(y)){ const p=mathToScreen(x, y); pts.push(`${p.x},${p.y}`); } }
                                    }
                                    return <polyline key={id} points={pts.join(' ')} fill="none" stroke={slotColors[idx % slotColors.length]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
                                })}
                                <ScaleBar pixelsPerUnit={pixelsPerUnit} foregroundColor={colors.foreground} />
                            </svg>
                            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                                <Button variant="secondary" size="icon" className="h-8 w-8 bg-slate-900/80 backdrop-blur border border-white/10" onClick={() => setViewport({zoom:1, offset:{x:0,y:0}})}><RotateCw className="h-4 w-4"/></Button>
                                <Button variant="secondary" size="icon" className="h-8 w-8 bg-slate-900/80 backdrop-blur border border-white/10" onClick={() => setViewport(v => ({...v, zoom: v.zoom*1.2}))}><Plus className="h-4 w-4"/></Button>
                                <Button variant="secondary" size="icon" className="h-8 w-8 bg-slate-900/80 backdrop-blur border border-white/10" onClick={() => setViewport(v => ({...v, zoom: v.zoom/1.2}))}><Minus className="h-4 w-4"/></Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-primary/10 bg-muted/5">
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0"><div className="space-y-1"><CardTitle className="text-[10px] uppercase font-black tracking-[0.2em] text-primary">Active Cloud Workspaces</CardTitle><CardDescription className="text-[9px] uppercase tracking-tighter">Persistent analysis states linked to your account.</CardDescription></div><FolderOpen className="h-4 w-4 text-muted-foreground" /></CardHeader>
                        <CardContent className="p-4 pt-0">
                            <ScrollArea className="h-32">
                                {isLoadingWorkspaces ? (<div className="flex items-center justify-center py-8"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/></div>) : savedWorkspaces && savedWorkspaces.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2">{savedWorkspaces.map((ws) => (<div key={ws.id} onClick={() => handleLoadWorkspace(ws)} className="group flex items-center justify-between p-2 rounded border border-primary/5 bg-background/50 hover:bg-primary/5 hover:border-primary/20 cursor-pointer transition-all"><div className="flex flex-col"><span className="text-[11px] font-black uppercase tracking-tight">{ws.name}</span><span className="text-[9px] text-muted-foreground uppercase">{ws.openLabs.length} Active Modules</span></div><Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10" onClick={(e) => handleDeleteWorkspace(e, ws.id)}><Trash2 className="h-3 w-3" /></Button></div>))}</div>
                                ) : (<div className="text-center py-8 border border-dashed border-primary/10 rounded-lg opacity-30 text-[10px] font-black uppercase tracking-widest">No Cloud Data</div>)}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InteractiveDemoClientPage;
