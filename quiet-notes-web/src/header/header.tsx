import { Button, H3, Icon } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useBlock } from "../app/bem";
import { useTheme } from "../app/use-theme";
import { signOut, useAuthState } from "../firebase/firebase";
import "./header.scss";

export const Header = () => {
  const [user] = useAuthState();
  const b = useBlock("header");

  return user ? (
    <div className={b()}>
      <H3>
        Quiet Notes <span>({process.env.NODE_ENV})</span>
      </H3>
      <Profile />
    </div>
  ) : null;
};

const Avatar = (props: { size?: number }) => {
  const b = useBlock("avatar");
  const size = props.size ?? 30;
  const [user] = useAuthState();

  return user?.photoURL ? (
    <span
      className={b()}
      style={{
        backgroundImage: `url(${user.photoURL})`,
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    ></span>
  ) : (
    <Icon icon="user" iconSize={size} />
  );
};

const Profile = () => {
  const b = useBlock("profile");
  const [theme, toggleTheme] = useTheme((s) => [s.theme, s.toggle]);

  const [user] = useAuthState();

  const content = (
    <div className={b("content").mix("bp3-running-text")}>
      <Button
        icon={theme === "dark" ? "flash" : "moon"}
        className={b("theme-switch")}
        minimal
        onClick={toggleTheme}
      />
      <Avatar size={80} />
      <p>
        <strong>{user?.displayName}</strong>
      </p>
      <p>
        <em>{user?.email}</em>
      </p>
      <p>
        <em>{user?.uid}</em>
      </p>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );

  return (
    <Popover2 className={b().toString()} content={content} position="bottom-right">
      <Avatar />
    </Popover2>
  );
};
