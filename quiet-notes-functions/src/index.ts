import admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";
import functions from "firebase-functions";
import {
  ANY_ROLE_UPDATED,
  QNListUsersResponse,
  QNRole,
  QNToggleRole,
  QNUserRecord,
} from "quiet-notes-lib";
import {
  assertIsAdmin,
  getRolesFromUser,
  isDefaultAdmin,
  notAuthorized,
} from "./lib";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const onboardUser = functions.auth.user().onCreate(async (user) => {
  functions.logger.info("onboard user", user.uid, {
    config: functions.config(),
    uid: user.uid,
  });

  const roles: QNRole[] = ["user"];

  if (isDefaultAdmin(user)) {
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
    const response: QNListUsersResponse = {
      users: result.users.map(toUserRecord),
    };
    return response;
  } catch (error) {
    throw notAuthorized("listUsers", error);
  }
});

export const toggleRole = functions.https.onCall(
  async ({ email, enabled, role }: QNToggleRole, context) => {
    await assertIsAdmin(context);

    const user = await admin.auth().getUserByEmail(email);

    if (enabled) {
      await addRoles(user, [role]);
    } else {
      await revokeRole(user, role);
    }

    return true;
  }
);

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
    await recordRolesUpdate(user);
  } catch (error) {
    console.error("failed to set custom claims", { error });
  } finally {
    const customClaims = (await admin.auth().getUser(user.uid)).customClaims;
    console.log("final custom claims", { uid: user.uid, customClaims });
  }
};

export const recordRolesUpdate = async (user: UserRecord): Promise<void> => {
  const db = admin.firestore();
  const roleUpdates = db.collection("roles-updates");

  try {
    await Promise.all([
      roleUpdates.doc(user.uid).set({ timestamp: Timestamp.now() }),
      roleUpdates.doc(ANY_ROLE_UPDATED).set({ timestamp: Timestamp.now() }),
    ]);
    console.log("roles updated", { uid: user.uid });
  } catch (error) {
    console.error("failed to log roles update", { error });
  }
};
