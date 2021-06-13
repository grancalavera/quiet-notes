import { SignOut } from "../app/auth";
import { block } from "../app/bem";
import { useAuthState } from "../firebase/firebase";
import "./toolbar.scss";

const b = block("toolbar");

export const Toolbar = () => {
  const [user] = useAuthState();
  return user ? (
    <div className={b()}>
      {user.displayName}
      <SignOut />
    </div>
  ) : null;
};
