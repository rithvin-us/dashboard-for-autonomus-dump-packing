import { trucks, v2vMessages, tokenLog, telemetryHistory, defaultSettings } from './data.js';

// ===== DASHBOARD PAGE =====
export function renderDashboard() {
    const active = trucks.filter(t => t.status === 'active').length;
    const idle = trucks.filter(t => t.status === 'idle').length;
    const stopped = trucks.filter(t => t.status === 'stopped').length;
    const totalPayload = trucks.reduce((s, t) => s + t.payload, 0);
    const avgFuel = Math.round(trucks.reduce((s, t) => s + t.fuel, 0) / trucks.length);
    const totalCycles = trucks.reduce((s, t) => s + t.cycles, 0);

    return `
    <div class="grid-4 mb-20">
      <div class="card stat-card">
        <div class="stat-icon yellow"><i class="fas fa-truck-monster"></i></div>
        <div><div class="stat-value">${active}/${trucks.length}</div><div class="stat-label">Active Trucks</div>
        <div class="stat-change up"><i class="fas fa-arrow-up"></i> ${idle} idle, ${stopped} stopped</div></div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon green"><i class="fas fa-weight-hanging"></i></div>
        <div><div class="stat-value">${totalPayload}T</div><div class="stat-label">Total Payload</div>
        <div class="stat-change up"><i class="fas fa-arrow-up"></i> +12% vs last hour</div></div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon blue"><i class="fas fa-gas-pump"></i></div>
        <div><div class="stat-value">${avgFuel}%</div><div class="stat-label">Avg Fuel Level</div>
        <div class="stat-change down"><i class="fas fa-arrow-down"></i> -3% last hour</div></div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon yellow"><i class="fas fa-rotate"></i></div>
        <div><div class="stat-value">${totalCycles}</div><div class="stat-label">Total Cycles</div>
        <div class="stat-change up"><i class="fas fa-arrow-up"></i> On target</div></div>
      </div>
    </div>

    <div class="grid-2 mb-20">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-map-location-dot"></i> Mine Map — Live</div><div class="card-badge success">LIVE</div></div>
        <div class="mini-map" id="mineMap">
          <div class="map-grid"></div>
          <div class="map-zone load" style="top:15%;left:8%;padding:6px 12px">SHOVEL 1</div>
          <div class="map-zone load" style="top:55%;left:12%;padding:6px 12px">SHOVEL 2</div>
          <div class="map-zone load" style="top:75%;left:5%;padding:6px 12px">SHOVEL 3</div>
          <div class="map-zone dump" style="top:10%;right:8%;padding:6px 12px">DUMP 1</div>
          <div class="map-zone dump" style="top:50%;right:5%;padding:6px 12px">DUMP 2</div>
          <div class="map-zone dump" style="top:80%;right:10%;padding:6px 12px">DUMP 3</div>
          ${trucks.map((t, i) => `<div class="map-truck ${t.status === 'stopped' ? 'stopped' : ''}" data-id="${t.id.split('-').pop()}" style="top:${15 + i * 10}%;left:${20 + i * 8}%;"></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-chart-column"></i> Hourly Production</div></div>
        <div class="chart-area">
          <div class="chart-bar-group">
            ${telemetryHistory.slice(-12).map(h => {
        const pct = (h.production / 1200) * 100;
        return `<div class="chart-bar" style="height:${pct}%;background:linear-gradient(180deg,var(--cat-yellow),rgba(255,203,5,0.3))" data-value="${h.production}T"></div>`;
    }).join('')}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:10px;color:var(--text-muted)">
          ${telemetryHistory.slice(-12).map(h => `<span>${h.hour}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> Fleet Status Overview</div></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Truck ID</th><th>Model</th><th>Status</th><th>Payload</th><th>Fuel</th><th>Speed</th><th>Health</th><th>Route</th><th>ETA</th></tr></thead>
          <tbody>
            ${trucks.map(t => `<tr>
              <td style="font-weight:600;color:var(--cat-yellow);font-family:var(--font-mono)">${t.id}</td>
              <td>${t.model}</td>
              <td><span class="status-pill ${t.status}">${t.status}</span></td>
              <td>${t.payload}/${t.maxPayload}T</td>
              <td><div style="display:flex;align-items:center;gap:6px">${t.fuel}%<div class="progress-bar" style="width:60px"><div class="progress-fill ${t.fuel > 60 ? 'green' : t.fuel > 30 ? 'yellow' : 'red'}" style="width:${t.fuel}%"></div></div></div></td>
              <td>${t.speed} km/h</td>
              <td><div style="display:flex;align-items:center;gap:6px">${t.health}%<div class="progress-bar" style="width:60px"><div class="progress-fill ${t.health > 85 ? 'green' : t.health > 60 ? 'yellow' : 'red'}" style="width:${t.health}%"></div></div></div></td>
              <td style="font-size:11px">${t.route}</td>
              <td style="font-family:var(--font-mono)">${t.eta}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ===== FLEET MONITOR PAGE =====
export function renderFleet() {
    return `
    <h2 class="section-title mb-16"><i class="fas fa-truck-monster"></i> Fleet Monitor — Detailed View</h2>
    <div class="grid-2 mb-20">
      ${trucks.map(t => `
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-truck"></i> ${t.id}</div>
            <span class="status-pill ${t.status}">${t.status}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">
            <div><span style="color:var(--text-muted)">Model:</span> ${t.model}</div>
            <div><span style="color:var(--text-muted)">Speed:</span> ${t.speed} km/h</div>
            <div><span style="color:var(--text-muted)">Payload:</span> ${t.payload}/${t.maxPayload}T</div>
            <div><span style="color:var(--text-muted)">Fuel:</span> ${t.fuel}%</div>
            <div><span style="color:var(--text-muted)">Route:</span> ${t.route}</div>
            <div><span style="color:var(--text-muted)">ETA:</span> ${t.eta}</div>
            <div><span style="color:var(--text-muted)">Cycles:</span> ${t.cycles}</div>
            <div><span style="color:var(--text-muted)">Eng Temp:</span> ${t.temp}°C</div>
          </div>
          <div style="margin-top:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
            <div><div style="font-size:10px;color:var(--text-muted);margin-bottom:4px">Health</div><div class="progress-bar"><div class="progress-fill ${t.health > 85 ? 'green' : t.health > 60 ? 'yellow' : 'red'}" style="width:${t.health}%"></div></div><div style="font-size:11px;margin-top:2px">${t.health}%</div></div>
            <div><div style="font-size:10px;color:var(--text-muted);margin-bottom:4px">Tires</div><div class="progress-bar"><div class="progress-fill ${t.tire > 80 ? 'green' : 'yellow'}" style="width:${t.tire}%"></div></div><div style="font-size:11px;margin-top:2px">${t.tire}%</div></div>
            <div><div style="font-size:10px;color:var(--text-muted);margin-bottom:4px">Hydraulic</div><div class="progress-bar"><div class="progress-fill ${t.hydraulic > 80 ? 'green' : 'yellow'}" style="width:${t.hydraulic}%"></div></div><div style="font-size:11px;margin-top:2px">${t.hydraulic}%</div></div>
            <div><div style="font-size:10px;color:var(--text-muted);margin-bottom:4px">Fuel</div><div class="progress-bar"><div class="progress-fill ${t.fuel > 60 ? 'blue' : t.fuel > 30 ? 'yellow' : 'red'}" style="width:${t.fuel}%"></div></div><div style="font-size:11px;margin-top:2px">${t.fuel}%</div></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== V2V COMMS PAGE =====
export function renderV2V() {
    return `
    <h2 class="section-title mb-16"><i class="fas fa-tower-broadcast"></i> Vehicle-to-Vehicle Communication (V2V)</h2>
    <div class="grid-3 mb-20">
      <div class="card stat-card"><div class="stat-icon green"><i class="fas fa-signal"></i></div><div><div class="stat-value">98.4%</div><div class="stat-label">Network Uptime</div></div></div>
      <div class="card stat-card"><div class="stat-icon blue"><i class="fas fa-clock"></i></div><div><div class="stat-value">11ms</div><div class="stat-label">Avg Latency</div></div></div>
      <div class="card stat-card"><div class="stat-icon yellow"><i class="fas fa-envelope"></i></div><div><div class="stat-value">2,847</div><div class="stat-label">Messages / Hour</div></div></div>
    </div>
    <div class="grid-2 mb-20">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-network-wired"></i> V2V Network Topology</div><div class="card-badge success">MESH ACTIVE</div></div>
        <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:20px;padding:20px;min-height:200px;position:relative">
          <div style="position:absolute;width:60%;height:60%;border:1px dashed rgba(255,203,5,0.15);border-radius:50%"></div>
          ${trucks.filter(t => t.status !== 'maintenance').map((t, i) => {
        const angle = (i / 7) * Math.PI * 2;
        const x = 50 + 35 * Math.cos(angle);
        const y = 50 + 35 * Math.sin(angle);
        return `<div class="comm-node ${t.status === 'active' ? 'active' : ''}" style="position:absolute;top:${y}%;left:${x}%;transform:translate(-50%,-50%)">${t.id.split('-').pop()}</div>`;
    }).join('')}
          <div class="comm-node" style="border-color:var(--info);background:rgba(59,130,246,0.1);color:var(--info);z-index:2"><i class="fas fa-tower-broadcast"></i></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-scroll"></i> Live Message Feed</div></div>
        <div style="max-height:260px;overflow-y:auto">
          ${v2vMessages.map(m => `
            <div style="padding:10px;border-bottom:1px solid var(--border-color);font-size:12px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="color:var(--cat-yellow);font-weight:600;font-family:var(--font-mono)">${m.from} → ${m.to}</span>
                <span class="card-badge ${m.type === 'PROXIMITY_ALERT' ? 'warning' : 'info'}">${m.type}</span>
              </div>
              <div style="color:var(--text-secondary);margin-bottom:4px">${m.msg}</div>
              <div style="display:flex;gap:16px;color:var(--text-muted);font-size:10px;font-family:var(--font-mono)">
                <span>RSSI: ${m.rssi} dBm</span><span>Latency: ${m.latency}ms</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-sliders"></i> V2V Communication Controls</div></div>
      <div class="grid-3">
        <div class="toggle-row"><div class="toggle-label"><span>Mesh Networking</span><span>Multi-hop relay between trucks</span></div><label class="toggle"><input type="checkbox" checked data-toggle="mesh"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Proximity Alerts</span><span>Auto-warn on close approach</span></div><label class="toggle"><input type="checkbox" checked data-toggle="proximity"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Position Beacons</span><span>Broadcast GPS every 500ms</span></div><label class="toggle"><input type="checkbox" checked data-toggle="beacon"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Queue Coordination</span><span>Automated shovel queue mgmt</span></div><label class="toggle"><input type="checkbox" checked data-toggle="queue"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Payload Broadcast</span><span>Share load data with fleet</span></div><label class="toggle"><input type="checkbox" checked data-toggle="payloadbc"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Collision Avoidance Relay</span><span>LiDAR/radar data sharing</span></div><label class="toggle"><input type="checkbox" checked data-toggle="collisionRelay"><span class="toggle-slider"></span></label></div>
      </div>
    </div>
  `;
}

// ===== TOKEN PROTOCOL PAGE =====
export function renderToken() {
    return `
    <h2 class="section-title mb-16"><i class="fas fa-shield-halved"></i> Token-Based Access Protocol</h2>
    <div class="grid-3 mb-20">
      <div class="card stat-card"><div class="stat-icon yellow"><i class="fas fa-coins"></i></div><div><div class="stat-value">4</div><div class="stat-label">Active Tokens</div></div></div>
      <div class="card stat-card"><div class="stat-icon green"><i class="fas fa-check-double"></i></div><div><div class="stat-value">99.1%</div><div class="stat-label">Grant Rate</div></div></div>
      <div class="card stat-card"><div class="stat-icon blue"><i class="fas fa-stopwatch"></i></div><div><div class="stat-value">45ms</div><div class="stat-label">Avg Handoff</div></div></div>
    </div>
    <div class="card mb-20">
      <div class="card-header"><div class="card-title"><i class="fas fa-diagram-project"></i> Token Flow — Real-Time</div><div class="card-badge success">CIRCULATING</div></div>
      <p style="font-size:12px;color:var(--text-secondary);margin-bottom:16px">Tokens grant exclusive access to shared zones (intersections, shovel queues, dump approaches). Only the token holder may enter the zone — preventing conflicts and collisions.</p>
      <div class="token-flow">
        ${trucks.filter(t => t.status !== 'maintenance').map((t, i, arr) => `
          <div class="token-node ${t.tokenHolder ? 'has-token' : ''}">${t.id.split('-').slice(1).join('-')}${t.tokenHolder ? ' 🪙' : ''}</div>
          ${i < arr.length - 1 ? '<i class="fas fa-arrow-right token-arrow"></i>' : ''}
        `).join('')}
      </div>
    </div>
    <div class="grid-2 mb-20">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-clock-rotate-left"></i> Token Transaction Log</div></div>
        <table class="data-table"><thead><tr><th>Time</th><th>From</th><th>To</th><th>Zone</th><th>Status</th></tr></thead><tbody>
          ${tokenLog.map(l => `<tr>
            <td style="font-family:var(--font-mono)">${l.time}</td>
            <td style="color:var(--cat-yellow);font-family:var(--font-mono);font-size:11px">${l.from}</td>
            <td style="font-family:var(--font-mono);font-size:11px">${l.to}</td>
            <td>${l.zone}</td>
            <td><span class="status-pill ${l.status === 'granted' ? 'active' : l.status === 'timeout' ? 'idle' : 'stopped'}">${l.status}</span></td>
          </tr>`).join('')}
        </tbody></table>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-sliders"></i> Token Protocol Settings</div></div>
        <div class="toggle-row"><div class="toggle-label"><span>Auto Token Rotation</span><span>Cycle tokens on zone exit</span></div><label class="toggle"><input type="checkbox" checked data-toggle="tokenRotation"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Priority Override</span><span>Emergency vehicles bypass queue</span></div><label class="toggle"><input type="checkbox" checked data-toggle="tokenPriority"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Token Timeout (30s)</span><span>Auto-revoke if no movement</span></div><label class="toggle"><input type="checkbox" checked data-toggle="tokenTimeout"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Multi-Zone Tokens</span><span>Allow tokens spanning zones</span></div><label class="toggle"><input type="checkbox" data-toggle="multiZone"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Dead-Man Release</span><span>Release token if truck stops</span></div><label class="toggle"><input type="checkbox" checked data-toggle="deadman"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Audit Logging</span><span>Full transaction traceability</span></div><label class="toggle"><input type="checkbox" checked data-toggle="auditLog"><span class="toggle-slider"></span></label></div>
      </div>
    </div>
  `;
}

// ===== KILL SWITCH PAGE =====
export function renderKillSwitch() {
    return `
    <h2 class="section-title mb-16"><i class="fas fa-circle-stop"></i> Emergency Kill Switch — Manual Override</h2>
    <div class="grid-2 mb-20">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-hand"></i> Global Emergency Stop</div><div class="card-badge danger" id="killStatus">ARMED</div></div>
        <div class="kill-switch-container">
          <button class="kill-btn" id="globalKillBtn"><i class="fas fa-power-off"></i><span>E-STOP</span><span style="font-size:10px;font-weight:400">ALL UNITS</span></button>
          <p style="font-size:12px;color:var(--text-muted);text-align:center;max-width:320px">Activating will immediately halt ALL autonomous vehicles in the operational zone. Requires supervisor confirmation to resume.</p>
        </div>
        <div class="toggle-row"><div class="toggle-label"><span>Arm Kill Switch System</span><span>System must be armed to activate</span></div><label class="toggle"><input type="checkbox" checked id="armKillSwitch" data-toggle="armKill"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Audible Alarm</span><span>Sound siren on activation</span></div><label class="toggle"><input type="checkbox" checked data-toggle="killAlarm"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Two-Key Activation</span><span>Require dual-operator confirm</span></div><label class="toggle"><input type="checkbox" data-toggle="twoKey"><span class="toggle-slider"></span></label></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-list-check"></i> Per-Vehicle Stop Control</div></div>
        <div style="max-height:400px;overflow-y:auto">
          ${trucks.map(t => `
            <div class="toggle-row">
              <div class="toggle-label">
                <span style="display:flex;align-items:center;gap:8px"><span class="status-pill ${t.status}" style="font-size:8px">${t.status}</span> ${t.id}</span>
                <span>${t.route}</span>
              </div>
              <label class="toggle"><input type="checkbox" ${t.status === 'stopped' ? 'checked' : ''} data-toggle="stop-${t.id}"><span class="toggle-slider"></span></label>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border-color)">
          <div class="toggle-row"><div class="toggle-label"><span>Zone-Based Lockdown</span><span>Stop all trucks in selected zone</span></div><label class="toggle"><input type="checkbox" data-toggle="zoneLock"><span class="toggle-slider"></span></label></div>
          <div class="toggle-row"><div class="toggle-label"><span>A-Stop Device Sync</span><span>Sync with portable A-Stop devices</span></div><label class="toggle"><input type="checkbox" checked data-toggle="aStopSync"><span class="toggle-slider"></span></label></div>
        </div>
      </div>
    </div>
  `;
}

// ===== SUPERVISION PAGE =====
export function renderSupervision() {
    return `
    <h2 class="section-title mb-16"><i class="fas fa-user-shield"></i> Manual Supervision Control</h2>
    <div class="grid-4 mb-20">
      <div class="card stat-card"><div class="stat-icon yellow"><i class="fas fa-eye"></i></div><div><div class="stat-value">6</div><div class="stat-label">Monitored</div></div></div>
      <div class="card stat-card"><div class="stat-icon green"><i class="fas fa-user-check"></i></div><div><div class="stat-value">2</div><div class="stat-label">Supervisors Online</div></div></div>
      <div class="card stat-card"><div class="stat-icon blue"><i class="fas fa-gamepad"></i></div><div><div class="stat-value">0</div><div class="stat-label">Manual Overrides</div></div></div>
      <div class="card stat-card"><div class="stat-icon red"><i class="fas fa-triangle-exclamation"></i></div><div><div class="stat-value">1</div><div class="stat-label">Interventions</div></div></div>
    </div>
    <div class="card mb-20">
      <div class="card-header"><div class="card-title"><i class="fas fa-video"></i> Live Camera Feeds — Autonomous Fleet</div></div>
      <div class="supervisor-grid">
        ${trucks.filter(t => t.status !== 'maintenance').map(t => `
          <div class="truck-feed">
            <div class="truck-feed-header"><span>${t.id}</span><span class="status-pill ${t.status}" style="font-size:8px">${t.status}</span></div>
            <div class="truck-feed-body"><div class="scan-line"></div><i class="fas fa-video" style="font-size:24px;opacity:0.3"></i></div>
            <div class="truck-feed-footer">
              <span><i class="fas fa-gauge"></i> ${t.speed} km/h</span>
              <span><i class="fas fa-location-dot"></i> ${t.route}</span>
              <label class="toggle" style="transform:scale(0.8)"><input type="checkbox" ${t.status === 'active' ? 'checked' : ''} data-toggle="cam-${t.id}"><span class="toggle-slider"></span></label>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-sliders"></i> Supervision Settings</div></div>
      <div class="grid-2">
        <div>
          <div class="toggle-row"><div class="toggle-label"><span>Auto-Intervention Mode</span><span>System intervenes on anomaly</span></div><label class="toggle"><input type="checkbox" checked data-toggle="autoIntervene"><span class="toggle-slider"></span></label></div>
          <div class="toggle-row"><div class="toggle-label"><span>Manual Takeover Ready</span><span>Enable remote joystick control</span></div><label class="toggle"><input type="checkbox" data-toggle="manualTakeover"><span class="toggle-slider"></span></label></div>
          <div class="toggle-row"><div class="toggle-label"><span>360° Camera Mode</span><span>Panoramic view on all trucks</span></div><label class="toggle"><input type="checkbox" checked data-toggle="cam360"><span class="toggle-slider"></span></label></div>
          <div class="toggle-row"><div class="toggle-label"><span>Obstacle Highlight</span><span>AR overlay for detected objects</span></div><label class="toggle"><input type="checkbox" checked data-toggle="obstacleHL"><span class="toggle-slider"></span></label></div>
        </div>
        <div>
          <div class="toggle-row"><div class="toggle-label"><span>Speed Override</span><span>Cap speed remotely per truck</span></div><label class="toggle"><input type="checkbox" data-toggle="speedOverride"><span class="toggle-slider"></span></label></div>
          <div class="toggle-row"><div class="toggle-label"><span>Path Override</span><span>Manually reroute any truck</span></div><label class="toggle"><input type="checkbox" data-toggle="pathOverride"><span class="toggle-slider"></span></label></div>
          <div class="toggle-row"><div class="toggle-label"><span>Fatigue Detection (DSS)</span><span>Monitor for staffed vehicles</span></div><label class="toggle"><input type="checkbox" checked data-toggle="fatigue"><span class="toggle-slider"></span></label></div>
          <div class="toggle-row"><div class="toggle-label"><span>Incident Recording</span><span>Auto-record anomalous events</span></div><label class="toggle"><input type="checkbox" checked data-toggle="incidentRec"><span class="toggle-slider"></span></label></div>
        </div>
      </div>
    </div>
  `;
}

// ===== TELEMETRY PAGE =====
export function renderTelemetry() {
    return `
    <h2 class="section-title mb-16"><i class="fas fa-chart-line"></i> Telemetry & Analytics</h2>
    <div class="grid-4 mb-20">
      <div class="card stat-card"><div class="stat-icon yellow"><i class="fas fa-mountain"></i></div><div><div class="stat-value">12,480T</div><div class="stat-label">Today's Production</div></div></div>
      <div class="card stat-card"><div class="stat-icon green"><i class="fas fa-clock"></i></div><div><div class="stat-value">18.2m</div><div class="stat-label">Avg Cycle Time</div></div></div>
      <div class="card stat-card"><div class="stat-icon blue"><i class="fas fa-road"></i></div><div><div class="stat-value">34.8</div><div class="stat-label">Avg Speed (km/h)</div></div></div>
      <div class="card stat-card"><div class="stat-icon red"><i class="fas fa-gas-pump"></i></div><div><div class="stat-value">4,210L</div><div class="stat-label">Fuel Consumed</div></div></div>
    </div>
    <div class="grid-2 mb-20">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-chart-area"></i> Fuel Consumption (24h)</div></div>
        <div class="chart-area"><div class="chart-bar-group">
          ${telemetryHistory.map(h => `<div class="chart-bar" style="height:${(h.fuelUsage / 350) * 100}%;background:linear-gradient(180deg,var(--info),rgba(59,130,246,0.2))" data-value="${h.fuelUsage}L"></div>`).join('')}
        </div></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-chart-bar"></i> Cycle Count (24h)</div></div>
        <div class="chart-area"><div class="chart-bar-group">
          ${telemetryHistory.map(h => `<div class="chart-bar" style="height:${(h.cycles / 45) * 100}%;background:linear-gradient(180deg,var(--success),rgba(34,197,94,0.2))" data-value="${h.cycles}"></div>`).join('')}
        </div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-sliders"></i> Telemetry Controls</div></div>
      <div class="grid-3">
        <div class="toggle-row"><div class="toggle-label"><span>Live Data Stream</span><span>Real-time sensor feed</span></div><label class="toggle"><input type="checkbox" checked data-toggle="liveStream"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Predictive Analytics</span><span>ML-based failure prediction</span></div><label class="toggle"><input type="checkbox" checked data-toggle="predictive"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Export to VisionLink</span><span>Sync with Cat VisionLink</span></div><label class="toggle"><input type="checkbox" checked data-toggle="visionlink"><span class="toggle-slider"></span></label></div>
      </div>
    </div>
  `;
}

// ===== SETTINGS PAGE =====
export function renderSettings() {
    const s = defaultSettings;
    return `
    <h2 class="section-title mb-16"><i class="fas fa-sliders"></i> System Settings</h2>
    <div class="grid-2 mb-20">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-robot"></i> Autonomy Controls</div></div>
        <div class="toggle-row"><div class="toggle-label"><span>Auto Route Optimization</span><span>MineStar dynamic path calculation</span></div><label class="toggle"><input type="checkbox" ${s.autoRouteOptimization ? 'checked' : ''} data-toggle="set-autoRoute"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Collision Avoidance System</span><span>LiDAR + Radar sensor fusion</span></div><label class="toggle"><input type="checkbox" ${s.collisionAvoidance ? 'checked' : ''} data-toggle="set-collision"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Weather Adaptive Mode</span><span>Adjust speed and routes for weather</span></div><label class="toggle"><input type="checkbox" ${s.weatherAdaptive ? 'checked' : ''} data-toggle="set-weather"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Predictive Maintenance</span><span>AI-based maintenance scheduling</span></div><label class="toggle"><input type="checkbox" ${s.predictiveMaintenance ? 'checked' : ''} data-toggle="set-predictMaint"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Payload Optimization</span><span>Auto-adjust load distribution</span></div><label class="toggle"><input type="checkbox" ${s.payloadOptimization ? 'checked' : ''} data-toggle="set-payload"><span class="toggle-slider"></span></label></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fas fa-shield-halved"></i> Safety & Environment</div></div>
        <div class="toggle-row"><div class="toggle-label"><span>Geo-Fencing Enforcement</span><span>Restrict trucks to mine boundaries</span></div><label class="toggle"><input type="checkbox" ${s.geoFencing ? 'checked' : ''} data-toggle="set-geoFence"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Speed Limiter</span><span>Enforce zone-based speed limits</span></div><label class="toggle"><input type="checkbox" ${s.speedLimiter ? 'checked' : ''} data-toggle="set-speedLimit"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Dust Suppression Alert</span><span>Auto-trigger water trucks</span></div><label class="toggle"><input type="checkbox" ${s.dustSuppression ? 'checked' : ''} data-toggle="set-dust"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Emergency Broadcast</span><span>Site-wide emergency channel</span></div><label class="toggle"><input type="checkbox" ${s.emergencyBroadcast ? 'checked' : ''} data-toggle="set-emergency"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Remote Override Access</span><span>Allow remote manual control</span></div><label class="toggle"><input type="checkbox" ${s.remoteOverride ? 'checked' : ''} data-toggle="set-remote"><span class="toggle-slider"></span></label></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fas fa-database"></i> Data & Communication</div></div>
      <div class="grid-3">
        <div class="toggle-row"><div class="toggle-label"><span>Night Mode Operations</span><span>Enhanced visibility protocols</span></div><label class="toggle"><input type="checkbox" ${s.nightMode ? 'checked' : ''} data-toggle="set-night"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Radio Beacon</span><span>Continuous RF position signal</span></div><label class="toggle"><input type="checkbox" ${s.radioBeacon ? 'checked' : ''} data-toggle="set-radio"><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><div class="toggle-label"><span>Full Data Logging</span><span>Record all sensor & comms data</span></div><label class="toggle"><input type="checkbox" ${s.dataLogging ? 'checked' : ''} data-toggle="set-logging"><span class="toggle-slider"></span></label></div>
      </div>
    </div>
  `;
}
