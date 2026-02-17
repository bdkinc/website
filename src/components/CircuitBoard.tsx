import { useEffect, useRef } from 'react';

interface CircuitBoardProps {
  className?: string;
}

const SVG_PATH =
  'M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V210h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';

// Types
type Point = { x: number; y: number };
interface TraceSegment {
  p1: Point;
  p2: Point;
  length: number;
  isHorizontal: boolean;
}

// Helpers
const distSq = (p1: Point, p2: Point) =>
  (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

// Parse SVG to Polygons
const parsePolygons = (pathStr: string): Point[][] => {
  const commands = pathStr.match(/([a-zA-Z])([^a-zA-Z]*)/g);
  if (!commands) return [];

  const polys: Point[][] = [];
  let cursor = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  let currentPoly: Point[] = [];

  const finishPoly = () => {
    if (currentPoly.length > 0) {
      polys.push([...currentPoly]);
      currentPoly = [];
    }
  };

  commands.forEach((cmdStr) => {
    const type = cmdStr[0];
    const args = cmdStr
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);

    const addPoint = () => currentPoly.push({ ...cursor });

    switch (type) {
      case 'M':
        finishPoly();
        cursor = { x: args[0], y: args[1] };
        start = { ...cursor };
        addPoint();
        break;
      case 'm':
        finishPoly();
        cursor.x += args[0];
        cursor.y += args[1];
        start = { ...cursor };
        addPoint();
        break;
      case 'L':
        cursor = { x: args[0], y: args[1] };
        addPoint();
        break;
      case 'l':
        cursor.x += args[0];
        cursor.y += args[1];
        addPoint();
        break;
      case 'H':
        cursor.x = args[0];
        addPoint();
        break;
      case 'h':
        cursor.x += args[0];
        addPoint();
        break;
      case 'V':
        cursor.y = args[0];
        addPoint();
        break;
      case 'v':
        cursor.y += args[0];
        addPoint();
        break;
      case 'Z':
      case 'z':
        cursor = { ...start };
        finishPoly();
        break;
      case 'A': // rx ry rot large sweep x y
        cursor = { x: args[5], y: args[6] };
        addPoint();
        break;
      case 'a': // rx ry rot large sweep dx dy
        cursor.x += args[5];
        cursor.y += args[6];
        addPoint();
        break;
    }
  });
  finishPoly();
  return polys;
};

// Extract Centerlines from Polygons
const extractTraceSegments = (polys: Point[][]): TraceSegment[] => {
  const segments: TraceSegment[] = [];
  const THRESHOLD = 6; // Minimum length to be considered a trace edge
  const PAIR_DIST = 3.5; // Max distance between parallel edges to be considered a pair

  polys.forEach((poly) => {
    const edges: { p1: Point; p2: Point; len: number; angle: number }[] = [];
    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > THRESHOLD) {
        edges.push({ p1, p2, len, angle: Math.atan2(dy, dx) });
      }
    }

    const used = new Set<number>();

    for (let i = 0; i < edges.length; i++) {
      if (used.has(i)) continue;
      const e1 = edges[i];

      for (let j = i + 1; j < edges.length; j++) {
        if (used.has(j)) continue;
        const e2 = edges[j];

        // Check if parallel (angle diff approx PI)
        let angleDiff = Math.abs(e1.angle - e2.angle);
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
        if (Math.abs(angleDiff - Math.PI) > 0.2) continue;

        // Check distance
        const mid1 = { x: (e1.p1.x + e1.p2.x) / 2, y: (e1.p1.y + e1.p2.y) / 2 };
        const dx = e2.p2.x - e2.p1.x;
        const dy = e2.p2.y - e2.p1.y;
        const cross = Math.abs(
          dy * mid1.x - dx * mid1.y + e2.p2.x * e2.p1.y - e2.p2.y * e2.p1.x
        );
        const dist = cross / e2.len;

        if (dist > PAIR_DIST) continue;

        // Found pair
        const start = {
          x: (e1.p1.x + e2.p2.x) / 2,
          y: (e1.p1.y + e2.p2.y) / 2,
        };
        const end = { x: (e1.p2.x + e2.p1.x) / 2, y: (e1.p2.y + e2.p1.y) / 2 };

        const segLen = Math.sqrt(
          (end.x - start.x) ** 2 + (end.y - start.y) ** 2
        );
        const isHoriz = Math.abs(start.y - end.y) < Math.abs(start.x - end.x);

        segments.push({
          p1: start,
          p2: end,
          length: segLen,
          isHorizontal: isHoriz,
        });

        used.add(i);
        used.add(j);
        break;
      }
    }
  });

  return segments;
};

