import admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import functions from "firebase-functions";
import { QNRole } from "quiet-notes-lib";

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
