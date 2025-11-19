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

    // 1. Prepare Pattern & Segments
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

    // Parse & Extract Graph
    const polys = parsePolygons(SVG_PATH);
    const tileSegments = extractTraceSegments(polys);

    // 2. Resize & Build Global Graph
    let nodes: Point[] = [];
    let adjacency = new Map<number, number[]>(); // nodeIndex -> segmentIndices
    let graphSegments: (TraceSegment & {
      id: number;
      startNode: number;
      endNode: number;
    })[] = [];

    // Offscreen canvas for the full background pattern (optimization)
    let bgCanvas: HTMLCanvasElement | null = null;

    interface Signal {
      segmentId: number;
      previousSegmentId?: number; // Track previous to avoid immediate reversal
      progress: number; // 0 to 1
      direction: 1 | -1; // 1: p1->p2, -1: p2->p1
      speed: number; // normalized speed (1/length * px_per_frame)
      color: string;
      trail: Point[]; // History of points for bending trail
      life: number; // Lifespan in frames
    }

    const activeSignals: Signal[] = [];
    const colors = ['#00d4ff', '#7c3aed', '#ff9933']; // Cyan, Purple, Orange
    const BASE_SPEED_PX = 0.75;
    const SPAWN_RATE = 0.25; // Adjusted spawn rate
    const MAX_SIGNALS = 60;
    const TRAIL_LENGTH = 100; // significantly increased for longer tails
    const MAX_LIFE = 900; // ~10 seconds at 60fps

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // Rebuild background pattern canvas
      bgCanvas = document.createElement('canvas');
      bgCanvas.width = canvas.width;
      bgCanvas.height = canvas.height;
      const bgCtx = bgCanvas.getContext('2d');

      const cols = Math.ceil(canvas.width / patternSize);
      const rows = Math.ceil(canvas.height / patternSize);

      // Draw pattern to offscreen canvas once
      if (bgCtx && pCtx) {
        const pattern = bgCtx.createPattern(patternCanvas, 'repeat');
        if (pattern) {
          bgCtx.fillStyle = pattern;
          bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        }
      }

      // Clear graph
      nodes = [];
      adjacency.clear();
      graphSegments = [];
      activeSignals.splice(0, activeSignals.length);

      // Helper to get/create node
      const NODE_TOLERANCE = 10.0; // px - Increased further
      const getNodeIndex = (x: number, y: number) => {
        for (let i = 0; i < nodes.length; i++) {
          if (distSq(nodes[i], { x, y }) < NODE_TOLERANCE * NODE_TOLERANCE)
            return i;
        }
        nodes.push({ x, y });
        return nodes.length - 1;
      };

      let segIdCounter = 0;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const offsetX = i * patternSize;
          const offsetY = j * patternSize;

          // Add segments to graph
          tileSegments.forEach((seg) => {
            const p1 = { x: seg.p1.x + offsetX, y: seg.p1.y + offsetY };
            const p2 = { x: seg.p2.x + offsetX, y: seg.p2.y + offsetY };

            const n1 = getNodeIndex(p1.x, p1.y);
            const n2 = getNodeIndex(p2.x, p2.y);

            const gSeg = {
              ...seg,
              p1,
              p2,
              id: segIdCounter++,
              startNode: n1,
              endNode: n2,
            };

            graphSegments.push(gSeg);

            if (!adjacency.has(n1)) adjacency.set(n1, []);
            if (!adjacency.has(n2)) adjacency.set(n2, []);

            adjacency.get(n1)?.push(gSeg.id);
            adjacency.get(n2)?.push(gSeg.id);
          });
        }
      }

      // 3. Gap Bridging (Post-processing)
      // Fix disconnected corners by creating bridge segments between close dead-end nodes
      const BRIDGE_DIST = 15.0;
      const bridgeSq = BRIDGE_DIST * BRIDGE_DIST;

      // Single pass to create bridges
      const deadEnds = Array.from(adjacency.entries())
        .filter(([_, segs]) => segs.length === 1)
        .map(([n, _]) => n);

      for (const nodeIdx of deadEnds) {
        const nodePos = nodes[nodeIdx];
        const segId = adjacency.get(nodeIdx)?.[0];
        if (segId === undefined) continue;

        const seg = graphSegments[segId];

        // Determine vector pointing OUT of the node
        let dx = 0,
          dy = 0;
        if (nodeIdx === seg.startNode) {
          dx = seg.p1.x - seg.p2.x;
          dy = seg.p1.y - seg.p2.y;
        } else {
          dx = seg.p2.x - seg.p1.x;
          dy = seg.p2.y - seg.p1.y;
        }
        const len = Math.sqrt(dx * dx + dy * dy);
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
          // Check if already connected to avoid parallel bridges (which cause bouncing)
          const existingSegs = adjacency.get(nodeIdx);
          const targetSegs = adjacency.get(bestMatch);

          // Check if any segment in nodeIdx also exists in bestMatch
          const alreadyConnected = existingSegs?.some((id) =>
            targetSegs?.includes(id)
          );

          if (!alreadyConnected) {
            // Create Bridge Segment
            const p1 = nodes[nodeIdx];
            const p2 = nodes[bestMatch];
            const bridgeLen = Math.sqrt(minDist);

            const bridgeSeg = {
              p1,
              p2,
              length: bridgeLen,
              isHorizontal: Math.abs(p1.y - p2.y) < Math.abs(p1.x - p2.x),
              id: segIdCounter++,
              startNode: nodeIdx,
              endNode: bestMatch,
            };

            graphSegments.push(bridgeSeg);

            adjacency.get(nodeIdx)?.push(bridgeSeg.id);
            adjacency.get(bestMatch)?.push(bridgeSeg.id);
          }
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse Interaction
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

    // Animation Loop
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Static Background (Dim)
      if (bgCanvas) {
        ctx.globalAlpha = 0.1;
        ctx.drawImage(bgCanvas, 0, 0);
      }

      // 2. Draw Mouse Glow (Masked to Circuit)
      ctx.globalAlpha = 1.0;
      if (mouse.x > -100 && bgCanvas) {
        // Create a layer for the glow
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

        // Mask using the circuit pattern
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(bgCanvas, 0, 0);

        ctx.restore();
      }

      // 3. Draw Signals
      // Spawn Signals
      if (
        Math.random() < SPAWN_RATE &&
        graphSegments.length > 0 &&
        activeSignals.length < MAX_SIGNALS
      ) {
        const seg =
          graphSegments[Math.floor(Math.random() * graphSegments.length)];
        const direction = Math.random() > 0.5 ? 1 : -1;
        activeSignals.push({
          segmentId: seg.id,
          progress: direction === 1 ? 0 : 1,
          direction,
          speed: BASE_SPEED_PX / seg.length,
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: [],
          life: MAX_LIFE + Math.random() * 200,
        });
      }

      // Update and draw signals
      ctx.globalCompositeOperation = 'screen';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = activeSignals.length - 1; i >= 0; i--) {
        const s = activeSignals[i];
        const seg = graphSegments[s.segmentId];

        // Check life
        s.life--;
        if (s.life <= 0) {
          activeSignals.splice(i, 1);
          continue;
        }

        // Update progress
        s.progress += s.speed * s.direction;

        // Calculate current position
        const x = seg.p1.x + (seg.p2.x - seg.p1.x) * s.progress;
        const y = seg.p1.y + (seg.p2.y - seg.p1.y) * s.progress;

        // Add to trail
        s.trail.push({ x, y });
        if (s.trail.length > TRAIL_LENGTH) s.trail.shift();

        // Check for node arrival
        let arrivedAtNode = -1;
        if (s.direction === 1 && s.progress >= 1) arrivedAtNode = seg.endNode;
        else if (s.direction === -1 && s.progress <= 0)
          arrivedAtNode = seg.startNode;

        if (arrivedAtNode !== -1) {
          // Pick next segment
          const neighbors = adjacency.get(arrivedAtNode);

          if (neighbors) {
            // 1. Dead End Check (only connected to current segment)
            if (neighbors.length === 1 && neighbors[0] === seg.id) {
              // Signal reaches dead end: Die
              activeSignals.splice(i, 1);

              // Optional: Death effect (flash)
              ctx.fillStyle = s.color;
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, Math.PI * 2);
              ctx.fill();

              continue;
            }

            // 2. Junction Logic
            const candidates = neighbors.filter((id) => id !== seg.id);

            if (candidates.length > 0) {
              // Prefer not to return to previous segment if other options exist
              const nonReversing = candidates.filter(
                (id) => id !== s.previousSegmentId
              );
              const nextSegId =
                nonReversing.length > 0
                  ? nonReversing[
                      Math.floor(Math.random() * nonReversing.length)
                    ]
                  : candidates[Math.floor(Math.random() * candidates.length)];

              const nextSeg = graphSegments[nextSegId];

              s.previousSegmentId = s.segmentId;
              s.segmentId = nextSegId;

              // Determine direction on next segment
              if (nextSeg.startNode === arrivedAtNode) {
                s.direction = 1;
                s.progress = 0;
              } else {
                s.direction = -1;
                s.progress = 1;
              }

              s.speed = BASE_SPEED_PX / nextSeg.length;
              continue;
            }
          }

          // Fallback: orphan node or error
          activeSignals.splice(i, 1);
          continue;
        }

        // Draw Trail
        if (s.trail.length > 1) {
          const gradient = ctx.createLinearGradient(
            s.trail[0].x,
            s.trail[0].y,
            s.trail[s.trail.length - 1].x,
            s.trail[s.trail.length - 1].y
          );
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, s.color);

          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          for (let k = 1; k < s.trail.length; k++) {
            ctx.lineTo(s.trail[k].x, s.trail[k].y);
          }
          ctx.stroke();
        }

        // Draw Head
        // Optimized: Replaced shadowBlur with radial gradient for performance
        const glowRadius = 4;
        const headGradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          glowRadius
        );
        headGradient.addColorStop(0, '#ffffff');
        headGradient.addColorStop(0.4, s.color);
        headGradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      // Removed ctx.restore() because we removed the save/clip block for signals

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
