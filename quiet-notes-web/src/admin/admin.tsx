import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { QNRole, QNToggleRole, QNUserRecord } from "quiet-notes-lib";
import { useEffect, useState } from "react";
import { Column, useTable } from "react-table";
import { withSubscribe } from "../lib/with-subscribe";
import { useToggleRole, useUsers } from "./admin-state";

export const Admin = withSubscribe(() => {
  const users = useUsers();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: users,
      getRowId: (x) => x.uid,
    });

  return (
    <AdminLayout>
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
                  <TableCell key={column.id}>
                    {column.render("Header") as any}
                  </TableCell>
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
                        {cell.render("Cell") as any}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
});

interface CheckboxCellProps {
  value: QNToggleRole;
}

const CheckboxCell = ({ value }: CheckboxCellProps) => {
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

const AdminLayout = styled(Box)`
  overflow: hidden;
  height: 100%;
  padding: 0.5rem;
`;

const AdminTableLayout = styled(Box)`
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
