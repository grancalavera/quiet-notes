import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { QNToggleRole } from "quiet-notes-lib";
import { useEffect, useState, VFC } from "react";
import { block } from "../app/bem";
import { useToggleRole, useUserList } from "../user-service/user-service";
import "./admin.scss";

const b = block("admin");

export const Admin: VFC = () => {
  const { data, refetch, isLoading } = useUserList();

  return (
    <div className={b()}>
      <div className={b("toolbar")}>
        <IconButton onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="manage users">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Signed In</TableCell>
              <TableCell>UID</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(data?.users ?? []).map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.metadata.creationTime}</TableCell>
                <TableCell>{user.metadata.lastSignInTime}</TableCell>
                <TableCell>{user.uid}</TableCell>
                <TableCell>
                  <CheckboxCell
                    value={{
                      email: user.email ?? "",
                      role: "author",
                      enabled: user.customClaims.roles.includes("author"),
                    }}
                  />
                </TableCell>
                <TableCell>
                  <CheckboxCell
                    value={{
                      email: user.email ?? "",
                      role: "admin",
                      enabled: user.customClaims.roles.includes("admin"),
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const CheckboxCell: VFC<{ value: QNToggleRole }> = ({ value }) => {
  const [checked, setChecked] = useState(value.enabled);
  const { mutate: toggleRole } = useToggleRole();

  useEffect(() => {
    setChecked(value.enabled);
  }, [value.enabled]);

  return (
    <Checkbox
      inputProps={{ "aria-label": `Toggle ${value.role} role` }}
      checked={checked}
      onChange={() => {
        setChecked((current) => {
          const enabled = !current;
          toggleRole({ ...value, enabled });
          return enabled;
        });
      }}
    />
  );
};
