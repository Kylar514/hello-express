const express = require("express");
const fs = require("fs");
const path = require("path");
const memoryLogs = [];

const app = express();
const configPath = path.resolve(__dirname, "config.json");

app.use(express.static(path.join(__dirname, "public")));

let caseCounter = 198723;
let loggingInterval = null;

let config;
try {
  const rawConfig = fs.readFileSync(configPath, "utf8");
  config = JSON.parse(rawConfig);
  console.log("Loaded configuration", config);
} catch (err) {
  console.error("Error loading config.json", err);
  process.exit(1);
}

function nextCaseNumber() {
  const num = caseCounter;
  caseCounter++;
  return `Case: ${num}`;
}

function randomMessage() {
  const msgs = config.messages;
  const index = Math.floor(Math.random() * msgs.length);
  return msgs[index];
}

function generateLogLine() {
  const timestamp = new Date().toISOString();
  const message = randomMessage();
  const caseNum = nextCaseNumber();
  const logLine = `${caseNum} | ${timestamp} | Message:${message}`;
  return logLine;
}

function writeLogLine() {
  const line = generateLogLine();
  const logDir = path.dirname(config.logPath);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(config.logPath, line + "\n");
  memoryLogs.push(line);
  if (memoryLogs.length > config.maxMemory) memoryLogs.shift();
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

app.get("/", (req, res) => {
  const logLine = generateLogLine();
  res.send(`<pre>${logLine}</pre>`);
});

app.get("/log/once", (req, res) => {
  writeLogLine();
  res.send("One log line written!");
});

app.get("/log/start", (req, res) => {
  if (!loggingInterval) {
    loggingInterval = setInterval(writeLogLine, config.logInterval);
  } else {
    res.send("Logging already running.");
  }
});

app.get("/log/stop", (req, res) => {
  if (loggingInterval) {
    clearInterval(loggingInterval);
    loggingInterval = null;
  } else {
    res.send("Logging was not running.");
  }
});

app.get("/log/view", (req, res) => {
  try {
    const content = fs.readFileSync(config.logPath, "utf8");
    res.send(`${content}`);
  } catch (err) {
    res.status(500).send("Failed to read log file.");
  }
});

app.get("/log/memory", (req, res) => {
  try {
    res.json(memoryLogs);
  } catch (err) {
    res.status(500).send("Failed to read memory.");
  }
});

app.get("/log/download/json", (req, res) => {
  try {
    const data = fs.readFileSync(config.logPath, "utf8");
    const lines = data.split("\n").filter(Boolean);
    const json = lines.map((line) => ({ line }));
    res.setHeader("Content-Disposition", "attachment; filename=log.json");
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(json, null, 2));
  } catch (err) {
    res.status(500).send("Error reading log file");
  }
});

app.get("/log/download/log", (req, res) => {
  try {
    res.setHeader("Content-Disposition", "attatchment; filename=log.txt");
    res.setHeader("Content-Type", "text/plain");
    const stream = fs.createReadStream(config.logPath);
    stream.pipe(res);
  } catch (err) {
    res.status(500).send("Error reading log file");
  }
});

app.post("/log/file/clear", (req, res) => {
  if (fs.existsSync(config.logPath)) fs.writeFileSync(config.logPath, "");
  res.sendStatus(200);
});

app.post("/log/memory/clear", (req, res) => {
  memoryLogs.length = 0;
  res.sendStatus(200);
});

app.get("/log/sizes", (req, res) => {
  const fileSizeBytes = fs.existsSync(config.logPath)
    ? fs.statSync(config.logPath).size
    : 0;
  const memorySizeBytes = memoryLogs.join("\n").length;
  res.json({
    fileSize: formatBytes(fileSizeBytes),
    memorySize: formatBytes(memorySizeBytes),
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
