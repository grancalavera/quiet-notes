import { signIn, useAuthState } from "../firebase/firebase";

export const App = () => {
  const [user] = useAuthState();
  return user ? <>Quiet Notes</> : <SignIn />;
};

const SignIn = () => {
  return <button onClick={signIn}>Sign In with Google</button>;
};
