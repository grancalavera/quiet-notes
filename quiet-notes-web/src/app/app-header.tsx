import SettingsIcon from "@mui/icons-material/Settings";
import { Avatar, Box, Button, IconButton, Popover, Typography } from "@mui/material";
import firebase from "firebase/app";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ToggleThemeSwitch } from "../components/ToggleThemeSwitch";
import { useQNTheme, useToggleQNTheme } from "../theme/use-theme";
import "./app-header.scss";
import { useIsAdmin, useUser } from "./app-state";
import { block } from "./bem";

const b = block("app-header");

export const AppHeader = () => {
  const history = useHistory();

  return (
    <Box className={b("header").toString()}>
      <Typography
        variant="h4"
        onClick={() => history.push("/")}
        sx={{ userSelect: "none" }}
      >
        Quiet Notes
      </Typography>

      <span className={b("toolbar")}>
        <AdminLink />
        <ToggleThemeButton />
        <Profile />
      </span>
    </Box>
  );
};

const AdminLink = () => {
  const history = useHistory();
  const [isAdmin] = useIsAdmin();

  return (
    <>
      {isAdmin && (
        <IconButton onClick={() => history.push("/admin")}>
          <SettingsIcon />
        </IconButton>
      )}
    </>
  );
};

const UserAvatar = ({ size = 30 }: { size?: number }) => {
  const user = useUser();
  const photoURL = user.photoURL ?? undefined;
  const username = user.displayName ?? user.email ?? "";
  return <Avatar alt={username} src={photoURL} sx={{ width: size, height: size }} />;
};

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const user = useUser();

  const content = (
    <div className={b("profile")}>
      <UserAvatar size={80} />

      <Typography variant="body1">
        <strong>{user?.displayName}</strong>
      </Typography>

      <Typography variant="body1">
        <em>{user?.email}</em>
      </Typography>

      <Typography variant="body1">
        <em>{user?.uid}</em>
      </Typography>

      <Button onClick={() => firebase.auth().signOut()} variant="contained">
        Sign Out
      </Button>
    </div>
  );

  const open = !!anchorEl;
  const id = open ? "user-profile" : undefined;

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-describedby={id}>
        <UserAvatar />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setAnchorEl(null)}
      >
        {content}
      </Popover>
    </>
  );
};

const ToggleThemeButton = () => {
  const theme = useQNTheme();
  const toggleTheme = useToggleQNTheme();
  return <ToggleThemeSwitch checked={theme === "dark"} onChange={() => toggleTheme()} />;
};
