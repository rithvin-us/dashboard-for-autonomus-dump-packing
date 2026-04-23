import './style.css';
import { alerts } from './data.js';
import { renderDashboard, renderFleet, renderV2V, renderToken, renderKillSwitch, renderSupervision, renderTelemetry, renderSettings } from './pages.js';

// ===== DOM REFS =====
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const pageContainer = document.getElementById('pageContainer');
const bcPage = document.getElementById('bcPage');
const topbarClock = document.getElementById('topbarClock');
const alertsBtn = document.getElementById('alertsBtn');
const alertsPanel = document.getElementById('alertsPanel');
const closeAlerts = document.getElementById('closeAlerts');
const alertsList = document.getElementById('alertsList');
const themeToggle = document.getElementById('themeToggle');

// ===== PAGES MAP =====
const pages = {
  dashboard: { title: 'Dashboard', render: renderDashboard },
  fleet: { title: 'Fleet Monitor', render: renderFleet },
  v2v: { title: 'V2V Communications', render: renderV2V },
  token: { title: 'Token Protocol', render: renderToken },
  killswitch: { title: 'Kill Switch', render: renderKillSwitch },
  supervision: { title: 'Supervision Control', render: renderSupervision },
  telemetry: { title: 'Telemetry & Analytics', render: renderTelemetry },
  settings: { title: 'System Settings', render: renderSettings },
};

let currentPage = 'dashboard';

// ===== NAVIGATION =====
function navigateTo(page) {
  currentPage = page;
  const p = pages[page];
  if (!p) return;
  bcPage.textContent = p.title;
  pageContainer.innerHTML = p.render();
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
  // Attach kill switch handler if on kill switch page
  if (page === 'killswitch') attachKillSwitchHandlers();
  // Close mobile sidebar
  sidebar.classList.remove('mobile-open');
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.page));
});

// ===== SIDEBAR TOGGLE =====
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));

// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  topbarClock.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + ' IST';
}
setInterval(updateClock, 1000);
updateClock();

// ===== ALERTS =====
function renderAlerts() {
  alertsList.innerHTML = alerts.map(a => `
    <div class="alert-item ${a.type}">
      <div class="alert-title">${a.title}</div>
      <div class="alert-desc">${a.desc}</div>
      <div class="alert-time"><i class="fas fa-clock"></i> ${a.time}</div>
    </div>
  `).join('');
}
alertsBtn.addEventListener('click', () => {
  alertsPanel.classList.toggle('open');
  renderAlerts();
});
closeAlerts.addEventListener('click', () => alertsPanel.classList.remove('open'));

// ===== THEME TOGGLE =====
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const icon = themeToggle.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
});

// ===== KILL SWITCH LOGIC =====
function attachKillSwitchHandlers() {
  const killBtn = document.getElementById('globalKillBtn');
  const killStatus = document.getElementById('killStatus');
  if (!killBtn) return;
  killBtn.addEventListener('click', () => {
    const isActive = killBtn.classList.toggle('active');
    if (isActive) {
      killStatus.textContent = 'ACTIVATED';
      killStatus.className = 'card-badge danger';
      killBtn.innerHTML = '<i class="fas fa-power-off"></i><span>ACTIVE</span><span style="font-size:10px;font-weight:400">CLICK TO RELEASE</span>';
    } else {
      killStatus.textContent = 'ARMED';
      killStatus.className = 'card-badge danger';
      killBtn.innerHTML = '<i class="fas fa-power-off"></i><span>E-STOP</span><span style="font-size:10px;font-weight:400">ALL UNITS</span>';
    }
  });
}

// ===== TOGGLE LOGGING =====
document.addEventListener('change', (e) => {
  if (e.target.dataset.toggle) {
    const name = e.target.dataset.toggle;
    const state = e.target.checked;
    console.log(`[MCU] Toggle: ${name} → ${state ? 'ON' : 'OFF'}`);
  }
});

// ===== LIVE DATA SIMULATION =====
function simulateMapMovement() {
  if (currentPage !== 'dashboard') return;
  const mapTrucks = document.querySelectorAll('.map-truck');
  mapTrucks.forEach(t => {
    const curTop = parseFloat(t.style.top);
    const curLeft = parseFloat(t.style.left);
    t.style.top = (curTop + (Math.random() - 0.5) * 3) + '%';
    t.style.left = (curLeft + (Math.random() - 0.5) * 3) + '%';
  });
}
setInterval(simulateMapMovement, 3000);

// ===== INIT =====
navigateTo('dashboard');
