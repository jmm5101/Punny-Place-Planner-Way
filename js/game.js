// Punny Place Planner Way - core game logic

const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const nameModal = document.getElementById("name-modal");
const signModal = document.getElementById("sign-modal");
const streetNameInput = document.getElementById("street-name");
const streetTypeSelect = document.getElementById("street-type");
const streetSignEl = document.getElementById("street-sign");

let currentLevel = 1;
let levelData = null;
let selectedEdge = null;
let selectedNode = null;
let currentSignNames = []; // ordered list of display names for the sign

// Populate type dropdown
STREET_TYPES.forEach(t => {
  const opt = document.createElement("option");
  opt.value = t.abbr;
  opt.textContent = `${t.full} (${t.abbr})`;
  streetTypeSelect.appendChild(opt);
});

// ---------- Helpers ----------
function getNode(id) {
  return levelData.nodes.find(n => n.id === id);
}

function getEdgesAtNode(nodeId) {
  return levelData.edges.filter(e => e.a === nodeId || e.b === nodeId);
}

function distPointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

function formatStreet(edge) {
  if (!edge.name) return null;
  const type = STREET_TYPES.find(t => t.abbr === edge.type);
  const abbr = type ? type.abbr : (edge.type || "");
  return `${edge.name.toUpperCase()} ${abbr}`;
}

