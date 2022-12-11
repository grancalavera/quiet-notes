import { Alert, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import { useRegisterSW } from "virtual:pwa-register/react";

export const ReloadPrompt = () => {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const [needsRefresh] = needRefresh;

  return (
    <Snackbar
      open={needsRefresh}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        severity="info"
        sx={{ width: "100%" }}
        action={
          <Button
            color="info"
            size="small"
            onClick={() => updateServiceWorker(true)}
          >
            Update
          </Button>
        }
      >
        New version available
      </Alert>
    </Snackbar>
  );
};
