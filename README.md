# Gibberish Logger

A Node.js + Express.js application that generates configurable, random log
entries for testing or demonstration purposes.

---

## Overview

Gibberish Logger is a lightweight service that outputs structured, randomized
log entries to both stdout and a file.  
It can be configured via a JSON file and controlled through an API.  
The application is designed to be OS-agnostic, working on Windows, macOS, and
Linux.

---

## Features

### Configuration

- Uses a `config.json` file for runtime settings.
- Supports the following options:
  - `logInterval`: Interval (in milliseconds) between automatic log entries.
  - `logPath`: File path where logs are saved.
  - `logLength`: Optional length for generated gibberish when no messages are
    defined.
  - `messages`: A list of custom messages or memes to include randomly in log
    entries.

---

### Log Format

Each log entry contains:

- Timestamp (system date/time in ISO format)
- Random case number
- Random log level (`INFO`, `WARN`, `ERROR`, `DEBUG`)
- Message (randomly selected from the config file or generated gibberish)

**Example:**

`[2025-10-22T18:05:03.892Z] [Case #F2B93D] [INFO] The server is feeling quirky today.`

---

### API Endpoints

| Method | Endpoint  | Description                                                    |
| ------ | --------- | -------------------------------------------------------------- |
| GET    | `/start`  | Starts automatic log generation using the configured interval. |
| GET    | `/stop`   | Stops automatic log generation.                                |
| GET    | `/status` | Returns current logger status and configuration info.          |
| GET    | `/log`    | Manually triggers a single log entry.                          |

---

### Cross-Platform Compatibility

- Works on Windows, macOS, and Linux.
- Uses Node's built-in `fs`, `path`, and `os` modules.
- Automatically creates log directories if they do not exist.

---

### Project Structure

```
gibberish-logger/
├── index.js # Express server and API endpoints
├── logger.js # Logging engine (core logic)
├── config.json # Configuration file
└── utils/
└── helpers.js # Randomizers and helper utilities
```

---

### Future Enhancements

- `/reload` endpoint to reload configuration without restarting the app.
- Log file rotation based on maximum size.
- Real-time log streaming via WebSockets or Server-Sent Events.
- CLI mode for starting/stopping from the terminal.
- Optional Docker container for deployment.
