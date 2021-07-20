import { Button, Classes, H3, Icon, Popover } from "@blueprintjs/core";
import { useBlock } from "../app/bem";
import { signOut, useAuthState } from "../firebase/firebase";
import { ToggleThemeButton } from "../theme/theme";
import { useTheme } from "../theme/use-theme";
import "./notebook-header.scss";
import { useNotebookState } from "./notebook-local-state";

export const Header = () => {
  const [user] = useAuthState();
  const b = useBlock("header");
  const errors = useNotebookState((s) => s.errors);
  const dismissError = useNotebookState((s) => s.dismissError);

  return user ? (
    <div className={b()}>
      <H3>Quiet Notes</H3>
      <span className={[Classes.SMALL].join(" ")}>
        {errors.length > 0 && JSON.stringify(errors, null, 2)}
        {errors.length > 0 && <Button onClick={() => dismissError()}>Clear</Button>}
      </span>
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

  const [user] = useAuthState();

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
      <Button onClick={signOut}>Sign Out</Button>
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
