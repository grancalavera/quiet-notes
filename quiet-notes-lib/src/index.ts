export type QNRole = "admin" | "author" | "user";

export interface QNListUsersResponse {
  users: QNUserRecord[];
}

export interface QNUserRecord {
  uid: string;
  email?: string;
  photoURL?: string;
  customClaims: QNCustomClaims;
  metadata: QNUserMetadata;
}

export interface QNUserMetadata {
  lastSignInTime: string;
  creationTime: string;
  lastRefreshTime?: string | null;
}

export interface QNCustomClaims {
  roles: QNRole[];
}

export interface QNToggleRole {
  role: QNRole;
  enabled: boolean;
  email: string;
}

export interface QNListUsersResponse {
  users: QNUserRecord[];
}

export type QNToggleRoleResponse = true;

export const ANY_ROLE_UPDATED = "ANY_ROLE_UPDATED" as const;
