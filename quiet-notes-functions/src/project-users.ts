import admin from "firebase-admin";
import { userSchema } from "quiet-notes-lib";
import z from "zod";
import { projectUser } from "./lib.js";

const credential = admin.credential.applicationDefault();

admin.initializeApp({
  credential,
});

const listUsersResultSchema = z.object({
  users: z.array(z.unknown()),
  pageToken: z.string().optional(),
});

const main = async () => {
  try {
    const unsafe_result = await admin.auth().listUsers();
    const result = listUsersResultSchema.parse(unsafe_result);
    const users = result.users.flatMap((candidate) => {
      const parseResult = userSchema.safeParse(candidate);
      if (parseResult.success) {
        return [parseResult.data];
      } else {
        console.log("parse error", { error: parseResult.error });
        return [];
      }
    });

    const allSettled = await Promise.allSettled(users.map(projectUser));

    allSettled.forEach((result) => {
      if (result.status === "rejected") {
        console.log("error", { error: result.reason });
      } else {
        console.log("success", result.value);
      }
    });
  } catch (e) {
    console.log({ e });
  }
};

main();
