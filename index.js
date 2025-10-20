const express = require("express");
const app = express();

function randomGibberish(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title> Gibberish Log Generator</title>
</head>
<body style="font-family: monospace; text-align: center; margin-top:3em;">
<h1>Gibberish Log Generator</h1>
<button id = "genBtn">Generate Log</button>
<pre id="output"></pre>

<script>
const btn = document.getElementById('genBtn');
const output = document.getElementById('output')

btn.addEventListener('click', async () => {
const res = await fetch('/generate');
const data = await res.text();
output.textContent = data;
});
</script>
</body>
</html>
`);
});

app.get("/generate", (req, res) => {
  const log = randomGibberish(20);
  console.log("[LOG]", log);
  res.send("Generated log: " + log);
});

// app.get("/", (req, res) => {
//   const log = randomGibberish(15);
//   console.log(`[LOG] ${log}`); res.send(`Gobberish log: ${log}`); });
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
