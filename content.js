function applyColor(color) {
  if (!color) {
    document.documentElement.style.background = "";
    document.body.style.background = "";
    return;
  }
  document.documentElement.style.background = color;
  document.body.style.background = color;
}

// On page load, apply stored color if any
chrome.storage.sync.get(["bgColor"], (res) => {
  const c = res.bgColor || "";
  applyColor(c);
});

// Receive messages from background or popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "setColor") {
    applyColor(msg.color);
    chrome.storage.sync.set({ bgColor: msg.color }, () => {
      if (sendResponse) sendResponse({ ok: true });
    });
    return true; // async response
  }
});
