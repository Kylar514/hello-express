async function generateOnce() {
  await fetch("/log/once");
  viewLogs();
}

async function startLogging() {
  await fetch("/log/start");
  viewLogs();
}

async function stopLogging() {
  await fetch("/log/stop");
  viewLogs();
}

async function viewLogBox(url, elementId) {
  const res = await fetch(url);
  const textOrJson = await res.text(); // will parse JSON below if needed
  const logOutput = document.getElementById(elementId);

  const isAtBottom =
    logOutput.scrollHeight - logOutput.scrollTop <= logOutput.clientHeight + 10;

  let content = textOrJson;
  if (url.includes("/memory")) {
    content = JSON.parse(textOrJson).join("\n");
  }

  logOutput.innerText = content;

  if (isAtBottom) {
    logOutput.scrollTop = logOutput.scrollHeight;
  }
}

async function downloadJson() {
  window.location.href = "/log/download/json";
  viewLogs();
}

async function downloadLog() {
  window.location.href = "/log/download/log";
}

async function updateSizes() {
  try {
    const res = await fetch("/log/sizes");
    const sizes = await res.json();

    document.getElementById("fileSize").innerText = sizes.fileSize;
    document.getElementById("memorySize").innerText = sizes.memorySize;
  } catch (err) {
    console.error("Failed to update sizes:", err);
  }
}

setInterval(updateSizes, 1000);

updateSizes();

document.getElementById("clearFileBtn").addEventListener("click", async () => {
  await fetch("/log/file/clear", { method: "POST" });
  viewFileLogs();
  updateSizes();
});

document
  .getElementById("clearMemoryBtn")
  .addEventListener("click", async () => {
    await fetch("/log/memory/clear", { method: "POST" });
    viewMemoryLogs();
    updateSizes();
  });

setInterval(() => {
  viewLogBox("/log/view", "fileLogOutput");
  viewLogBox("/log/view", "memoryLogOutput");
  updateSizes();
}, 1000);

viewFileLogs();
viewMemoryLogs();
updateSizes();
