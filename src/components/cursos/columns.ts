import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Curso } from "../interfaces";
import { userIsAdmin } from '@/utils/user-utils.js'; // Importe a função userIsAdmin

export const getColumns = (onRefresh: () => void, userRoles: any): ColumnDef<Curso>[] => {
  // Colunas base (sempre presentes)
  const baseColumns: ColumnDef<Curso>[] = [
    {
      accessorKey: "curso",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Curso"),
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
          row.getValue("curso")
        ),
    },
    {
      accessorKey: "instituicao.instituicao",
      header: ({ column }) => {
        return h(
          "button",
          {
            class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          [
            h("span", "Instituição"),
            h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
              h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
            ]),
          ]
        );
      },
      cell: ({ row }) =>
        h("div", { class: "ml-2 text-left" }, row.original.instituicao?.instituicao),
    },
    {
      accessorKey: "professor.userName",
      header: () => h("div", "Professor Responsável"),
      cell: ({ row }) =>
        h("div", { class: "text-left" }, row.original.professor?.userName),
    },
    {
      accessorKey: "anoLetivoFK",
      header: "Ano Letivo",
      cell: ({ row }) => h("div", {}, row.getValue("anoLetivoFK")),
    },
  ];

  // Adiciona coluna de ações apenas se o usuário for admin
  if (userIsAdmin(userRoles)) {
    baseColumns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const curso = row.original as Curso;
        return h(
          "div",
          {
            class: "relative text-right",
            onClick: (event: Event) => event.stopPropagation(),
          },
          h(DropdownAction, {
            curso,
            onRefresh,
          })
        );
      },
    });
  }

  return baseColumns;
};