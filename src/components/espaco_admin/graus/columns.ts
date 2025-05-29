import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DropdownAction from './data-table-dropdown.vue'
import type { Grau } from '@/components/interfaces'

export const columns: ColumnDef<Grau>[] = [
  {
    accessorKey: 'grau',
    header: ({ column }) => {
      return h(
        'button',
        {
          class: 'flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        [
          h('span', 'Grau Académico'),
          h('svg', { class: 'ml-2 h-4 w-4', viewBox: '0 0 24 24' }, [
            h('path', { d: 'M7 10l5 5 5-5H7z', fill: 'currentColor' })
          ])
        ]
      )
    },
    cell: ({ row }) => h('div', { class: 'ml-2 text-left font-semibold' }, row.getValue('grau')),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const grau = row.original
      return h(
        'div',
        {
          class: 'relative text-right',
          onClick: (event: Event) => event.stopPropagation(),
        },
        h(DropdownAction, { grau })
      )
    },
  },
]