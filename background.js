chrome.commands.onCommand.addListener((command) => {

  const colors = {
    "color_red": "red",
    "color_blue": "blue",
    "color_green": "green",
    "color_yellow": "yellow"
  };

  let color = colors[command];
  if (!color) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (bg) => { document.body.style.backgroundColor = bg; },
      args: [color]
    });
  });

});
