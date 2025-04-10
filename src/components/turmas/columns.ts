import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DropdownAction from './data-table-dropdown.vue'
import type { Turma } from '../cursos/columns'

export const columns: ColumnDef<Turma>[] = [
{
    accessorKey: 'ano',
    header: ({ column }) => {
      return h(
        'button',
        {
          class: 'flex items-center space-x-2 bg-white hover:border-iptGreen',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        [
          h('span', 'Ano'),
          h('svg', { class: 'ml-2 h-4 w-4', viewBox: '0 0 24 24' }, [
            h('path', { d: 'M7 10l5 5 5-5H7z', fill: 'currentColor' })
          ])
        ]
      )
    },
    cell: ({ row }) => h('div', { class: 'ml-2 text-left font-semibold' }, row.getValue('ano')),
  },
  {
    accessorKey: 'turma',
    header: ({ column }) => {
      return h(
        'button',
        {
          class: 'flex items-center space-x-2 bg-white hover:border-iptGreen',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        [
          h('span', 'Turma'),
          h('svg', { class: 'ml-2 h-4 w-4', viewBox: '0 0 24 24' }, [
            h('path', { d: 'M7 10l5 5 5-5H7z', fill: 'currentColor' })
          ])
        ]
      )
    },
    cell: ({ row }) => h('div', { class: 'ml-2 text-left' }, row.getValue('turma')),
  },
  {
    accessorKey: 'semestre',
    header: ({ column }) => {
      return h(
        'button',
        {
          class: 'flex items-center space-x-2 bg-white hover:border-iptGreen',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        [
          h('span', 'Semestre'),
          h('svg', { class: 'ml-2 h-4 w-4', viewBox: '0 0 24 24' }, [
            h('path', { d: 'M7 10l5 5 5-5H7z', fill: 'currentColor' })
          ])
        ]
      )
    },
    cell: ({ row }) => h('div', { class: 'ml-2 text-left' }, row.getValue('semestre')),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const turma = row.original as Turma
      return h(
        'div',
        {
          class: 'relative text-right',
          onClick: (event: Event) => event.stopPropagation(),
        },
        h(DropdownAction, { turma })
      )
    },
  },
]