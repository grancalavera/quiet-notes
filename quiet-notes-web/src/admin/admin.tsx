import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Checkbox,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { QNRole, QNToggleRole, QNUserRecord } from "quiet-notes-lib";
import { FC, useEffect, useState, VFC } from "react";
import { Column, useTable } from "react-table";
import { block } from "../app/bem";
import { useToggleRole, useUserList } from "../user-service/user-service";
import "./admin.scss";

const b = block("admin");

export const Admin: VFC = () => {
  const { data, refetch, isLoading } = useUserList();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data?.users ?? [],
    getRowId: (x) => x.uid,
  });

  return (
    <div className={b()}>
      <div className={b("toolbar")}>
        <IconButton onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </div>

      <TableContainer component={QNTableContainer}>
        <Table
          aria-label="manage users"
          sx={{ backgroundColor: "background.paper" }}
          {...getTableProps()}
        >
          <TableHead sx={{ backgroundColor: "background.paper" }}>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell>{column.render("Header")}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const QNTableContainer: FC = ({ children }) => (
  <div className={b("body")}>{children}</div>
);

interface CheckboxCellProps {
  value: QNToggleRole;
}

const CheckboxCell: VFC<CheckboxCellProps> = ({ value }) => {
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

const toggleRoleAccessor =
  (role: QNRole) =>
  (user: QNUserRecord): QNToggleRole => ({
    email: user.email ?? "",
    role,
    enabled: user.customClaims.roles.includes(role),
  });

const columns: Column<QNUserRecord>[] = [
  { Header: "Email", accessor: (x) => x.email },
  {
    Header: "Author",
    accessor: toggleRoleAccessor("author"),
    Cell: CheckboxCell,
  },
  {
    Header: "Admin",
    accessor: toggleRoleAccessor("admin"),
    Cell: CheckboxCell,
  },
  { Header: "Created", accessor: (x) => x.metadata.creationTime },
  { Header: "Signed In", accessor: (x) => x.metadata.lastSignInTime },
  { Header: "User UID", accessor: (x) => x.uid },
];
