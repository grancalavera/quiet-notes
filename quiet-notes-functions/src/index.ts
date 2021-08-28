import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-functions/lib/providers/auth";
import { QNListUsersResponse, QNRole, QNToggleRole, QNUserRecord } from "quiet-notes-lib";

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
  photoURL,
  customClaims,
  metadata: { lastSignInTime, lastRefreshTime, creationTime },
}: admin.auth.UserRecord): QNUserRecord => ({
  uid,
  email,
  photoURL,
  customClaims: {
    roles: customClaims?.roles ?? [],
  },
  metadata: { lastSignInTime, lastRefreshTime, creationTime },
});

export const listUsers = functions.https.onCall(async (data, context) => {
  assertIsAdmin(context);

  try {
    const result = await admin.auth().listUsers();
    const response: QNListUsersResponse = { users: result.users.map(toUserRecord) };
    return response;
  } catch (error) {
    throw opaqueFailure("list users failed", error);
  }
});

export const toggleRole = functions.https.onCall(async (data: QNToggleRole, context) => {
  assertIsAdmin(context);
  try {
    const user = await admin.auth().getUserByEmail(data.email);
    if (data.enabled) {
      await addRoles(user, [data.role]);
    } else {
      await revokeRole(user, data.role);
    }
    return true;
  } catch (error) {
    throw opaqueFailure("failed to get user by email", error);
  }
});

const addRoles = async (user: UserRecord, roles: QNRole[]): Promise<void> => {
  const existingRoles: QNRole[] = user.customClaims?.roles ?? [];
  const updatedRoles = [...new Set([...existingRoles, ...roles])];

  console.log("addRoles", {
    uid: user.uid,
    existingRoles,
    updatedRoles,
  });

  setRoles(user, updatedRoles);
};

const revokeRole = async (user: UserRecord, role: QNRole): Promise<void> => {
  const existingRoles: QNRole[] = user.customClaims?.roles ?? [];
  const updatedRoles = existingRoles.filter((candidate) => candidate !== role);

  console.log("revokeRole", {
    uid: user.uid,
    existingRoles,
    updatedRoles,
  });

  setRoles(user, updatedRoles);
};

const setRoles = async (user: UserRecord, roles: QNRole[]) => {
  try {
    await admin.auth().setCustomUserClaims(user.uid, { roles });
  } catch (error) {
    console.error("failed to set custom claims", { error });
  } finally {
    const customClaims = (await admin.auth().getUser(user.uid)).customClaims;
    console.log("final custom claims", { uid: user.uid, customClaims });
  }
};

const assertIsAdmin = (context: functions.https.CallableContext): void => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
  }

  if (!(context.auth.token.roles ?? []).includes("admin")) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User not authorized to list all users"
    );
  }
};

const opaqueFailure = (hint: string, error: unknown): functions.https.HttpsError => {
  console.error(hint, { error });
  return new functions.https.HttpsError("permission-denied", "permission-denied");
};
