import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DropdownAction from './data-table-dropdown.vue'

export interface Tipologia {
  id: number
  tipologia: string
}

export const columns: ColumnDef<Tipologia>[] = [
  {
    accessorKey: 'tipologia',
    header: ({ column }) => {
      return h(
        'button',
        {
          class: 'flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        [
          h('span', 'Tipologia'),
          h('svg', { class: 'ml-2 h-4 w-4', viewBox: '0 0 24 24' }, [
            h('path', { d: 'M7 10l5 5 5-5H7z', fill: 'currentColor' })
          ])
        ]
      )
    },
    cell: ({ row }) => h('div', { class: 'ml-2 text-left font-semibold' }, row.getValue('tipologia')),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const tipologia = row.original
      return h(
        'div',
        {
          class: 'relative text-right',
          onClick: (event: Event) => event.stopPropagation(),
        },
        h(DropdownAction, { tipologia })
      )
    },
  },
]