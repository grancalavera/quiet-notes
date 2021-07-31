import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-functions/lib/providers/auth";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const setDefaultAdmin = functions.auth.user().onCreate(async (user) => {
  if (user.email === functions.config().quiet_notes.default_admin) {
    return grantAdminRole(user);
  }
});

const grantAdminRole = async (user: UserRecord): Promise<void> => {
  const roles = user.customClaims?.roles ?? [];

  if (!roles.includes("admin")) {
    console.log("grant admin role to", { user });
    return admin.auth().setCustomUserClaims(user.uid, { roles: [...roles, "admin"] });
  } else {
    console.log("already an admin, ignore", { user });
  }
};
