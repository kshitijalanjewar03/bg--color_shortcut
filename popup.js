const COLORS = [
  { name: "Red", hex: "#e74c3c" },
  { name: "Blue", hex: "#3498db" },
  { name: "Green", hex: "#2ecc71" },
  { name: "Yellow", hex: "#f1c40f" },
  { name: "Pink", hex: "#ff69b4" },
  { name: "Purple", hex: "#9b59b6" },
  { name: "Orange", hex: "#e67e22" },
  { name: "Brown", hex: "#8b4513" },
  { name: "Gray", hex: "#95a5a6" },
  { name: "Black", hex: "#111111" }
];

const grid = document.getElementById("grid");

function isDark(hex) {
  if (!hex) return false;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const lum = 0.2126*r + 0.7152*g + 0.0722*b;
  return lum < 140;
}

function sendColorToActiveTab(color) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, { type: "setColor", color }, () => {
      highlightCurrent(color);
    });
  });
}

// build buttons
COLORS.forEach((c, idx) => {
  const btn = document.createElement("button");
  btn.className = "color-btn";
  btn.style.background = c.hex;
  btn.style.color = isDark(c.hex) ? "#fff" : "#000";
  btn.textContent = `${c.name} (Ctrl+Shift+${idx<4? idx+1 : '-'})`;
  btn.setAttribute("aria-label", `${c.name} color`);
  btn.addEventListener("click", () => sendColorToActiveTab(c.hex));
  grid.appendChild(btn);
});

// reset
document.getElementById("reset").addEventListener("click", () => sendColorToActiveTab(""));

// highlight currently stored color
function highlightCurrent(color) {
  const buttons = grid.querySelectorAll(".color-btn");
  buttons.forEach(b => {
    b.style.outline = (b.style.background === color) ? "3px solid #000000" : "none";
  });
}

chrome.storage.sync.get(["bgColor"], (res) => {
  highlightCurrent(res.bgColor || "");
});
