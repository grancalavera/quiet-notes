import { resolve } from "path";
import { readFileSync } from "fs";

interface EnvLocal {
  authPort: number;
  firestorePort: number;
  functionsPort: number;
}

const envLocal = ({ authPort, firestorePort, functionsPort }: EnvLocal) => `
REACT_APP_FIREBASE_EMULATOR_AUTH=http://localhost:${authPort}
REACT_APP_FIREBASE_EMULATOR_FIRESTORE_PORT=${firestorePort}
REACT_APP_FIREBASE_EMULATOR_FUNCTIONS_PORT=${functionsPort}
BROWSER=none
`;

const getPorts = (config: any): EnvLocal => {
  try {
    return {
      authPort: config.emulators.auth.port,
      firestorePort: config.emulators.firestore.port,
      functionsPort: config.emulators.functions.port,
    };
  } catch {
    console.error("failed to read ports from firebase.json, using defaults");
    return { authPort: 9099, firestorePort: 8080, functionsPort: 5001 };
  }
};

const path = resolve(__dirname, "../../firebase.json");
const firebaseJson = JSON.parse(readFileSync(path, "utf8"));
console.log(envLocal(getPorts(firebaseJson)));
