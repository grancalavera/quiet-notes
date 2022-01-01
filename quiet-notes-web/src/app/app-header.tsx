import SettingsIcon from "@mui/icons-material/Settings";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useIsAdmin, useUser } from "../auth/auth-state";
import { ToggleThemeSwitch } from "./toggle-theme-switch";
import { authService } from "../services/auth-service";
import { useAppTheme, useToggleAppTheme } from "./use-app-theme";

export const AppHeader = () => {
  const history = useHistory();

  return (
    <HeaderLayout sx={{ backgroundColor: "divider" }}>
      <Typography
        variant="h4"
        onClick={() => history.push("/")}
        sx={{ userSelect: "none", cursor: "pointer" }}
      >
        Quiet Notes
      </Typography>
      <ToolbarLayout direction="row" spacing={1}>
        <AdminLink />
        <ToggleThemeButton />
        <Profile />
      </ToolbarLayout>
    </HeaderLayout>
  );
};

const AdminLink = () => {
  const history = useHistory();
  const isAdmin = useIsAdmin();

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
    <ProfileLayout spacing={1}>
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

      <Button onClick={() => authService.signOut()} variant="contained">
        Sign Out
      </Button>
    </ProfileLayout>
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
  const theme = useAppTheme();
  const toggleTheme = useToggleAppTheme();
  return <ToggleThemeSwitch checked={theme === "dark"} onChange={() => toggleTheme()} />;
};

const HeaderLayout = styled(Box)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileLayout = styled(Stack)`
  display: flex;
  align-items: center;
  justify-items: center;
  padding-top: 2rem;
  padding-right: 3rem;
  padding-left: 3rem;
  position: relative;
  padding-bottom: 2.5rem;
`;

const ToolbarLayout = styled(Stack)`
  align-items: center;
`;
