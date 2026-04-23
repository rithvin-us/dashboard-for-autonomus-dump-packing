// ===== FLEET DATA =====
export const trucks = [
    { id: 'CAT-793F-01', model: '793F CMD', status: 'active', payload: 210, maxPayload: 227, fuel: 78, speed: 42, lat: 23.12, lng: 48.55, health: 96, temp: 82, tire: 92, hydraulic: 88, route: 'Pit A → Dump 1', eta: '4m 12s', cycles: 34, tokenHolder: true },
    { id: 'CAT-793F-02', model: '793F CMD', status: 'active', payload: 195, maxPayload: 227, fuel: 65, speed: 38, lat: 23.15, lng: 48.52, health: 91, temp: 78, tire: 88, hydraulic: 94, route: 'Pit B → Dump 2', eta: '6m 45s', cycles: 31, tokenHolder: false },
    { id: 'CAT-793F-03', model: '793F CMD', status: 'idle', payload: 0, maxPayload: 227, fuel: 92, speed: 0, lat: 23.18, lng: 48.58, health: 98, temp: 45, tire: 95, hydraulic: 97, route: 'Queue @ Shovel 3', eta: '--', cycles: 28, tokenHolder: false },
    { id: 'CAT-777G-04', model: '777G', status: 'active', payload: 85, maxPayload: 98, fuel: 54, speed: 35, lat: 23.11, lng: 48.61, health: 87, temp: 88, tire: 78, hydraulic: 82, route: 'Pit C → Dump 1', eta: '8m 02s', cycles: 42, tokenHolder: false },
    { id: 'CAT-777G-05', model: '777G', status: 'maintenance', payload: 0, maxPayload: 98, fuel: 30, speed: 0, lat: 23.20, lng: 48.50, health: 62, temp: 35, tire: 55, hydraulic: 60, route: 'Maintenance Bay', eta: '--', cycles: 0, tokenHolder: false },
    { id: 'CAT-793F-06', model: '793F CMD', status: 'active', payload: 220, maxPayload: 227, fuel: 71, speed: 40, lat: 23.14, lng: 48.57, health: 94, temp: 80, tire: 90, hydraulic: 91, route: 'Pit A → Dump 2', eta: '3m 30s', cycles: 37, tokenHolder: false },
    { id: 'CAT-793F-07', model: '793F CMD', status: 'stopped', payload: 180, maxPayload: 227, fuel: 45, speed: 0, lat: 23.16, lng: 48.54, health: 85, temp: 72, tire: 86, hydraulic: 78, route: 'E-STOP Active', eta: '--', cycles: 25, tokenHolder: false },
    { id: 'CAT-777G-08', model: '777G', status: 'active', payload: 90, maxPayload: 98, fuel: 82, speed: 33, lat: 23.13, lng: 48.60, health: 93, temp: 76, tire: 91, hydraulic: 89, route: 'Pit B → Dump 3', eta: '5m 15s', cycles: 39, tokenHolder: false },
];

export const alerts = [
    { type: 'critical', title: 'A-Stop Triggered — Zone C', desc: 'CAT-793F-07 emergency stop activated by personnel A-Stop device.', time: '2 min ago' },
    { type: 'warning', title: 'Tire Pressure Low — CAT-777G-05', desc: 'Front-left tire pressure 28 PSI (min: 35 PSI). Maintenance scheduled.', time: '8 min ago' },
    { type: 'warning', title: 'High Engine Temp — CAT-777G-04', desc: 'Engine coolant temperature 88°C approaching threshold (95°C).', time: '12 min ago' },
    { type: 'info', title: 'Shift Handover in 45 min', desc: 'Autonomous fleet shift transition from Day-A to Day-B at 18:00.', time: '15 min ago' },
    { type: 'info', title: 'Route Optimization Applied', desc: 'MineStar recalculated optimal paths. Avg cycle time reduced 3.2%.', time: '22 min ago' },
];

export const v2vMessages = [
    { from: 'CAT-793F-01', to: 'CAT-793F-06', type: 'PROXIMITY_ALERT', msg: 'Intersection approach — yielding priority', rssi: -42, latency: 12 },
    { from: 'CAT-793F-02', to: 'BROADCAST', type: 'POSITION_UPDATE', msg: 'Position beacon @ 23.15, 48.52', rssi: -38, latency: 8 },
    { from: 'CAT-777G-04', to: 'CAT-793F-01', type: 'QUEUE_REQUEST', msg: 'Requesting queue position at Shovel 2', rssi: -55, latency: 18 },
    { from: 'CAT-793F-06', to: 'CAT-793F-01', type: 'ACK', msg: 'Priority acknowledged — holding position', rssi: -40, latency: 10 },
    { from: 'CAT-777G-08', to: 'BROADCAST', type: 'PAYLOAD_STATUS', msg: 'Payload 90T — en route to Dump 3', rssi: -48, latency: 14 },
    { from: 'TOWER-01', to: 'BROADCAST', type: 'WEATHER_UPDATE', msg: 'Visibility 800m — speed limit adjusted', rssi: -30, latency: 5 },
];

export const tokenLog = [
    { time: '19:32:04', from: 'CAT-793F-06', to: 'CAT-793F-01', zone: 'Intersection A', status: 'granted' },
    { time: '19:31:48', from: 'CAT-793F-01', to: 'CAT-777G-04', zone: 'Shovel Queue 2', status: 'granted' },
    { time: '19:31:22', from: 'CAT-777G-08', to: 'CAT-793F-02', zone: 'Dump Approach 3', status: 'granted' },
    { time: '19:30:55', from: 'CAT-793F-02', to: 'CAT-793F-06', zone: 'Haul Road Seg 4', status: 'timeout' },
    { time: '19:30:18', from: 'CAT-793F-03', to: 'CAT-793F-07', zone: 'Intersection B', status: 'granted' },
    { time: '19:29:42', from: 'CAT-777G-04', to: 'CAT-793F-03', zone: 'Pit Entry C', status: 'denied' },
];

export const telemetryHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    production: Math.floor(800 + Math.random() * 400),
    fuelUsage: Math.floor(200 + Math.random() * 150),
    cycles: Math.floor(20 + Math.random() * 25),
    avgSpeed: Math.floor(28 + Math.random() * 18),
}));

// Settings defaults
export const defaultSettings = {
    autoRouteOptimization: true,
    collisionAvoidance: true,
    weatherAdaptive: true,
    predictiveMaintenance: true,
    nightMode: true,
    geoFencing: true,
    speedLimiter: true,
    driverSafetySystem: false,
    fatigueModeDetection: true,
    payloadOptimization: true,
    dustSuppression: true,
    radioBeacon: true,
    dataLogging: true,
    remoteOverride: true,
    emergencyBroadcast: true,
};
