import { Button, Checkbox, HTMLTable } from "@blueprintjs/core";
import { QNRole, QNToggleRole, QNUserRecord } from "quiet-notes-lib";
import { useEffect, useState } from "react";
import { Column, useTable } from "react-table";
import { block } from "../app/bem";
import { useToggleRole, useUserList } from "../user-service/user-service";
import "./admin.scss";

const b = block("admin");

export const Admin = () => {
  const { data, refetch, isLoading } = useUserList();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data?.users ?? [],
    getRowId: (x) => x.uid,
  });

  return (
    <div className={b()}>
      <div className={b("toolbar")}>
        <Button loading={isLoading} onClick={refetch} icon="refresh" minimal />
      </div>
      <div className={b("body")}>
        <HTMLTable {...getTableProps()} striped interactive>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </HTMLTable>
      </div>
    </div>
  );
};

const CheckboxCell = ({ value }: { value: QNToggleRole }) => {
  const [checked, setChecked] = useState(value.enabled);
  const { mutate: toggleRole } = useToggleRole();

  useEffect(() => {
    setChecked(value.enabled);
  }, [value.enabled]);

  return (
    <Checkbox
      large
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
