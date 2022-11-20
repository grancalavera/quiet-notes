import inquirer from "inquirer";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { writeFile } from "node:fs/promises";
import firebaseConfig from "../../firebase.json" assert { type: "json" };

const execPromise = promisify(exec);

interface Context {
  adminEmail: string;
  runtimeConfigPath: string;
  envLocalPath: string;
}

async function resolveContext(): Promise<Context> {
  return inquirer.prompt([
    {
      type: "input",
      name: "adminEmail",
      message: "Default admin email:",
      default: () => "admin@example.com",
      validate: (answer) => {
        const result = z.string().email().safeParse(answer);
        return result.success ? true : "Please enter a valid email address.";
      },
    },
    {
      type: "input",
      name: "runtimeConfigPath",
      message: "Firebase functions runtime config path:",
      default: () => resolveFromMonorepoRoot("./quiet-notes-functions/.runtimeconfig.json"),
    },
    {
      type: "input",
      name: "envLocalPath",
      message: "Vite .env.local path:",
      default: () => resolveFromMonorepoRoot("./quiet-notes-web/.env.local"),
    },
  ]);
}

async function setupDefaultAdmin({ adminEmail }: Context): Promise<void> {
  const { stderr, stdout } = await execPromise(
    `firebase functions:config:set quiet_notes.default_admin="${adminEmail}"`
  );
  assertSuccess(stderr);
  console.log(stdout);
}

async function writeFunctionsRuntimeConfig({ runtimeConfigPath: path }: Context): Promise<void> {
  const { stderr, stdout: data } = await execPromise("firebase functions:config:get");
  assertSuccess(stderr);

  await writeFile(path, data, "utf8");
  console.log(path, "\n", data);
}

async function writeEnvLocal({ envLocalPath: path }: Context): Promise<void> {
  const data = `
VITE_FIREBASE_EMULATOR_AUTH=http://localhost:${firebaseConfig.emulators.auth.port}
VITE_FIREBASE_EMULATOR_FIRESTORE_PORT=${firebaseConfig.emulators.firestore.port}
VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT=${firebaseConfig.emulators.firestore.port}
BROWSER=none
`;

  await writeFile(path, data, "utf8");
  console.log(path, "\n", data);
}

function assertSuccess(stderr: string) {
  if (stderr) {
    console.error(stderr);
    process.exit(1);
  }
}

const resolveFromMonorepoRoot = (path: string): string => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return resolve(__dirname, "../..", path);
};

async function main(): Promise<void> {
  const context = await resolveContext();
  await setupDefaultAdmin(context);
  await Promise.all([writeFunctionsRuntimeConfig(context), writeEnvLocal(context)]);
}

main();
