import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

type EmulatorPorts = Record<"auth" | "firestore" | "functions", number>;

const getEnvLocal = (ports: EmulatorPorts) => `
REACT_APP_FIREBASE_EMULATOR_AUTH=http://localhost:${ports.auth}
REACT_APP_FIREBASE_EMULATOR_FIRESTORE_PORT=${ports.firestore}
REACT_APP_FIREBASE_EMULATOR_FUNCTIONS_PORT=${ports.functions}
BROWSER=none
`;

const getEmulatorPorts = (config: any): EmulatorPorts => {
  try {
    return {
      auth: config.emulators.auth.port,
      firestore: config.emulators.firestore.port,
      functions: config.emulators.functions.port,
    };
  } catch {
    console.error("failed to read ports from firebase.json, using defaults");
    return { auth: 9099, firestore: 8080, functions: 5001 };
  }
};

const firebaseConfigPath = resolve(__dirname, "../../firebase.json");
const envLocalPath = resolve(__dirname, "../../quiet-notes-web/.env.local");

const firebaseConfig = JSON.parse(readFileSync(firebaseConfigPath, "utf8"));
const emulatorPorts = getEmulatorPorts(firebaseConfig);
const envLocal = getEnvLocal(emulatorPorts);

writeFileSync(envLocalPath, envLocal, { encoding: "utf8" });
