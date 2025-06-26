import { h, ref } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Cadeira } from "../../interfaces";
import { canSubmit, parseJwt } from '@/utils/user-utils.js'

const userRoles = ref<string[]>([]);
const token = localStorage.getItem('token');

if (token) {
  const decodedToken = parseJwt(token);
  userRoles.value = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
}

export const getCadeiras = (
  onRefresh: () => void,
  cursoId: number, 
  professorId: string
): ColumnDef<Cadeira>[] => {
  // Colunas base (sempre presentes)
  const baseColumns: ColumnDef<Cadeira>[] = [
    {
      accessorKey: "cadeira",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Cadeira"),
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
          row.getValue("cadeira")
        ),
    },
    {
      accessorKey: "ano",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Ano"),
            h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
              h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
            ]),
          ]
        );
      },
      cell: ({ row }) =>
        h("div", { class: "ml-2 text-left" }, row.getValue("ano")),
    },
    {
      accessorKey: "semestre",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Período"),
            h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
              h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
            ]),
          ]
        );
      },
      cell: ({ row }) => {
        const semestre = row.getValue("semestre");
        const texto = semestre === 3 ? "Anual" : `${semestre}º Semestre`;
        return h("div", { class: "ml-2 text-left" }, texto);
      },
    },
    {
      accessorKey: "ects",
      header: () => h("div", "ECTS"),
      cell: ({ row }) => h("div", { class: "text-left" }, row.getValue("ects")),
    },
  ];

  // Adiciona coluna de ações apenas se o usuário tiver permissão
  if (canSubmit(userRoles.value, professorId)) {
    baseColumns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const cadeira = row.original as Cadeira;
        return h(
          "div",
          {
            class: "relative text-right",
            onClick: (event: Event) => event.stopPropagation(),
          },
          h(DropdownAction, { cadeira, cursoId, onRefresh })
        );
      },
    });
  }

  return baseColumns;
};