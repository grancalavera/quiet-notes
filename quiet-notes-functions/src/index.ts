import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-functions/lib/providers/auth";
import { QNListUsersResponse, QNRole, QNToggleRole, QNUserRecord } from "quiet-notes-lib";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const onboardUser = functions.auth.user().onCreate(async (user) => {
  console.log("onboard user", user.uid);

  console.log({ config: functions.config() });

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

export const listUsers = functions.https.onCall(async (_, context) => {
  await assertIsAdmin(context);

  try {
    const result = await admin.auth().listUsers();
    const response: QNListUsersResponse = { users: result.users.map(toUserRecord) };
    return response;
  } catch (error) {
    throw notAuthorized("listUsers", error);
  }
});

export const toggleRole = functions.https.onCall(async (data: QNToggleRole, context) => {
  await assertIsAdmin(context);
  try {
    const user = await admin.auth().getUserByEmail(data.email);

    if (data.enabled) {
      await addRoles(user, [data.role]);
    } else {
      await revokeRole(user, data.role);
    }
    return true;
  } catch (error) {
    throw notAuthorized("toggleRole", error);
  }
});

const addRoles = async (user: UserRecord, roles: QNRole[]): Promise<void> => {
  const existingRoles = getRolesFromUser(user);
  const updatedRoles = [...new Set([...existingRoles, ...roles])];

  console.log("addRoles", {
    uid: user.uid,
    existingRoles,
    updatedRoles,
  });

  setRoles(user, updatedRoles);
};

const revokeRole = async (user: UserRecord, role: QNRole): Promise<void> => {
  const existingRoles = getRolesFromUser(user);
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

const assertIsAdmin = async (context: functions.https.CallableContext): Promise<void> => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Not authenticated.");
  }

  const user = await admin.auth().getUserByEmail(context.auth?.token.email ?? "");
  const roles = getRolesFromUser(user);

  if (!roles.includes("admin")) {
    throw notAuthorized("assertIsAdmin", { roles, user });
  }
};

const notAuthorized = (message: string, error: unknown): functions.https.HttpsError => {
  console.error("unauthorized access", { message, error });
  return new functions.https.HttpsError("permission-denied", "Not authorized.");
};

const getRolesFromUser = (user: UserRecord): QNRole[] => {
  return user.customClaims?.roles ?? [];
};
