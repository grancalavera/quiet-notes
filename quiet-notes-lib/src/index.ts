export type QNRole = "admin" | "author" | "user";

export const qnLight = "light" as const;
export const qnDark = "dark" as const;
export const themes = [qnLight, qnDark] as const;
export const defaultTheme = qnLight;
export type QNTheme = (typeof themes)[number];

export interface QNListUsersResponse {
  users: QNUserRecord[];
}

export interface QNUserRecord {
  uid: string;
  email?: string;
  displayName?: string;
  customClaims: QNCustomClaims;
  photoURL?: string;
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
