import { Button, Checkbox } from "@blueprintjs/core";
import { useState } from "react";
import { Column, useTable } from "react-table";
import { block } from "../app/bem";
import { useToggleRole, useUserList } from "../user-service/user-service";
import { QNToggleRole, QNUserRecord } from "../user-service/user-service-model";
import "./admin.scss";

const b = block("admin");

export const Admin = () => {
  const { data, refetch, isLoading } = useUserList();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data?.users ?? [],
  });

  return (
    <div className={b()}>
      <div className={b("toolbar")}>
        <Button
          loading={isLoading}
          onClick={refetch}
          icon="refresh"
          minimal
          style={{ position: "sticky" }}
        />
      </div>
      <div className={b("user-list")}>
        <table {...getTableProps()}>
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
        </table>
      </div>
    </div>
  );
};

const CheckboxCell = ({ value }: { value: QNToggleRole }) => {
  const [checked, setChecked] = useState(value.enabled);
  const { mutate: toggleRole } = useToggleRole();

  return (
    <Checkbox
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

const columns: Column<QNUserRecord>[] = [
  { Header: "Email", accessor: (x) => x.email },
  { Header: "Created", accessor: (x) => x.metadata.creationTime },
  { Header: "Signed In", accessor: (x) => x.metadata.lastSignInTime },
  { Header: "User UID", accessor: (x) => x.uid },
  {
    Header: "Author",
    accessor: (x): QNToggleRole => ({
      email: x.email ?? "",
      role: "author",
      enabled: x.customClaims.roles.includes("author"),
    }),
    Cell: CheckboxCell,
  },
  {
    Header: "Admin",
    accessor: (x): QNToggleRole => ({
      email: x.email ?? "",
      role: "admin",
      enabled: x.customClaims.roles.includes("admin"),
    }),
    Cell: CheckboxCell,
  },
];
