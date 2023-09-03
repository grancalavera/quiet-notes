import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import z from "zod";
import firebaseConfig from "../../firebase.json" assert { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebasercSchema = z.object({
  projects: z.object({
    default: z.string(),
  }),
});

type Context = {
  firebaseConfig: typeof firebaseConfig;
  firebaserc: z.infer<typeof firebasercSchema>;
};

const firebaserc = firebasercSchema.parse(
  JSON.parse(readFileSync(resolve(__dirname, "../../.firebaserc"), "utf8"))
);

const header = `# ------------------------------------------------------------ #
# Generated file, to restore default values run ./bootstrap.sh #
# ------------------------------------------------------------ #
`;

type EnvTemplate = (context: Context) => `${typeof header}
VITE_APP_NAME=${string}
VITE_FIREBASE_PROJECT=${string}
VITE_FIREBASE_PROJECT_HOSTING=${string}
`;

const env: EnvTemplate = ({ firebaserc }) => `${header}
VITE_APP_NAME="Quiet Notes"
VITE_FIREBASE_PROJECT=${firebaserc.projects.default}
VITE_FIREBASE_PROJECT_HOSTING=https://${firebaserc.projects.default}.web.app
`;

const envLocal: EnvTemplate = ({ firebaserc }) => `${header}
VITE_APP_NAME="Quiet Notes (Local)"
VITE_FIREBASE_PROJECT=${firebaserc.projects.default}
VITE_FIREBASE_PROJECT_HOSTING=https://${firebaserc.projects.default}.web.app
VITE_FIREBASE_USE_EMULATORS=false
BROWSER=none
`;

const envEmulatedLocal: EnvTemplate = ({ firebaserc, firebaseConfig }) => {
  const hosting = `http://localhost:${firebaseConfig.emulators.hosting.port}`;
  return `${header}
VITE_APP_NAME="Quiet Notes (Local, Emulated)"
VITE_FIREBASE_PROJECT=${firebaserc.projects.default}
VITE_FIREBASE_PROJECT_HOSTING=${hosting}
VITE_FIREBASE_USE_EMULATORS=true
VITE_FIREBASE_EMULATOR_AUTH=http://localhost:${firebaseConfig.emulators.auth.port}
VITE_FIREBASE_EMULATOR_FIRESTORE_PORT=${firebaseConfig.emulators.firestore.port}
VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT=${firebaseConfig.emulators.functions.port}
VITE_FIREBASE_EMULATOR_HOSTING_PORT=${firebaseConfig.emulators.hosting.port}
VITE_FIREBASE_EMULATOR_HOSTING=${hosting}
NODE_ENV=development
BROWSER=none
`;
};

const renderAndSave =
  (context: Context) =>
  async (template: EnvTemplate, filename: string): Promise<void> => {
    const data = template(context);
    const path = resolve(__dirname, `../../quiet-notes-web/${filename}`);
    await writeFile(path, data, "utf8");
    console.log(data);
  };

async function main(): Promise<void> {
  const render = renderAndSave({ firebaserc, firebaseConfig });
  Promise.all([
    render(env, ".env"),
    render(envLocal, ".env.local"),
    render(envEmulatedLocal, ".env.emulated.local"),
  ]);
}

main();
