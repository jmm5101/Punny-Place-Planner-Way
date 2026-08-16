// Level data for Punny Place Planner Way
// Nodes: {id, x, y}
// Edges: {id, a, b, name: null, type: null}  (a/b are node ids)

const STREET_TYPES = [
  { full: "Alley", abbr: "ALY" },
  { full: "Avenue", abbr: "AVE" },
  { full: "Boulevard", abbr: "BLVD" },
  { full: "Circle", abbr: "CIR" },
  { full: "Court", abbr: "CT" },
  { full: "Drive", abbr: "DR" },
  { full: "Highway", abbr: "HWY" },
  { full: "Lane", abbr: "LN" },
  { full: "Parkway", abbr: "PKWY" },
  { full: "Place", abbr: "PL" },
  { full: "Road", abbr: "RD" },
  { full: "Street", abbr: "ST" },
  { full: "Terrace", abbr: "TER" },
  { full: "Trail", abbr: "TRL" },
  { full: "Way", abbr: "WAY" }
];

function makeEdge(id, a, b) {
  return { id, a, b, name: null, type: null };
}

// ---------- LEVEL 1: Cul-de-Sac (14 nodes) ----------
// Main highway across the bottom.
// Three roads branch north. Each has a mid-way T intersection
// that leads to a short side street ending in a cul-de-sac.
// The main branch also ends in a cul-de-sac.

const level1 = {
  id: 1,
  name: "Cul-de-Sac",
  nodes: [
    // Highway
    { id: "h1", x: 80,  y: 520 },
    { id: "h2", x: 220, y: 520 },
    { id: "h3", x: 380, y: 520 },
    { id: "h4", x: 540, y: 520 },
    { id: "h5", x: 700, y: 520 },
    // Branch A (from h2)
    { id: "a1", x: 220, y: 380 }, // mid T
    { id: "a2", x: 220, y: 220 }, // cul-de-sac end
    { id: "a3", x: 100, y: 380 }, // side cul-de-sac
    // Branch B (from h3)
    { id: "b1", x: 380, y: 380 },
    { id: "b2", x: 380, y: 200 },
    { id: "b3", x: 500, y: 380 },
    // Branch C (from h4)
    { id: "c1", x: 540, y: 380 },
    { id: "c2", x: 540, y: 240 },
    { id: "c3", x: 660, y: 380 }
  ],
  edges: [
    // Highway
    makeEdge("e-h1", "h1", "h2"),
    makeEdge("e-h2", "h2", "h3"),
    makeEdge("e-h3", "h3", "h4"),
    makeEdge("e-h4", "h4", "h5"),
    // Branch A
    makeEdge("e-a0", "h2", "a1"),
    makeEdge("e-a1", "a1", "a2"),
    makeEdge("e-a2", "a1", "a3"),
    // Branch B
    makeEdge("e-b0", "h3", "b1"),
    makeEdge("e-b1", "b1", "b2"),
    makeEdge("e-b2", "b1", "b3"),
    // Branch C
    makeEdge("e-c0", "h4", "c1"),
    makeEdge("e-c1", "c1", "c2"),
    makeEdge("e-c2", "c1", "c3")
  ]
};

// ---------- LEVEL 2: Suburban (exactly 30 nodes) ----------
// Irregular layout: longer streets that each pass through ~3 intersections,
// some loops, a few cul-de-sacs, and short connectors.

const level2 = {
  id: 2,
  name: "Suburban",
  nodes: [],
  edges: []
};

(function buildLevel2() {
  const nodes = [];
  const edges = [];
  let nid = 0;
  const add = (x, y) => {
    const id = "n" + (nid++);
    nodes.push({ id, x, y });
    return id;
  };

  // Bottom arterial (7)
  const r0 = [add(60,560), add(180,560), add(300,560), add(420,560), add(540,560), add(660,560), add(780,560)];
  // Mid lower (6)
  const r1 = [add(100,440), add(220,450), add(340,430), add(460,450), add(580,440), add(700,450)];
  // Mid (7)
  const r2 = [add(80,320), add(200,310), add(320,330), add(440,310), add(560,320), add(680,310), add(800,330)];
  // Upper (5)
  const r3 = [add(140,200), add(280,190), add(420,210), add(560,200), add(700,190)];
  // Top stubs / cul-de-sacs (3)
  const r4 = [add(220,90), add(420,80), add(620,95)];
  // Two extra nodes to reach exactly 30
  const extra1 = add(340,100);  // side spur from r3[1]
  const extra2 = add(500,100);  // side spur from r3[2]

  const link = (a, b) => edges.push(makeEdge("e" + edges.length, a, b));

  // Horizontal runs
  for (let i = 0; i < r0.length - 1; i++) link(r0[i], r0[i+1]);
  for (let i = 0; i < r1.length - 1; i++) link(r1[i], r1[i+1]);
  for (let i = 0; i < r2.length - 1; i++) link(r2[i], r2[i+1]);
  for (let i = 0; i < r3.length - 1; i++) link(r3[i], r3[i+1]);

  // Vertical connectors
  link(r0[1], r1[0]); link(r0[2], r1[1]); link(r0[3], r1[2]);
  link(r0[4], r1[3]); link(r0[5], r1[4]); link(r0[6], r1[5]);

  link(r1[0], r2[1]); link(r1[1], r2[2]); link(r1[2], r2[3]);
  link(r1[3], r2[4]); link(r1[4], r2[5]); link(r1[5], r2[6]);

  link(r2[1], r3[0]); link(r2[2], r3[1]); link(r2[3], r3[2]);
  link(r2[4], r3[3]); link(r2[5], r3[4]);

  // Cul-de-sac stubs
  link(r3[0], r4[0]);
  link(r3[2], r4[1]);
  link(r3[4], r4[2]);

  // Extra spurs
  link(r3[1], extra1);
  link(r3[2], extra2);

  // A couple extra cross links
  link(r2[0], r1[0]);
  link(r3[1], r2[2]);

  level2.nodes = nodes;
  level2.edges = edges;
})();

// ---------- LEVEL 3: 10x10 Urban Grid (100 nodes) ----------

const level3 = {
  id: 3,
  name: "Urban Grid",
  nodes: [],
  edges: []
};

(function buildLevel3() {
  const size = 10;
  const margin = 50;
  const stepX = (900 - margin * 2) / (size - 1);
  const stepY = (620 - margin * 2) / (size - 1);

  const nodes = [];
  const edges = [];
  const grid = [];

  for (let j = 0; j < size; j++) {
    grid[j] = [];
    for (let i = 0; i < size; i++) {
      const id = `g${i}_${j}`;
      const x = margin + i * stepX;
      const y = margin + j * stepY;
      nodes.push({ id, x, y });
      grid[j][i] = id;
    }
  }

  // Horizontal edges
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size - 1; i++) {
      edges.push(makeEdge(`h${i}_${j}`, grid[j][i], grid[j][i+1]));
    }
  }
  // Vertical edges
  for (let j = 0; j < size - 1; j++) {
    for (let i = 0; i < size; i++) {
      edges.push(makeEdge(`v${i}_${j}`, grid[j][i], grid[j+1][i]));
    }
  }

  level3.nodes = nodes;
  level3.edges = edges;
})();

const LEVELS = {
  1: level1,
  2: level2,
  3: level3
};