import { Button, H3, Icon, Popover } from "@blueprintjs/core";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { useTheme } from "../theme/use-theme";
import "./app-header.scss";
import { useIsAdmin, useUser } from "./app-state";
import { block } from "./bem";

const b = block("app-header");

export const AppHeader = () => {
  const history = useHistory();

  return (
    <div className={b("header")}>
      <H3 className={b("app-title").toString()} onClick={() => history.push("/")}>
        Quiet Notes
      </H3>

      <span className={b("toolbar")}>
        <AdminLink />
        <ToggleThemeButton className={b("theme-switch")} />
        <Profile />
      </span>
    </div>
  );
};

const AdminLink = () => {
  const history = useHistory();
  const [isAdmin] = useIsAdmin();

  return (
    <>{isAdmin && <Button icon="cog" minimal onClick={() => history.push("/admin")} />}</>
  );
};

const Avatar = (props: { size?: number }) => {
  const size = props.size ?? 30;
  const user = useUser();

  return user?.photoURL ? (
    <span
      className={b("avatar")}
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
  const user = useUser();

  const content = (
    <div className={b("profile")}>
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
      <Button onClick={() => firebase.auth().signOut()}>Sign Out</Button>
    </div>
  );

  return (
    <Popover className={b()} content={content} position="bottom-right">
      <Avatar />
    </Popover>
  );
};

const ToggleThemeButton = (props: { className?: string }) => {
  const [theme, toggleTheme] = useTheme((s) => [s.theme, s.toggle]);

  return (
    <Button
      icon={theme === "dark" ? "flash" : "moon"}
      className={props.className?.toString()}
      minimal
      onClick={toggleTheme}
    />
  );
};
