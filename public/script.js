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

async function viewLogs() {
  const res = await fetch("/log/view");
  const text = await res.text();
  document.getElementById("logOutput").innerText = text;
}

async function downloadJson() {
  window.location.href = "/log/download/json";
  viewLogs();
}

async function downloadLog() {
  window.location.href = "/log/download/log";
}

setInterval(viewLogs, 20);