// ---------- Drawing ----------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background grid (subtle pixel feel)
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#161b22";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Edges
  levelData.edges.forEach(edge => {
    const na = getNode(edge.a);
    const nb = getNode(edge.b);
    if (!na || !nb) return;

    const isNamed = !!edge.name;
    const isSelected = selectedEdge && selectedEdge.id === edge.id;

    ctx.beginPath();
    ctx.moveTo(na.x, na.y);
    ctx.lineTo(nb.x, nb.y);

    if (isSelected) {
      ctx.strokeStyle = "#7eb8da";
      ctx.lineWidth = 10;
    } else if (isNamed) {
      ctx.strokeStyle = "#4a7c59";
      ctx.lineWidth = 8;
    } else {
      ctx.strokeStyle = "#3a3f5c";
      ctx.lineWidth = 7;
    }
    ctx.lineCap = "square";
    ctx.stroke();

    // Small center mark for clickability
    if (!isNamed) {
      const mx = (na.x + nb.x) / 2;
      const my = (na.y + nb.y) / 2;
      ctx.fillStyle = "#555";
      ctx.fillRect(mx - 3, my - 3, 6, 6);
    }
  });

  // Nodes
  levelData.nodes.forEach(node => {
    const edgesHere = getEdgesAtNode(node.id);
    const hasNames = edgesHere.some(e => e.name);
    const isSelected = selectedNode && selectedNode.id === node.id;

    ctx.beginPath();
    ctx.arc(node.x, node.y, isSelected ? 9 : 7, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? "#7eb8da" : (hasNames ? "#c9a227" : "#8b949e");
    ctx.fill();
    ctx.strokeStyle = "#0f0f0f";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Level label
  ctx.fillStyle = "#8b949e";
  ctx.font = "600 14px Overpass, sans-serif";
  ctx.fillText(`Level ${levelData.id}: ${levelData.name}  ·  ${levelData.nodes.length} nodes`, 12, 22);
}

// ---------- Interaction ----------
function canvasToWorld(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("click", (e) => {
  const { x, y } = canvasToWorld(e);

  // First check nodes (priority)
  let closestNode = null;
  let minNodeDist = 14;
  levelData.nodes.forEach(n => {
    const d = Math.hypot(n.x - x, n.y - y);
    if (d < minNodeDist) {
      minNodeDist = d;
      closestNode = n;
    }
  });

  if (closestNode) {
    selectedNode = closestNode;
    selectedEdge = null;
    showSign(closestNode);
    draw();
    return;
  }

  // Then edges
  let closestEdge = null;
  let minEdgeDist = 12;
  levelData.edges.forEach(edge => {
    const na = getNode(edge.a);
    const nb = getNode(edge.b);
    const d = distPointToSegment(x, y, na.x, na.y, nb.x, nb.y);
    if (d < minEdgeDist) {
      minEdgeDist = d;
      closestEdge = edge;
    }
  });

  if (closestEdge) {
    selectedEdge = closestEdge;
    selectedNode = null;
    openNameModal(closestEdge);
    draw();
    return;
  }

  // Clicked empty space
  selectedEdge = null;
  selectedNode = null;
  statusEl.textContent = "Select a street or intersection";
  draw();
});

// ---------- Naming ----------
function openNameModal(edge) {
  streetNameInput.value = edge.name || "";
  streetTypeSelect.value = edge.type || "ST";
  nameModal.classList.remove("hidden");
  streetNameInput.focus();
  statusEl.textContent = `Editing segment ${edge.id}`;
}

document.getElementById("save-name").addEventListener("click", () => {
  if (!selectedEdge) return;
  const name = streetNameInput.value.trim();
  if (!name) {
    alert("Please enter a street name");
    return;
  }
  selectedEdge.name = name;
  selectedEdge.type = streetTypeSelect.value;
  nameModal.classList.add("hidden");
  statusEl.textContent = `Named: ${formatStreet(selectedEdge)}`;
  selectedEdge = null;
  draw();
});

document.getElementById("cancel-name").addEventListener("click", () => {
  nameModal.classList.add("hidden");
  selectedEdge = null;
  draw();
});

streetNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("save-name").click();
  if (e.key === "Escape") document.getElementById("cancel-name").click();
});

// ---------- Sign display ----------
function showSign(node) {
  const edges = getEdgesAtNode(node.id);
  const names = edges
    .map(e => formatStreet(e))
    .filter(Boolean);

  // Deduplicate while preserving order
  currentSignNames = [...new Set(names)];

  if (currentSignNames.length === 0) {
    statusEl.textContent = "No named streets meet at this intersection yet.";
    signModal.classList.add("hidden");
    return;
  }

  renderSign();
  signModal.classList.remove("hidden");
  statusEl.textContent = `Intersection ${node.id} · ${currentSignNames.length} street(s)`;
}

function renderSign() {
  streetSignEl.innerHTML = "";
  currentSignNames.forEach(n => {
    const line = document.createElement("div");
    line.className = "sign-line";
    line.textContent = n;
    streetSignEl.appendChild(line);
  });
  // Add a little pole for flavor
  const pole = document.createElement("div");
  pole.className = "sign-pole";
  streetSignEl.appendChild(pole);
}

document.getElementById("reverse-order").addEventListener("click", () => {
  currentSignNames.reverse();
  renderSign();
});

document.getElementById("close-sign").addEventListener("click", () => {
  signModal.classList.add("hidden");
  selectedNode = null;
  draw();
});

// ---------- Level switching & clear ----------
document.querySelectorAll("#level-select button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#level-select button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadLevel(parseInt(btn.dataset.level, 10));
  });
});

document.getElementById("clear-names").addEventListener("click", () => {
  if (!confirm("Clear all street names on this level?")) return;
  levelData.edges.forEach(e => {
    e.name = null;
    e.type = null;
  });
  selectedEdge = null;
  selectedNode = null;
  signModal.classList.add("hidden");
  statusEl.textContent = "All names cleared";
  draw();
});

function loadLevel(id) {
  // Deep-ish clone so names don't persist across reloads of the same level object
  const src = LEVELS[id];
  levelData = {
    id: src.id,
    name: src.name,
    nodes: src.nodes.map(n => ({ ...n })),
    edges: src.edges.map(e => ({ ...e, name: null, type: null }))
  };
  currentLevel = id;
  selectedEdge = null;
  selectedNode = null;
  nameModal.classList.add("hidden");
  signModal.classList.add("hidden");
  statusEl.textContent = `Loaded Level ${id}: ${levelData.name}`;
  draw();
}

// Start
loadLevel(1);