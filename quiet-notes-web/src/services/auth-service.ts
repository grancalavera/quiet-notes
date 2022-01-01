import { AuthServiceSchema } from "./auth-service-schema";

const notImplemented: any = undefined;

export const authService: AuthServiceSchema = {
  signIn: () => {
    throw new Error("signIn not implemented");
  },

  signOut: () => {
    throw new Error("signOut not implemented");
  },

  authState$: notImplemented,
  roles$: notImplemented,
  user$: notImplemented,
};
