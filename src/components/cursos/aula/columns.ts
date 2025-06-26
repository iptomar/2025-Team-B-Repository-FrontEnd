import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Aula } from "../../interfaces";
import { canSubmit, parseJwt } from '@/utils/user-utils.js';

export const getAulas = (
  onRefresh: () => void,
  cursoId: number,
  professoresNoCurso: { id: string; userName: string }[],
  semestreCadeira: number,
  anoCadeira: number, 
  professorId: string
): ColumnDef<Aula>[] => {
  // Obter roles do usuário
  let userRoles: string[] = [];
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = parseJwt(token);
    userRoles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
  }

  // Colunas base (sempre presentes)
  const baseColumns: ColumnDef<Aula>[] = [
    {
      accessorKey: "tipologia.tipologia",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Tipologia"),
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
          row.original.tipologia.tipologia
        ),
    },
    {
      accessorKey: "professor.userName",
      header: () => h("div", "Professor"),
      cell: ({ row }) =>
        h("div", { class: "text-left" }, row.original.professor.userName),
    },
    {
      accessorKey: "turma.letra",
      header: () => h("div", "Turma"),
      cell: ({ row }) => {
        return h("div", { class: "text-left" }, row.original.turma.letra);
      },
    },
    {
      accessorKey: "duracao",
      header: () => h("div", "Duração"),
      cell: ({ row }) => {
        const raw = row.getValue("duracao") as string;
        const [hh, mm] = raw.split(":");
        return h("div", { class: "text-left" }, `${hh}:${mm}`);
      },
    },
  ];

  // Adiciona coluna de ações apenas se o usuário tiver permissão
  if (canSubmit(userRoles, professorId)) {
    baseColumns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const aula = row.original as Aula;
        return h(
          "div",
          {
            class: "relative text-right",
            onClick: (event: Event) => event.stopPropagation(),
          },
          h(DropdownAction, { 
            aula, 
            cursoId, 
            professoresNoCurso, 
            onRefresh, 
            semestreCadeira, 
            anoCadeira 
          })
        );
      },
    });
  }

  return baseColumns;
};