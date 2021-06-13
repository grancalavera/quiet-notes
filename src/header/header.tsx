import { SignOut } from "../app/auth";
import { block } from "../app/bem";
import { useAuthState } from "../firebase/firebase";
import "./header.scss";

const b = block("header");

export const Header = () => {
  const [user] = useAuthState();
  return user ? (
    <div className={b()}>
      {user.displayName}
      <SignOut />
    </div>
  ) : null;
};
