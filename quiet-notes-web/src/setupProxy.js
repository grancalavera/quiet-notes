a; // ┌────────────────┬────────────────┬─────────────────────────────────┐
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

const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require("fs");

const emulated = process.env.REACT_APP_FIREBASE_USE_EMULATORS === "true";
const target = emulated ? "http://localhost:5000" : "https://quiet-notes-e83fb.web.app";

fs.writeFileSync("proxy-setup.json", JSON.stringify({ emulated, target }, null, 2));

module.exports = function (app) {
  app.use(
    "/__/firebase",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
