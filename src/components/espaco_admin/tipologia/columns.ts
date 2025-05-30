import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "./data-table-dropdown.vue";
import type { Tipologia } from "@/components/interfaces";

export function createColumns(onUpdate: () => void) {
  return [
    {
      accessorKey: "tipologia",
      header: ({ column }) => {
        return h(
          "button",
          {
            class:
              "flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen",
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
      cell: ({ row }: any) =>
        h("div", { class: "ml-2 text-left font-semibold" }, row.getValue("tipologia")),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        return h(
          "div",
          {
            class: "relative text-right",
            onClick: (event: Event) => event.stopPropagation(),
          },
          h(DropdownAction, {
            tipologia: row.original,
            onTipologiaAtualizada: onUpdate,
          })
        );
      },
    },
  ] as ColumnDef<Tipologia>[];
}