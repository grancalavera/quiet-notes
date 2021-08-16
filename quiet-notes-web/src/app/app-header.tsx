import { Button, H3, Icon, Popover } from "@blueprintjs/core";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { ToggleThemeButton } from "../theme/theme";
import { useTheme } from "../theme/use-theme";
import "./app-header.scss";
import { useIsAdmin, useUser } from "./app-state";
import { useBlock } from "./bem";

export const AppHeader = () => {
  const b = useBlock("header");
  const history = useHistory();

  return (
    <div className={b()}>
      <H3 className={b("app-title").toString()} onClick={() => history.push("/")}>
        Quiet Notes
      </H3>

      <span className={b("toolbar")}>
        <AdminLink />
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
  const b = useBlock("avatar");
  const size = props.size ?? 30;
  const user = useUser();

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
  const user = useUser();

  const content = (
    <div className={b("content")}>
      <ToggleThemeButton className={b("theme-switch")} />
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
    <Popover
      className={b()}
      content={content}
      position="bottom-right"
      // Under normal circumstances Popover inherits the theme from the container, but
      // since we're using this popover to also change the theme, it doesn't always pick
      // up the correct theme. Closing and reopening it forces it to pick up the theme,
      // but is unacceptable having the wrong theme for a bit. See:
      // https://blueprintjs.com/docs/versions/4/#core/components/popover.dark-theme
      popoverClassName={useTheme((s) => s.className)}
    >
      <Avatar />
    </Popover>
  );
};
