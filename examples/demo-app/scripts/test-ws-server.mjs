/**
 * Test WebSocket server that emits fake vessel positions in the Persian Gulf.
 * Usage: node scripts/test-ws-server.mjs
 */
import { WebSocketServer } from 'ws';

const PORT = 4200;
const wss = new WebSocketServer({ port: PORT });

const vessels = [
  { name: 'PERSIAN STAR', mmsi: 412345678, baseLat: 28.5, baseLng: 50.5 },
  { name: 'GULF TRADER', mmsi: 312345679, baseLat: 29.0, baseLng: 51.0 },
  { name: 'HORMUZ SPIRIT', mmsi: 212345680, baseLat: 27.8, baseLng: 51.5 },
  { name: 'ARABIAN PRIDE', mmsi: 512345681, baseLat: 28.2, baseLng: 50.2 },
  { name: 'SHIRAZ CARRIER', mmsi: 612345682, baseLat: 29.3, baseLng: 52.0 },
];

wss.on('connection', (ws) => {
  console.log('[test-ws] Client connected');

  ws.on('message', (msg) => {
    console.log('[test-ws] Subscribe:', msg.toString());
  });

  // Send a random vessel position every 2 seconds
  // Format matches aisstream.io MetaData shape for consistency
  const interval = setInterval(() => {
    const v = vessels[Math.floor(Math.random() * vessels.length)];
    const msg = {
      MMSI: v.mmsi,
      ShipName: v.name,
      latitude: v.baseLat + (Math.random() - 0.5) * 0.5,
      longitude: v.baseLng + (Math.random() - 0.5) * 0.5,
      time_utc: new Date().toISOString(),
      Sog: Math.floor(Math.random() * 15),
      Cog: Math.floor(Math.random() * 360),
    };
    ws.send(JSON.stringify(msg));
  }, 2000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('[test-ws] Client disconnected');
  });
});

console.log(`[test-ws] WebSocket test server running on ws://localhost:${PORT}`);
