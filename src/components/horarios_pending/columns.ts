// columns-horarios.ts
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import type { Horario } from '../interfaces';
import { Check, X } from 'lucide-vue-next';
import { API_BASE_URL } from '@/api/api';

async function aproveHorario(horarioId: number) {
  console.log("Aprovando horário com ID:", horarioId);
  const response = await fetch(
    `${API_BASE_URL}/Horarios/SetStatus/${horarioId}/2`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response;
}

async function rejectHorario(horarioId: number) {
  console.log("Rejeitando horário com ID:", horarioId);
  const response = await fetch(
    `${API_BASE_URL}/Horarios/SetStatus/${horarioId}/3`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response;
}

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
            aproveHorario(row.original.id)
              .then(() => {
                console.log("Horário aprovado com sucesso");
                onRefresh();
                console.log("onRefresh chamado após aprovação");
              })
              .catch(error => {
                console.error("Erro ao aprovar horário:", error);
              });
          }
        }, [
          h(Check, { class: "w-4 h-4" })
        ]),
        h("button", { 
          class: "p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors",
          onClick: () => {
            rejectHorario(row.original.id)
              .then(() => {
                console.log("Horário rejeitado com sucesso");
                onRefresh();
              })
              .catch(error => {
                console.error("Erro ao rejeitar horário:", error);
              });
          }
        }, [
          h(X, { class: "w-4 h-4" })
        ])
      ]),
  },
];