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

setInterval(viewLogs, 20);
