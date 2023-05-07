import admin from "firebase-admin";
import { QNRole, QNUser } from "quiet-notes-lib";
import z from "zod";

const credential = admin.credential.applicationDefault();

admin.initializeApp({
  credential,
});

const db = admin.firestore();

const userSchema = z.object({
  uid: z.string(),
  email: z.string(),
  displayName: z.string().optional(),
  customClaims: z
    .object({
      roles: z
        .array(
          z.union([
            z.literal("admin"),
            z.literal("author"),
            z.literal("user"),
            z.literal("root"),
          ])
        )
        .default([]),
    })
    .default({ roles: [] }),
});

type UserSchema = z.infer<typeof userSchema>;
type UserRolesSchema = UserSchema["customClaims"]["roles"];

const toQNRoles = (roles: UserRolesSchema): QNRole[] =>
  roles.flatMap((candidate) =>
    candidate === "root" ? [] : [candidate]
  ) as QNRole[];

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
        // just to make sure the types match
        const user: QNUser = {
          ...parseResult.data,
          customClaims: {
            roles: toQNRoles(parseResult.data.customClaims.roles),
          },
        };
        return [user];
      } else {
        console.log("parse error", { error: parseResult.error });
        return [];
      }
    });

    const usersCollection = db.collection("users");

    const projection = users.map((user) =>
      usersCollection.doc(user.uid).set(user)
    );

    const allSettled = await Promise.allSettled(projection);

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
