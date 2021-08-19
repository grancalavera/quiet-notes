import { Button, Checkbox } from "@blueprintjs/core";
import { useState } from "react";
import { Column, useTable } from "react-table";
import { block } from "../app/bem";
import { useUserList } from "../user-service/user-service";
import { QNRole, QNUserRecord } from "../user-service/user-service-model";
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

interface ToggleRole {
  role: QNRole;
  enabled: boolean;
  uid: string;
}

const CheckboxCell = ({ value }: { value: ToggleRole }) => {
  const [checked, setChecked] = useState(value.enabled);

  return (
    <Checkbox checked={checked} onChange={() => setChecked((current) => !current)} />
  );
};

const columns: Column<QNUserRecord>[] = [
  { Header: "Email", accessor: (x) => x.email },
  { Header: "Created", accessor: (x) => x.metadata.creationTime },
  { Header: "Signed In", accessor: (x) => x.metadata.lastSignInTime },
  { Header: "User UID", accessor: (x) => x.uid },
  {
    Header: "Author",
    accessor: (x): ToggleRole => ({
      uid: x.uid,
      role: "author",
      enabled: x.customClaims.roles.includes("author"),
    }),
    Cell: CheckboxCell,
  },
  {
    Header: "Admin",
    accessor: (x): ToggleRole => ({
      uid: x.uid,
      role: "admin",
      enabled: x.customClaims.roles.includes("admin"),
    }),
    Cell: CheckboxCell,
  },
];
