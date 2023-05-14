import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import firebaseConfig from "../../firebase.json" assert { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const data = `
VITE_FIREBASE_EMULATOR_AUTH=http://localhost:${firebaseConfig.emulators.auth.port}
VITE_FIREBASE_EMULATOR_FIRESTORE_PORT=${firebaseConfig.emulators.firestore.port}
VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT=${firebaseConfig.emulators.functions.port}
VITE_FIREBASE_EMULATOR_HOSTING_PORT=${firebaseConfig.emulators.hosting.port}
BROWSER=none
`;
  const path = resolve(__dirname, "../../quiet-notes-web/.env.local");
  await writeFile(path, data, "utf8");
  console.log(path, "\n", data);
}

main();
