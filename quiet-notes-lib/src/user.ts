import z from "zod";

export const roleSchema = z.union([
  z.literal("admin"),
  z.literal("author"),
  z.literal("user"),
]);

// This is an intermediate step to filter out the root role.
// The root role was a bad idea, and it went out and some
// clients might still have it. So I silently remove it
// from the custom claims, and then I re-parse the custom
// claims with the roleSchema.
const rawRolesSchema = z.array(z.string());

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  customClaims: z
    .object({
      roles: z
        .preprocess((raw) => {
          const rawRoles = rawRolesSchema.safeParse(raw);
          return rawRoles.success
            ? rawRoles.data.filter((candidate) => candidate !== "root")
            : raw;
        }, z.array(roleSchema))
        .default([]),
    })
    .default({ roles: [] }),
  metadata: z.object({
    creationTime: z.string(),
    lastSignInTime: z.string(),
    lastRefreshTime: z.union([z.string(), z.null()]).optional(),
  }),
});

export type QNUserRecord = z.infer<typeof userSchema>;
export type QNRole = z.infer<typeof roleSchema>;
export type QNToggleRole = {
  role: QNRole;
  enabled: boolean;
  email: string;
};
