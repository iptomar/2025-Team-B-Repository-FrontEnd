// columns-horarios.ts
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import type { Horario } from '../interfaces';
import { Check, X } from 'lucide-vue-next';

export const getColumnsHorarios = (onRefresh: () => void): ColumnDef<Horario>[] => [
  {
    accessorKey: "inicio",
    header: "Início",
    cell: ({ row }) =>
      h("div", row.original.inicio.slice(0, 16).replace("T", " ")), // formatação básica
  },
  {
    accessorKey: "fim",
    header: "Fim",
    cell: ({ row }) =>
      h("div", row.original.fim.slice(0, 16).replace("T", " ")),
  },
  {
    accessorKey: "turma.curso.curso",
    header: "Curso",
    cell: ({ row }) => h("div", row.original.turma.curso.curso),
  },
  {
    accessorKey: "turma.letra",
    header: "Turma",
    cell: ({ row }) => h("div", row.original.turma.letra),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Ações",
    cell: ({ row }) =>
      h("div", { class: "flex gap-2" }, [
        h("button", { 
          class: "p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors",
          onClick: () => {
            // Função temporária para aprovar
            console.log("Aprovar horário:", row.original.id);
            onRefresh();
          }
        }, [
          h(Check, { class: "w-4 h-4" })
        ]),
        h("button", { 
          class: "p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors",
          onClick: () => {
            // Função temporária para rejeitar
            console.log("Rejeitar horário:", row.original.id);
            onRefresh();
          }
        }, [
          h(X, { class: "w-4 h-4" })
        ])
      ]),
  },
];
