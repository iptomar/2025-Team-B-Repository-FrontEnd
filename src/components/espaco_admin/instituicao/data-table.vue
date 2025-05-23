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
import { getInstituicoes, createInstituicao, deleteInstituicao, updateInstituicao } from '@/api/instituicoes'
import { getLocalidades } from '@/api/localidades'
import type { Instituicao } from '@/components/interfaces'

const props = defineProps<{
  columns: ColumnDef<TData & { id: string }, TValue>[]
}>()

const data = ref<Instituicao[]>([])
const localidades = ref<{id: number, localidade: string}[]>([])

const fetchData = async () => {
  try {
    data.value = await getInstituicoes()
    localidades.value = await getLocalidades()
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

onMounted(() => {
  fetchData()
})

const router = useRouter()
const showAddModal = ref(false)
const novaInstituicao = ref({
  instituicao: '',
  localidadeFK: 0
})

const handleAddInstituicao = async () => {
  try {
    await createInstituicao({
      instituicao: novaInstituicao.value.instituicao,
      localidadeFK: novaInstituicao.value.localidadeFK
    })
    await fetchData()
    showAddModal.value = false
    novaInstituicao.value = { instituicao: '', localidadeFK: 0 }
  } catch (error) {
    console.error('Erro ao adicionar instituição:', error)
  }
}

const handleDeleteInstituicao = async (id: number) => {
  try {
    await deleteInstituicao(id)
    await fetchData()
  } catch (error) {
    console.error('Erro ao deletar instituição:', error)
  }
}

const showEditModal = ref(false)
const editItem = ref<Instituicao | null>(null)

const handleEditInstituicao = async () => {
  if (!editItem.value) return
  
  try {
    await updateInstituicao(editItem.value.id, {
      instituicao: editItem.value.instituicao,
      localidadeFK: editItem.value.localidade.id
    })
    await fetchData()
    showEditModal.value = false
    editItem.value = null
  } catch (error) {
    console.error('Erro ao editar instituição:', error)
  }
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
                <DropdownAction 
                  v-else 
                  :instituicao="row.original" 
                  :localidades="localidades"
                  @edit="(item) => { editItem = item; showEditModal = true }" 
                  @delete="handleDeleteInstituicao"
                />
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

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h2 class="text-xl mb-4">Adicionar Instituição</h2>
        <form @submit.prevent="handleAddInstituicao">
          <div class="mb-4">
            <label class="block mb-1">Nome da Instituição</label>
            <input
              v-model="novaInstituicao.instituicao"
              type="text"
              class="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block mb-1">Localidade</label>
            <select
              v-model="novaInstituicao.localidadeFK"
              class="w-full border border-gray-300 rounded px-2 py-1"
              required
            >
              <option value="">Selecione a localidade</option>
              <option 
                v-for="localidade in localidades" 
                :key="localidade.id" 
                :value="localidade.id"
              >
                {{ localidade.localidade }}
              </option>
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

    <!-- Edit Modal -->
    <div v-if="showEditModal && editItem" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h2 class="text-xl mb-4">Editar Instituição</h2>
        <form @submit.prevent="handleEditInstituicao">
          <div class="mb-4">
            <label class="block mb-1">Nome da Instituição</label>
            <input
              v-model="editItem.instituicao"
              type="text"
              class="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block mb-1">Localidade</label>
            <select
              v-model="editItem.localidade.id"
              class="w-full border border-gray-300 rounded px-2 py-1"
              required
            >
              <option value="">Selecione a localidade</option>
              <option 
                v-for="localidade in localidades" 
                :key="localidade.id" 
                :value="localidade.id"
              >
                {{ localidade.localidade }}
              </option>
            </select>
          </div>

          <div class="flex justify-center space-x-2">
            <button type="submit" class="px-4 py-2 text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen rounded">
              Guardar
            </button>
            <button type="button" @click="showEditModal = false" class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400 rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>