import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";

export interface Curso {
  id: number;
  curso: string;
  grau: string;
  instituicao: string;
  respProf: string;
  anoLetivo: string;
  cadeiras: Cadeira[];
  turmas: Turma[]
}

export interface Cadeira {
  id: number;
  nome: string;
  ano: number;
  semestre: number;
  ects: number;
}

export interface Turma {
  id: number;
  ano: number;
  turma: string;
  semestre: number;
}

export const columns: ColumnDef<Curso>[] = [
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
    accessorKey: "instituicao",
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
      h("div", { class: "ml-2 text-left" }, row.getValue("instituicao")),
  },
  {
    accessorKey: "grau",
    header: ({ column }) => {
      return h(
        "button",
        {
          class: "flex items-center space-x-2 bg-white hover:border-iptGreen",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        [
          h("span", "Grau"),
          h("svg", { class: "ml-2 h-4 w-4", viewBox: "0 0 24 24" }, [
            h("path", { d: "M7 10l5 5 5-5H7z", fill: "currentColor" }),
          ]),
        ]
      );
    },
    cell: ({ row }) =>
      h("div", { class: "ml-2 text-left" }, row.getValue("grau")),
  },
  {
    accessorKey: "respProf",
    header: () => h("div", "Professor Responsável"),
    cell: ({ row }) =>
      h("div", { class: "text-left" }, row.getValue("respProf")),
  },
  {
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
        h(DropdownAction, { curso })
      );
    },
  },
  {
    id: "cursoOuGrau",
    accessorFn: (row) => `${row.curso} ${row.grau}`,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "anoLetivo",
    header: "Ano Letivo",
    cell: ({ row }) => h("div", {}, row.getValue("anoLetivo")),
  },
];
