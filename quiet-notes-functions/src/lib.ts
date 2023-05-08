import admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import functions from "firebase-functions";
import { QNRole, QNUserRecord } from "quiet-notes-lib";
import z from "zod";

export const isDefaultAdmin = ({ email }: UserRecord): boolean =>
  email === functions.config().quiet_notes.default_admin;

export const assertIsAdmin = async (
  context: functions.https.CallableContext,
  message: string = "Not and admin"
): Promise<void> => {
  const email = context.auth?.token.email;

  if (!email) {
    throw notAuthenticated(message);
  }

  const user = await admin.auth().getUserByEmail(email);
  const roles = getRolesFromUser(user);

  if (!roles.includes("admin")) {
    throw notAuthorized(message, { roles, email });
  }
};

export const getRolesFromUser = (user: UserRecord): QNRole[] =>
  user.customClaims?.roles ?? [];

const exception =
  (code: functions.https.FunctionsErrorCode) =>
  (message: string, details?: unknown) => {
    console.error("QN", { code, message, details });
    new functions.https.HttpsError(code, message, details);
  };

const hasRoles =
  (roles: QNRole[]) =>
  (user: UserRecord): boolean =>
    roles.every((wanted) => getRolesFromUser(user).includes(wanted));

export const notAuthenticated = exception("unauthenticated");
export const notAuthorized = exception("permission-denied");
export const invalidArgument = exception("invalid-argument");
export const isUser = hasRoles(["user"]);
export const isAuthor = hasRoles(["author"]);
export const isAdmin = hasRoles(["admin"]);

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().optional(),
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
  metadata: z.object({
    creationTime: z.string(),
    lastSignInTime: z.string(),
    lastRefreshTime: z.union([z.string(), z.null()]).optional(),
  }),
});

type UserSchema = z.infer<typeof userSchema>;
type UserRolesSchema = UserSchema["customClaims"]["roles"];

export const toQNUser = (parsed: UserSchema): QNUserRecord => {
  // just to make sure the types match
  const user: QNUserRecord = {
    ...parsed,
    customClaims: {
      roles: toQNRoles(parsed.customClaims.roles),
    },
  };

  return user;
};

const toQNRoles = (roles: UserRolesSchema): QNRole[] =>
  roles.flatMap((candidate) =>
    candidate === "root" ? [] : [candidate]
  ) as QNRole[];

export const parseUser = (candidate: unknown): QNUserRecord =>
  toQNUser(userSchema.parse(candidate));

export const projectUser = (user: QNUserRecord) => {
  const usersCollection = admin.firestore().collection("users");
  return usersCollection.doc(user.uid).set(user);
};
