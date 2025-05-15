import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Aula } from "../../interfaces";

export const columns: ColumnDef<Aula>[] = [
  {
    accessorKey: "tipologia",
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
        row.getValue("tipologia")
      ),
  },
  {
    accessorKey: "professor.nome",
    header: () => h("div", "Professor"),
    cell: ({ row }) =>
      h("div", { class: "text-left" }, row.original.professor.nome),
  },
  {
    id: "turmas",
    header: () => h("div", "Turmas"),
    cell: ({ row }) => {
      const turmas = (row.original as Aula).turmas;
      const nomes = turmas.map((t) => t.turma).join(", ");
      return h("div", { class: "text-left" }, nomes);
    },
  },
  {
    accessorKey: "duração",
    header: () => h("div", "Duração"),
    cell: ({ row }) =>
      h("div", { class: "text-left" }, row.getValue("duração")),
  },
  {
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
        h(DropdownAction, { aula })
      );
    },
  },
];
