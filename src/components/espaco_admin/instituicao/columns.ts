import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Instituicao } from "@/components/interfaces";

export const getColumns = (
  onEdit: (instituicao: Instituicao) => void,
  onDelete: (id: number) => void,
  localidades: { id: number, localidade: string }[]
): ColumnDef<Instituicao>[] => [
  {
    accessorKey: "instituicao",
    header: ({ column }) => {
      return h(
        "button",
        {
          class:
            "flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen",
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
      h(
        "div",
        { class: "ml-2 text-left font-semibold" },
        row.getValue("instituicao")
      ),
  },
  {
    accessorKey: "localidade.localidade",
    header: ({ column }) => {
      return h(
        "button",
        {
          class:
            "flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen",
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
    id: "InstituicaoOuLocalidade",
    accessorFn: (row) => `${row.instituicao} ${row.localidade?.localidade}`,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) =>
      h(
        "div",
        {
          class: "relative text-right",
          onClick: (event: Event) => event.stopPropagation(),
        },
        h(DropdownAction, {
          instituicao: row.original,
          onEdit: () => onEdit(row.original),
          onDelete: () => onDelete(row.original.id),
          localidades: localidades,
        })
      ),
  },
];
