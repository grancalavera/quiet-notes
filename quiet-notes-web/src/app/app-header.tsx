import { Button, H3, Popover } from "@blueprintjs/core";
import { Avatar } from "@mui/material";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { useQNTheme, useToggleQNTheme } from "../theme/use-theme";
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

const UserAvatar = ({ size = 30 }: { size?: number }) => {
  const user = useUser();
  const photoURL = user.photoURL ?? undefined;
  const username = user.displayName ?? user.email ?? "";
  return <Avatar alt={username} src={photoURL} sx={{ width: size, height: size }} />;
};

const Profile = () => {
  const user = useUser();

  const content = (
    <div className={b("profile")}>
      <UserAvatar size={80} />
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
      <UserAvatar />
    </Popover>
  );
};

const ToggleThemeButton = (props: { className?: string }) => {
  const theme = useQNTheme();
  const toggleTheme = useToggleQNTheme();

  return (
    <Button
      icon={theme === "dark" ? "flash" : "moon"}
      className={props.className?.toString()}
      minimal
      onClick={toggleTheme}
    />
  );
};
