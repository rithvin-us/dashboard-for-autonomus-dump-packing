# 🚜 CAT MCU Dashboard — Caterpillar Autonomous Fleet Control

> **Main Control Unit Dashboard** for Cat® MineStar™ Command autonomous haul truck operations.  
> Built for the **Caterpillar Hackathon 2026** — IIT Madras Shaastra.

![Status](https://img.shields.io/badge/Status-Active-22c55e) ![Version](https://img.shields.io/badge/Version-1.0.0-FFCB05) ![License](https://img.shields.io/badge/License-MIT-3b82f6)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Dashboard](#running-the-dashboard)
- [Project Structure](#project-structure)
- [Dashboard Pages](#dashboard-pages)
- [Architecture](#architecture)

---

## 🔭 Overview

This dashboard provides a **centralized control interface** for managing Caterpillar's autonomous mining truck fleet using the **MineStar™ Command** system. It enables remote supervisors to monitor, control, and intervene in autonomous operations from lightweight monitors.

### Key Capabilities
- **Real-time fleet monitoring** with live map visualization
- **Vehicle-to-Vehicle (V2V) communication** monitoring and control
- **Token-based access protocol** for intersection and zone management
- **Emergency Kill Switch** with global and per-vehicle controls
- **Manual supervision** with camera feeds and override controls
- **Telemetry analytics** with production, fuel, and cycle data

---

## ✨ Features

### 🎯 Dashboard
- Fleet status overview with real-time stats
- Live mine map with truck positions (animated)
- Hourly production bar charts
- Full fleet table with health, fuel, payload metrics

### 🚛 Fleet Monitor
- Detailed per-truck cards with all subsystems
- Health, tires, hydraulics, fuel progress bars
- Route, ETA, speed, engine temp, cycle count

### 📡 V2V Communications
- Network topology visualization (mesh network)
- Live message feed with RSSI and latency
- 6 toggle controls for comms features
- Stats: uptime, latency, messages/hour

### 🪙 Token Protocol
- Real-time token flow visualization
- Transaction log (grant/timeout/denied)
- 6 toggle controls: rotation, priority, timeout, etc.
- Anti-collision zone access management

### 🛑 Kill Switch
- **Global Emergency Stop** button with animation
- Per-vehicle stop toggles (8 trucks)
- Zone-based lockdown control
- A-Stop device sync, two-key activation
- Armed/Activated state management

### 👁️ Manual Supervision
- Live camera feed grid for all trucks
- Per-truck monitoring toggles
- 8 supervision settings (intervention, override, DSS, etc.)
- Supervisor status tracking

### 📊 Telemetry
- 24-hour production, fuel, cycle charts
- Key metrics: production, cycle time, speed, fuel
- Predictive analytics & VisionLink export toggles

### ⚙️ Settings
- 13 system-wide toggle controls
- Autonomy, safety, environment, data categories
- Collision avoidance, geo-fencing, speed limiter, etc.

### 🎨 UI/UX
- **Dark/Light theme** toggle
- Glassmorphism card design
- Caterpillar yellow (#FFCB05) brand accents
- Smooth page transitions and micro-animations
- Responsive layout (desktop, tablet, mobile)
- Collapsible sidebar navigation
- Real-time clock display
- Alert notification panel

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure |
| **CSS3** | Custom properties, glassmorphism, animations |
| **Vanilla JavaScript** | ES modules, DOM manipulation |
| **Vite** | Dev server & bundler |
| **Google Fonts (Inter, JetBrains Mono)** | Typography |
| **Font Awesome 6** | Icons |

---

## 📦 Prerequisites

Ensure you have the following installed:

| Requirement | Version | Check Command |
|---|---|---|
| **Node.js** | v18+ | `node --version` |
| **npm** | v9+ | `npm --version` |

### Installing Node.js

If Node.js is not in your PATH:

```powershell
# Windows — check if installed:
Get-ChildItem -Path "C:\Program Files\nodejs" -Filter "node.exe"

# Add to PATH for current session:
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
```

Or download from [nodejs.org](https://nodejs.org/).

---

## 🚀 Installation & Setup

```bash
# 1. Clone or navigate to the project
cd cat-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Dependencies

This project uses **zero runtime dependencies** — only Vite as a dev dependency:

```json
{
  "devDependencies": {
    "vite": "^8.0.0"
  }
}
```

External resources loaded via CDN:
- **Google Fonts**: Inter, JetBrains Mono
- **Font Awesome 6.5.1**: Icon library

---

## ▶️ Running the Dashboard

```bash
# Development (with hot reload)
npm run dev
# → Opens at http://localhost:5173/

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
cat-dashboard/
├── index.html          # Main HTML shell (sidebar, topbar, containers)
├── package.json        # Project config & scripts
├── vite.config.js      # Vite configuration (if any)
├── public/
│   └── vite.svg        # Favicon
├── src/
│   ├── main.js         # App controller (navigation, events, simulation)
│   ├── pages.js        # Page renderers (all 8 pages)
│   ├── data.js         # Simulated fleet data, alerts, telemetry
│   └── style.css       # Complete design system & component styles
└── README.md
```

---

## 📄 Dashboard Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `dashboard` | Overview with map, stats, charts, fleet table |
| Fleet Monitor | `fleet` | Detailed per-truck health and status cards |
| V2V Comms | `v2v` | Vehicle-to-vehicle communication network |
| Token Protocol | `token` | Token-based zone access management |
| Kill Switch | `killswitch` | Emergency stop controls (global + per-vehicle) |
| Supervision | `supervision` | Camera feeds and manual override controls |
| Telemetry | `telemetry` | Analytics charts and data export |
| Settings | `settings` | System-wide autonomy and safety toggles |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           index.html (Shell)            │
│  ┌──────────┐  ┌─────────────────────┐  │
│  │ Sidebar  │  │   Main Content      │  │
│  │ (Nav)    │  │  ┌───────────────┐  │  │
│  │          │  │  │   Top Bar     │  │  │
│  │ 8 Pages  │  │  ├───────────────┤  │  │
│  │          │  │  │   Page View   │  │  │
│  │          │  │  │  (Dynamic)    │  │  │
│  └──────────┘  │  └───────────────┘  │  │
│                └─────────────────────┘  │
└─────────────────────────────────────────┘
         │                │
    main.js          pages.js
  (Controller)     (Renderers)
         │                │
      data.js         style.css
   (Sim Data)      (Design System)
```

### Communication Protocols Modeled

- **V2V Mesh Network**: Multi-hop relay, proximity alerts, position beacons
- **Token Protocol**: Zone-exclusive access, automatic rotation, dead-man release
- **A-Stop Integration**: Emergency stop devices sync with all autonomous units
- **MineStar Command**: Fleet assignment, route optimization, payload management

---


---

<div align="center">
  <strong>🟡 Built with Caterpillar Yellow 🟡</strong>
</div>
