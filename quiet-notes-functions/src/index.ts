import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-functions/lib/providers/auth";

type QNRole = "admin" | "author" | "user";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const onboardUser = functions.auth.user().onCreate(async (user) => {
  const roles: QNRole[] = ["user"];
  if (user.email === functions.config().quiet_notes.default_admin) {
    roles.push("admin");
  }

  addRoles(user, roles);
});

const addRoles = async (user: UserRecord, roles: QNRole[]): Promise<void> => {
  const existingRoles = user.customClaims?.roles ?? [];
  const updatedRoles = [...new Set([...existingRoles, ...roles])];

  console.log("addRoles", {
    uid: user.uid,
    existingRoles,
    updatedRoles,
  });

  return admin.auth().setCustomUserClaims(user.uid, { roles: updatedRoles });
};
