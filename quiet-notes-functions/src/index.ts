import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-functions/lib/providers/auth";

type QNRole = "admin" | "author" | "user";

interface ListUsersResponse {
  users: QNUserRecord[];
}

interface QNUserRecord {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  roles: QNRole[];
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const onboardUser = functions.auth.user().onCreate(async (user) => {
  console.log("onboard user", user.uid);

  const roles: QNRole[] = ["user"];
  if (user.email === functions.config().quiet_notes.default_admin) {
    roles.push("admin");
  }

  addRoles(user, roles);
});

const toUserRecord = ({
  uid,
  email,
  displayName,
  photoURL,
  disabled,
  customClaims,
}: admin.auth.UserRecord): QNUserRecord => ({
  uid,
  email,
  displayName,
  photoURL,
  disabled,
  roles: customClaims?.roles ?? [],
});

export const listUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
  }

  if (!(context.auth.token.roles ?? []).includes("admin")) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User not authorized to list all users"
    );
  }

  try {
    const result = await admin.auth().listUsers();
    const response: ListUsersResponse = { users: result.users.map(toUserRecord) };
    return response;
  } catch (error) {
    console.error("list users failed", { error });
    throw new functions.https.HttpsError("permission-denied", "permission-denied");
  }
});

const addRoles = async (user: UserRecord, roles: QNRole[]): Promise<void> => {
  const existingRoles = user.customClaims?.roles ?? [];
  const updatedRoles = [...new Set([...existingRoles, ...roles])];

  console.log("addRoles", {
    uid: user.uid,
    existingRoles,
    updatedRoles,
  });

  try {
    await admin.auth().setCustomUserClaims(user.uid, { roles: updatedRoles });
  } catch (error) {
    console.error("failed to set custom claims", { error });
  } finally {
    const customClaims = (await admin.auth().getUser(user.uid)).customClaims;
    console.log("final custom claims", { uid: user.uid, customClaims });
  }
};
