import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Professor } from "../../interfaces";
import { canSubmit, parseJwt } from '@/utils/user-utils.js'; // Importe as funções necessárias

export const getProfessores = (
  onRefresh: () => void,
  cursoId: number,
  professorId: string
): ColumnDef<Professor>[] => {
  // Obter roles do usuário
  let userRoles: string[] = [];
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = parseJwt(token);
    userRoles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
  }

  // Colunas base (sempre presentes)
  const baseColumns: ColumnDef<Professor>[] = [
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Nome"),
            h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
              h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
            ]),
          ]
        );
      },
      cell: ({ row }) =>
        h("div", { class: "ml-2 text-left font-semibold" }, row.getValue("userName")),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Email"),
            h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
              h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
            ]),
          ]
        );
      },
      cell: ({ row }) =>
        h("div", { class: "ml-2 text-left font-semibold" }, row.getValue("email")),
    },
  ];

  // Adiciona coluna de ações apenas se o usuário tiver permissão
  if (canSubmit(userRoles, professorId)) {
    baseColumns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const professor = row.original as Professor;
        return h(
          "div",
          {
            class: "relative text-right",
            onClick: (event: Event) => event.stopPropagation(),
          },
          h(DropdownAction, { professor, cursoId, onRefresh })
        );
      },
    });
  }

  return baseColumns;
};