interface GraphSegment extends TraceSegment {
  id: number;
  startNode: number;
  endNode: number;
}

interface Signal {
  segmentId: number;
  previousSegmentId?: number;
  progress: number;
  direction: 1 | -1;
  speed: number;
  color: string;
  life: number;
  age: number;
  trailBuffer: Float32Array;
  trailIndex: number;
  trailSize: number;
  trailGradient: CanvasGradient | null;
  gradientStart: Point | null;
  gradientEnd: Point | null;
}

const POLYGONS = parsePolygons(SVG_PATH);
const TILE_SEGMENTS = extractTraceSegments(POLYGONS);

export default function CircuitBoard({ className }: CircuitBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const patternSize = 304;
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const pCtx = patternCanvas.getContext('2d');

    if (pCtx) {
      const path = new Path2D(SVG_PATH);
      pCtx.fillStyle = '#00d4ff';
      pCtx.fill(path);
    }

    const headSprites = new Map<string, HTMLCanvasElement>();
    const trailPool: Float32Array[] = [];

    const colors = ['#00d4ff', '#7c3aed', '#ff9933'];
    const BASE_SPEED_PX = 1.0;
    const SPAWN_RATE = 0.25;
    const MAX_SIGNALS = 30;
    const MAX_LIFE = 900;
    const TRAIL_POINTS = 120;
    const TRAIL_BUFFER_SIZE = TRAIL_POINTS * 2;
    const HEAD_SIZE = 12;
    const HEAD_RADIUS = HEAD_SIZE / 2;
    const FADE_IN_FRAMES = 30;
    const FADE_OUT_FRAMES = 90;

    let nodes: Point[] = [];
    let adjacency = new Map<number, number[]>();
    let graphSegments: GraphSegment[] = [];
    let segmentLookup = new Map<number, GraphSegment>();
    let bgCanvas: HTMLCanvasElement | null = null;

    const activeSignals: Signal[] = [];

    const allocateTrailBuffer = () =>
      trailPool.pop() ?? new Float32Array(TRAIL_BUFFER_SIZE);

    const releaseTrailBuffer = (buffer: Float32Array) => {
      trailPool.push(buffer);
    };

    const releaseAllSignals = () => {
      while (activeSignals.length) {
        const signal = activeSignals.pop()!;
        signal.trailGradient = null;
        signal.gradientStart = null;
        signal.gradientEnd = null;
        releaseTrailBuffer(signal.trailBuffer);
      }
    };

    const disposeSignalAt = (index: number) => {
      const [removed] = activeSignals.splice(index, 1);
      if (removed) {
        removed.trailGradient = null;
        removed.gradientStart = null;
        removed.gradientEnd = null;
        releaseTrailBuffer(removed.trailBuffer);
      }
    };

    const appendTrailPoint = (signal: Signal, x: number, y: number) => {
      const base = signal.trailIndex * 2;
      signal.trailBuffer[base] = x;
      signal.trailBuffer[base + 1] = y;
      signal.trailIndex = (signal.trailIndex + 1) % TRAIL_POINTS;
      if (signal.trailSize < TRAIL_POINTS) {
        signal.trailSize += 1;
      }
    };

    const ensureTrailGradient = (
      signal: Signal,
      startX: number,
      startY: number,
      endX: number,
      endY: number
    ) => {
      signal.gradientStart = { x: startX, y: startY };
      signal.gradientEnd = { x: endX, y: endY };
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, signal.color);
      signal.trailGradient = gradient;
      return gradient;
    };

    const getSignalOpacity = (signal: Signal) => {
      const fadeIn = Math.min(1, signal.age / FADE_IN_FRAMES);
      const fadeOut = Math.min(1, signal.life / FADE_OUT_FRAMES);
      return Math.max(0, Math.min(fadeIn, fadeOut));
    };

    const getHeadSprite = (color: string) => {
      let sprite = headSprites.get(color);
      if (!sprite) {
        sprite = document.createElement('canvas');
        sprite.width = HEAD_SIZE;
        sprite.height = HEAD_SIZE;
        const spriteCtx = sprite.getContext('2d');
        if (spriteCtx) {
          const gradient = spriteCtx.createRadialGradient(
            HEAD_RADIUS,
            HEAD_RADIUS,
            0,
            HEAD_RADIUS,
            HEAD_RADIUS,
            HEAD_RADIUS
          );
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.4, color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          spriteCtx.fillStyle = gradient;
          spriteCtx.fillRect(0, 0, HEAD_SIZE, HEAD_SIZE);
        }
        headSprites.set(color, sprite);
      }
      return sprite;
    };

    const spawnSignal = () => {
      if (!graphSegments.length) return;
      const seg =
        graphSegments[Math.floor(Math.random() * graphSegments.length)];
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      activeSignals.push({
        segmentId: seg.id,
        progress: direction === 1 ? 0 : 1,
        direction,
        speed: BASE_SPEED_PX / Math.max(seg.length, 0.001),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: MAX_LIFE + Math.random() * 200,
        age: 0,
        trailBuffer: allocateTrailBuffer(),
        trailIndex: 0,
        trailSize: 0,
        trailGradient: null,
        gradientStart: null,
        gradientEnd: null,
      });
    };

    const rebuildScene = (width: number, height: number) => {
      const nextWidth = Math.max(1, Math.round(width));
      const nextHeight = Math.max(1, Math.round(height));

      canvas.width = nextWidth;
      canvas.height = nextHeight;

      bgCanvas = document.createElement('canvas');
      bgCanvas.width = nextWidth;
      bgCanvas.height = nextHeight;
      const bgCtx = bgCanvas.getContext('2d');

      if (bgCtx && pCtx) {
        const pattern = bgCtx.createPattern(patternCanvas, 'repeat');
        if (pattern) {
          bgCtx.fillStyle = pattern;
          bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        }
      }

      nodes = [];
      adjacency = new Map();
      graphSegments = [];
      segmentLookup = new Map();
      releaseAllSignals();

      const NODE_TOLERANCE = 10;
      const toleranceSq = NODE_TOLERANCE * NODE_TOLERANCE;
      const getNodeIndex = (x: number, y: number) => {
        for (let i = 0; i < nodes.length; i++) {
          if (distSq(nodes[i], { x, y }) < toleranceSq) return i;
        }
        nodes.push({ x, y });
        return nodes.length - 1;
      };

      const cols = Math.ceil(nextWidth / patternSize);
      const rows = Math.ceil(nextHeight / patternSize);
      let segIdCounter = 0;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const offsetX = i * patternSize;
          const offsetY = j * patternSize;

          TILE_SEGMENTS.forEach((seg) => {
            const p1 = { x: seg.p1.x + offsetX, y: seg.p1.y + offsetY };
            const p2 = { x: seg.p2.x + offsetX, y: seg.p2.y + offsetY };

            const n1 = getNodeIndex(p1.x, p1.y);
            const n2 = getNodeIndex(p2.x, p2.y);

            const gSeg: GraphSegment = {
              ...seg,
              p1,
              p2,
              id: segIdCounter++,
              startNode: n1,
              endNode: n2,
            };

            graphSegments.push(gSeg);
            segmentLookup.set(gSeg.id, gSeg);

            if (!adjacency.has(n1)) adjacency.set(n1, []);
            if (!adjacency.has(n2)) adjacency.set(n2, []);

            adjacency.get(n1)?.push(gSeg.id);
            adjacency.get(n2)?.push(gSeg.id);
          });
        }
      }

      const BRIDGE_DIST = 15;
      const bridgeSq = BRIDGE_DIST * BRIDGE_DIST;

      const deadEnds = Array.from(adjacency.entries())
        .filter(([, segs]) => segs.length === 1)
        .map(([n]) => n);

      for (const nodeIdx of deadEnds) {
        const nodePos = nodes[nodeIdx];
        const segId = adjacency.get(nodeIdx)?.[0];
        if (segId === undefined) continue;

        const seg = segmentLookup.get(segId);
        if (!seg) continue;

        let dx = 0;
        let dy = 0;
        if (nodeIdx === seg.startNode) {
          dx = seg.p1.x - seg.p2.x;
          dy = seg.p1.y - seg.p2.y;
        } else {
          dx = seg.p2.x - seg.p1.x;
          dy = seg.p2.y - seg.p1.y;
        }
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        dx /= len;
        dy /= len;

        let bestMatch = -1;
        let minDist = bridgeSq;

        for (let i = 0; i < nodes.length; i++) {
          if (i === nodeIdx) continue;
          if (!adjacency.has(i)) continue;

          const tx = nodes[i].x - nodePos.x;
          const ty = nodes[i].y - nodePos.y;
          const d = tx * tx + ty * ty;

          if (d < minDist) {
            minDist = d;
            bestMatch = i;
          }
        }

        if (bestMatch !== -1) {
          const existingSegs = adjacency.get(nodeIdx);
          const targetSegs = adjacency.get(bestMatch);
          const alreadyConnected = existingSegs?.some((id) =>
            targetSegs?.includes(id)
          );

          if (!alreadyConnected) {
            const p1 = nodes[nodeIdx];
            const p2 = nodes[bestMatch];
            const bridgeLen = Math.sqrt(minDist);

            const bridgeSeg: GraphSegment = {
              p1,
              p2,
              length: bridgeLen,
              isHorizontal: Math.abs(p1.y - p2.y) < Math.abs(p1.x - p2.x),
              id: segIdCounter++,
              startNode: nodeIdx,
              endNode: bestMatch,
            };

            graphSegments.push(bridgeSeg);
            segmentLookup.set(bridgeSeg.id, bridgeSeg);

            adjacency.get(nodeIdx)?.push(bridgeSeg.id);
            adjacency.get(bestMatch)?.push(bridgeSeg.id);
          }
        }
      }
    };

    let pendingWidth = container.clientWidth;
    let pendingHeight = container.clientHeight;
    let resizeRaf: number | null = null;

    const scheduleResize = (width: number, height: number) => {
      const roundedWidth = Math.max(1, Math.round(width));
      const roundedHeight = Math.max(1, Math.round(height));
      if (
        roundedWidth === pendingWidth &&
        roundedHeight === pendingHeight &&
        graphSegments.length
      ) {
        return;
      }
      pendingWidth = roundedWidth;
      pendingHeight = roundedHeight;
      if (resizeRaf !== null) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        rebuildScene(pendingWidth, pendingHeight);
      });
    };

    rebuildScene(pendingWidth, pendingHeight);

    let resizeObserver: ResizeObserver | null = null;
    let resizeListener: (() => void) | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === container) {
            scheduleResize(entry.contentRect.width, entry.contentRect.height);
          }
        });
      });
      resizeObserver.observe(container);
    } else {
      resizeListener = () => {
        scheduleResize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', resizeListener);
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let isIntersecting = true;
    let isDocumentHidden = document.hidden;
    let animationId: number | null = null;

    const renderFrame = () => {
      if (!isIntersecting || isDocumentHidden) {
        animationId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (bgCanvas) {
        ctx.globalAlpha = 0.1;
        ctx.drawImage(bgCanvas, 0, 0);
      }

      ctx.globalAlpha = 1;
      if (mouse.x > -100 && bgCanvas) {
        ctx.save();

        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          300
        );
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(bgCanvas, 0, 0);

        ctx.restore();
      }

      if (
        Math.random() < SPAWN_RATE &&
        activeSignals.length < MAX_SIGNALS &&
        graphSegments.length
      ) {
        spawnSignal();
      }

      ctx.globalCompositeOperation = 'screen';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = activeSignals.length - 1; i >= 0; i--) {
        const signal = activeSignals[i];
        const seg = segmentLookup.get(signal.segmentId);
        if (!seg) {
          disposeSignalAt(i);
          continue;
        }

        signal.life -= 1;
        signal.age += 1;
        const opacity = getSignalOpacity(signal);
        if (signal.life <= 0 || opacity <= 0) {
          disposeSignalAt(i);
          continue;
        }

        signal.progress += signal.speed * signal.direction;

        const x = seg.p1.x + (seg.p2.x - seg.p1.x) * signal.progress;
        const y = seg.p1.y + (seg.p2.y - seg.p1.y) * signal.progress;

        appendTrailPoint(signal, x, y);

        let arrivedAtNode = -1;
        if (signal.direction === 1 && signal.progress >= 1) {
          arrivedAtNode = seg.endNode;
        } else if (signal.direction === -1 && signal.progress <= 0) {
          arrivedAtNode = seg.startNode;
        }

        if (arrivedAtNode !== -1) {
          const neighbors = adjacency.get(arrivedAtNode);

          if (neighbors) {
            if (neighbors.length === 1 && neighbors[0] === seg.id) {
              ctx.globalAlpha = opacity;
              ctx.fillStyle = signal.color;
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;
              disposeSignalAt(i);
              continue;
            }

            const candidates = neighbors.filter((id) => id !== seg.id);
            if (candidates.length > 0) {
              const nonReversing = candidates.filter(
                (id) => id !== signal.previousSegmentId
              );
              const pool = nonReversing.length > 0 ? nonReversing : candidates;
              const nextSegId = pool[Math.floor(Math.random() * pool.length)];
              const nextSeg = segmentLookup.get(nextSegId);

              if (!nextSeg) {
                disposeSignalAt(i);
                continue;
              }

              signal.previousSegmentId = signal.segmentId;
              signal.segmentId = nextSegId;

              if (nextSeg.startNode === arrivedAtNode) {
                signal.direction = 1;
                signal.progress = 0;
              } else {
                signal.direction = -1;
                signal.progress = 1;
              }

              signal.speed = BASE_SPEED_PX / Math.max(nextSeg.length, 0.001);
              continue;
            }
          }

          disposeSignalAt(i);
          continue;
        }

        if (signal.trailSize > 1) {
          const oldestIdx =
            (signal.trailIndex - signal.trailSize + TRAIL_POINTS) %
            TRAIL_POINTS;
          const startBase = oldestIdx * 2;
          const startX = signal.trailBuffer[startBase];
          const startY = signal.trailBuffer[startBase + 1];
          const gradient = ensureTrailGradient(signal, startX, startY, x, y);

          ctx.save();
          ctx.strokeStyle = gradient;
          ctx.globalAlpha = opacity * 0.85;
          ctx.beginPath();
          for (let k = 0; k < signal.trailSize; k++) {
            const idx =
              (signal.trailIndex - signal.trailSize + k + TRAIL_POINTS) %
              TRAIL_POINTS;
            const base = idx * 2;
            const tx = signal.trailBuffer[base];
            const ty = signal.trailBuffer[base + 1];
            if (k === 0) ctx.moveTo(tx, ty);
            else ctx.lineTo(tx, ty);
          }
          ctx.stroke();
          ctx.restore();
        }

        const sprite = getHeadSprite(signal.color);
        ctx.globalAlpha = opacity;
        ctx.drawImage(sprite, x - HEAD_RADIUS, y - HEAD_RADIUS);
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = 'source-over';

      animationId = requestAnimationFrame(renderFrame);
    };

    const updateAnimationState = () => {
      const shouldRun = isIntersecting && !isDocumentHidden;
      if (!shouldRun) {
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        return;
      }

      if (animationId === null) {
        animationId = requestAnimationFrame(renderFrame);
      }
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === container) {
            isIntersecting = entry.isIntersecting;
          }
        });
        updateAnimationState();
      },
      { threshold: 0.1 }
    );

    visibilityObserver.observe(container);

    const handleVisibilityChange = () => {
      isDocumentHidden = document.hidden;
      updateAnimationState();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    updateAnimationState();

    return () => {
      resizeObserver?.disconnect();
      if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
      }
      if (resizeRaf !== null) {
        cancelAnimationFrame(resizeRaf);
      }
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      releaseAllSignals();
      headSprites.clear();
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
