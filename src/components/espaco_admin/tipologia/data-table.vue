<!-- @/components/espaco_admin/tipologia/data-table.vue -->
<script setup lang="ts" generic="TData, TValue">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import DropdownAction from './data-table-dropdown.vue'
import { getTipologias, createTipologia } from '@/api/tipologias'
import type { Tipologia } from '@/components/interfaces'

const props = defineProps<{
  columns: ColumnDef<TData & { id: number }, TValue>[]
}>()

const router = useRouter()
const showAddModal = ref(false)
const novaTipologia = ref({
  tipologia: ''
})
const data = ref<Tipologia[]>([])

const fetchData = async () => {
  try {
    data.value = await getTipologias()
  } catch (error) {
    console.error('Erro ao buscar tipologias:', error)
  }
}

onMounted(() => {
  fetchData()
})

const handleSubmit = async () => {
  try {
    await createTipologia(novaTipologia.value)
    await fetchData()
    novaTipologia.value = { tipologia: '' }
    showAddModal.value = false
  } catch (error) {
    console.error('Erro ao criar tipologia:', error)
  }
}

const handleRefresh = () => {
  fetchData()
}

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const currentPage = computed(() => table.getState().pagination.pageIndex + 1)
const pageCount = computed(() => table.getPageCount())

const table = useVueTable({
  get data() { return data.value },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
  },
})
</script>

<template>
  <div class="flex flex-col h-full w-full space-y-4">
    <div class="flex items-center pb-4 w-full space-x-4">
      <div class="flex-1">
        <Input 
          class="w-full h-[2.7rem] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-iptGreen focus:border-transparent transition-colors duration-200 px-3 py-2 text-gray-700 placeholder-gray-400" 
          placeholder="Procurar por tipologia..."
          :model-value="table.getColumn('tipologia')?.getFilterValue() as string"
          @update:model-value="table.getColumn('tipologia')?.setFilterValue($event)" 
        />
      </div>

      <button 
        @click="showAddModal = true" 
        class="h-full text-white bg-iptGreen hover:bg-green-600 px-4 py-2 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:ring-offset-2 font-medium"
      >
        Adicionar Tipologia
      </button>
    </div>

    <div class="flex justify-center items-center overflow-auto border border-gray-200 rounded-md shadow-sm bg-white">
      <Table class="w-[70vw]">
        <TableHeader>
          <TableRow 
            v-for="headerGroup in table.getHeaderGroups()" 
            :key="headerGroup.id"
            class="border-b border-gray-200"
          >
            <TableHead 
              v-for="header in headerGroup.headers" 
              :key="header.id"
              class="bg-gray-50 p-3 text-left font-semibold text-gray-700 uppercase tracking-wider"
            >
              <FlexRender 
                v-if="!header.isPlaceholder" 
                :render="header.column.columnDef.header"
                :props="header.getContext()" 
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow 
              v-for="row in table.getRowModel().rows" 
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined" 
              class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <TableCell 
                v-for="cell in row.getVisibleCells()" 
                :key="cell.id" 
                class="p-3 text-gray-700"
              >
                <FlexRender 
                  v-if="cell.column.id !== 'actions'" 
                  :render="cell.column.columnDef.cell" 
                  :props="cell.getContext()" 
                />
                <DropdownAction 
                  v-else 
                  :tipologia="row.original" 
                  @refresh="handleRefresh"
                  @click.stop 
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell 
                :colspan="props.columns.length" 
                class="h-24 text-center text-gray-500 py-6"
              >
                Sem Tipologias.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-center gap-2 mt-4">
      <Button 
        class="hover:border-iptGreen border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-1 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
        variant="outline" 
        size="sm" 
        :disabled="!table.getCanPreviousPage()" 
        @click="table.previousPage()"
      >
        Anterior
      </Button>
     
      <button
        v-for="page in pageCount"
        :key="page"
        @click="table.setPageIndex(page - 1)"
        :class="[
          'px-3 py-1 border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          page === currentPage 
            ? 'bg-iptGreen text-white border-iptGreen focus:ring-iptGreen' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
        ]"
      >
        {{ page }}
      </button>

      <Button 
        class="hover:border-iptGreen border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-1 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
        variant="outline" 
        size="sm" 
        :disabled="!table.getCanNextPage()" 
        @click="table.nextPage()"
      >
        Próxima
      </Button>
    </div>

    <!-- Add Modal -->
    <div 
      v-if="showAddModal" 
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-200"
    >
      <div class="bg-white rounded-lg p-6 w-96 shadow-xl transform transition-all duration-200">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Adicionar Tipologia</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">Nome da Tipologia</label>
            <input 
              v-model="novaTipologia.tipologia" 
              type="text" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:border-transparent transition-colors duration-200" 
              required 
            />
          </div>

          <div class="flex justify-center space-x-3">
            <button 
              type="submit" 
              class="px-4 py-2 text-white bg-iptGreen hover:bg-green-600 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:ring-offset-2 font-medium"
            >
              Adicionar
            </button>
            <button 
              type="button" 
              @click="showAddModal = false" 
              class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>