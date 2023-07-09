import admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import functions from "firebase-functions";
import {
  QNRole,
  QNToggleRole,
  QNUserRecord,
  userSchema,
} from "quiet-notes-lib";
import {
  assertIsAdmin,
  getRolesFromUser,
  isDefaultAdmin,
  notAuthorized,
  projectUser,
} from "./lib";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

admin.firestore().settings({ ignoreUndefinedProperties: true });

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

interface QNListUsersResponse {
  users: QNUserRecord[];
}

// kept here because some clients might still be calling this API
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
    const result = await admin.auth().getUser(user.uid);
    const parsed = userSchema.parse(result);
    await projectUser(parsed);
  } catch (error) {
    console.error("failed to set custom claims", { error });
  }
};
