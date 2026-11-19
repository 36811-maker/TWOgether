// Configuration for Render backend deployment
// When deployed on GitHub Pages, change this to your Render service URL (e.g. https://twogether-backend.onrender.com)
window.API_CONFIG = {
  BASE_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "/api",
  WS_URL: window.location.protocol === "https:"
    ? `wss://${window.location.host}`
    : `ws://${window.location.host}`,
};
