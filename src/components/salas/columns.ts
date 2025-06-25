import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Sala } from "../interfaces";
import { userIsAdmin, parseJwt } from '@/utils/user-utils.js'; // Importe as funções necessárias

export const getColumns = (onRefresh: () => void): ColumnDef<Sala>[] => {
  // Verificar se o usuário é admin
  let isAdmin = false;
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = parseJwt(token);
    const userRoles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
    isAdmin = userIsAdmin(userRoles);
  }

  // Colunas base (sempre presentes)
  const baseColumns: ColumnDef<Sala>[] = [
    {
      accessorKey: "sala",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Sala"),
            h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
              h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
            ]),
          ]
        );
      },
      cell: ({ row }) =>
        h("div", { class: "ml-2 text-left font-semibold" }, row.getValue("sala")),
    },
    {
      accessorKey: "localidade.localidade",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Localidade"),
            h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
              h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
            ]),
          ]
        );
      },
      cell: ({ row }) =>
        h(
          "div",
          { class: "ml-2 text-left font-semibold" },
          row.original.localidade?.localidade
        ),
    },
    {
      id: "SalaOuLocalidade",
      accessorFn: (row) => `${row.sala} ${row.localidade.localidade}`,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string;
        return value.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
  ];

  // Adiciona coluna de ações apenas se o usuário for admin
  if (isAdmin) {
    baseColumns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const sala = row.original as Sala;
        return h(
          "div",
          {
            class: "relative text-right",
            onClick: (event: Event) => event.stopPropagation(),
          },
          h(DropdownAction, { sala, onRefresh })
        );
      },
    });
  }

  return baseColumns;
};