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
import { styled } from "@mui/material/styles";
import { QNRole, QNToggleRole, QNUserRecord } from "quiet-notes-lib";
import { useEffect, useState, VFC } from "react";
import { Column, useTable } from "react-table";
import { useAnyRoleUpdated } from "../auth/auth-state";
import { useToggleRole, useUserList } from "../services/admin-service";

export const Admin: VFC = () => {
  const { data, refetch, isLoading } = useUserList();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data?.users ?? [],
    getRowId: (x) => x.uid,
  });

  const someRoleUpdated = useAnyRoleUpdated();

  useEffect(() => {
    refetch();
  }, [someRoleUpdated]);

  return (
    <AdminLayout>
      <ToolbarLayout>
        <IconButton onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </ToolbarLayout>

      <TableContainer component={AdminTableLayout}>
        <Table
          aria-label="manage users"
          sx={{ backgroundColor: "background.paper" }}
          {...getTableProps()}
        >
          <TableHead sx={{ backgroundColor: "background.paper" }}>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column.id}>{column.render("Header")}</TableCell>
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
                    return <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
};

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

const AdminLayout = styled("div")`
  overflow: hidden;
  height: 100%;
  padding: 0.5rem;
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 0.5rem;
`;

const ToolbarLayout = styled("div")`
  display: flex;
  justify-content: flex-end;
`;

const AdminTableLayout = styled("div")`
  overflow-y: auto;
  overflow-x: hidden;

  & table {
    width: 100%;

    thead {
      position: sticky;
      z-index: 1;
      top: 0;
    }
  }
`;
