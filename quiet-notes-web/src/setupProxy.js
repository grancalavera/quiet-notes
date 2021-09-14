// ┌────────────────┬────────────────┬─────────────────────────────────┐
// │ Emulator       │ Host:Port      │ View in Emulator UI             │
// ├────────────────┼────────────────┼─────────────────────────────────┤
// │ Authentication │ localhost:9099 │ http://localhost:4000/auth      │
// ├────────────────┼────────────────┼─────────────────────────────────┤
// │ Functions      │ localhost:5001 │ http://localhost:4000/functions │
// ├────────────────┼────────────────┼─────────────────────────────────┤
// │ Firestore      │ localhost:8080 │ http://localhost:4000/firestore │
// ├────────────────┼────────────────┼─────────────────────────────────┤
// │ Hosting        │ localhost:5000 │ n/a                             │
// └────────────────┴────────────────┴─────────────────────────────────┘
//   Emulator Hub running at localhost:4400
//   Other reserved ports: 4500

// "proxy": "https://quiet-notes-e83fb.web.app"

const { createProxyMiddleware } = require("http-proxy-middleware");

const target =
  process.env.REACT_APP_FIREBASE_USE_EMULATORS === "true"
    ? "localhost:5000"
    : "https://quiet-notes-e83fb.web.app";

module.exports = function (app) {
  app.use(
    "*",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
