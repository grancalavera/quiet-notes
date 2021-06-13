import { signIn, signOut } from "../firebase/firebase";

export const SignIn = () => {
  return <button onClick={signIn}>Sign In with Google</button>;
};

export const SignOut = () => {
  return <button onClick={signOut}>Sign Out</button>;
};
