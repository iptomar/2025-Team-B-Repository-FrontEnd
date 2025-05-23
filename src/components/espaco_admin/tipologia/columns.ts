// @/components/espaco_admin/tipologia/columns.ts
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DropdownAction from './data-table-dropdown.vue'
import type { Tipologia } from '@/components/interfaces'

export const columns: ColumnDef<Tipologia>[] = [
  {
    accessorKey: 'tipologia',
    header: ({ column }) => {
      return h(
        'button',
        {
          class: 'flex items-center space-x-2 font-semibold bg-white hover:border-iptGreen focus:outline-none focus:ring-2 focus:ring-iptGreen focus:ring-opacity-50 transition-colors duration-200',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        [
          h('span', 'Tipologia'),
          h('svg', { 
            class: 'ml-2 h-4 w-4 transition-transform duration-200 transform', 
            viewBox: '0 0 24 24',
            ':class': "{ 'rotate-180': column.getIsSorted() === 'asc' }"
          }, [
            h('path', { d: 'M7 10l5 5 5-5H7z', fill: 'currentColor' })
          ])
        ]
      )
    },
    cell: ({ row }) => h('div', { 
      class: 'ml-2 text-left font-semibold text-gray-800 hover:text-iptGreen transition-colors duration-200' 
    }, row.getValue('tipologia')),
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