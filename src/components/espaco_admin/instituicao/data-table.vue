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

const props = defineProps<{
  columns: ColumnDef<TData & { id: string }, TValue>[]
  data: (TData & { id: string })[]
}>()

const router = useRouter()
const showAddModal = ref(false)
const novaInstituicao = ref({
  instituicao: '',
  localidade: ''
})

const localidades = ['Tomar', 'Torres Novas', 'Abrantes'] // Should match your API data

const handleSubmit = () => {
  console.log(novaInstituicao.value)
  showAddModal.value = false
}

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const currentPage = computed(() => table.getState().pagination.pageIndex + 1)
const pageCount = computed(() => table.getPageCount())

const table = useVueTable({
  get data() { return props.data },
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
  <div class="flex flex-col h-full w-full">
    <div class="flex items-center pb-4 w-full space-x-4">
      <div class="flex-1">
        <Input 
          class="w-full h-[2.7rem]" 
          placeholder="Procurar por instituição..."
          :model-value="table.getColumn('instituicao')?.getFilterValue() as string"
          @update:model-value="table.getColumn('instituicao')?.setFilterValue($event)" 
        />
      </div>
      
      <div class="flex-1">
        <Input 
          class="w-full h-[2.7rem]" 
          placeholder="Procurar por localidade..."
          :model-value="table.getColumn('localidade')?.getFilterValue() as string"
          @update:model-value="table.getColumn('localidade')?.setFilterValue($event)" 
        />
      </div>

      <button 
        @click="showAddModal = true" 
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2"
      >
        Adicionar Instituição
      </button>
    </div>

    <div class="flex justify-center items-center overflow-auto border rounded-md">
      <Table class="w-[70vw]">
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id"
              class="bg-gray-100 p-2 text-left font-semibold">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined" class="hover:bg-gray-50">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-2">
                <FlexRender v-if="cell.column.id !== 'actions'" :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                <DropdownAction v-else :instituicao="row.original" @click.stop />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="props.columns.length" class="h-24 text-center">
                Sem Instituições.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-center gap-2 mt-4">
      <Button class="hover:border-iptGreen" variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
        Anterior
      </Button>
     
      <button
        v-for="page in pageCount"
        :key="page"
        @click="table.setPageIndex(page - 1)"
        :class="[
          'px-3 py-1 hover:border-iptGreen rounded',
          page === currentPage ? 'bg-iptGreen text-white' : 'bg-white'
        ]"
      >
        {{ page }}
      </button>

      <Button class="hover:border-iptGreen" variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
        Próxima
      </Button>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h2 class="text-xl mb-4">Adicionar Instituição</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block mb-1">Nome da Instituição</label>
            <input v-model="novaInstituicao.instituicao" type="text" class="w-full border border-gray-300 rounded px-2 py-1" required />
          </div>
          
          <div class="mb-4">
            <label class="block mb-1">Localidade</label>
            <select v-model="novaInstituicao.localidade" class="w-full border border-gray-300 rounded px-2 py-1" required>
              <option value="">Selecione a localidade</option>
              <option v-for="localidade in localidades" :key="localidade" :value="localidade">{{ localidade }}</option>
            </select>
          </div>

          <div class="flex justify-center space-x-2">
            <button type="submit" class="px-4 py-2 text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen rounded">
              Adicionar
            </button>
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400 rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>