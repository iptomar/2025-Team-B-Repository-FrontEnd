<script setup lang="ts" generic="TData, TValue">
import { ref, onMounted, computed } from 'vue'
import type { SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { getLocalidades, createLocalidade, deleteLocalidade, updateLocalidade } from '@/api/localidades'
import type { Localidade } from '@/components/interfaces'
import { getColumns } from './columns'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const data = ref<Localidade[]>([])

const fetchData = async () => {
  try {
    data.value = await getLocalidades()
  } catch (error) {
    console.error('Erro ao buscar localidades:', error)
  }
}

onMounted(() => {
  fetchData()
})

const showAddModal = ref(false)
const novaLocalidade = ref('')

const handleAddLocalidade = async () => {
  try {
    await createLocalidade(novaLocalidade.value)
    await fetchData()
    showAddModal.value = false
    novaLocalidade.value = ''
  } catch (error) {
    console.error('Erro ao adicionar localidade:', error)
  }
}

const openEditModal = (localidade: Localidade) => {
  editItem.value = { ...localidade }
  showEditModal.value = true
}

const openDeleteModal = (id: number) => {
  deleteItem.value = id
  showDeleteModal.value = true
}

const columns = getColumns(openEditModal, openDeleteModal)

const showDeleteModal = ref(false);
const deleteItem = ref<number | null>(null);

const handleDeleteLocalidade = async (id: number) => {
  try {
    await deleteLocalidade(id)
    await fetchData()
    showDeleteModal.value = false 
    deleteItem.value = null
  } catch (error) {
    console.error('Erro ao deletar localidade:', error)
  }
}

const showEditModal = ref(false)
const editItem = ref<Localidade | null>(null)

const handleEditLocalidade = async () => {
  if (!editItem.value) return

  try {
    await updateLocalidade(editItem.value.id, editItem.value.localidade)
    console.log('Localidade editada:', editItem.value)
    await fetchData()
    showEditModal.value = false  
    editItem.value = null
  } catch (error) {
    console.error('Erro ao editar localidade:', error)
  }
}

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const currentPage = computed(() => table.getState().pagination.pageIndex + 1)
const pageCount = computed(() => table.getPageCount())

const table = useVueTable({
  get data() { return data.value },
  get columns() { return columns },
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
        <Input class="w-full h-[2.7rem]" placeholder="Procurar por localidade..."
          :model-value="table.getColumn('localidade')?.getFilterValue() as string"
          @update:model-value="table.getColumn('localidade')?.setFilterValue($event)" />
      </div>

      <button @click="showAddModal = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Adicionar Localidade
      </button>
    </div>

    <div class="flex justify-center items-center overflow-auto border rounded-md">
      <Table class="w-full">
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
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                Sem Localidades.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-center gap-2 mt-4">
      <Button class="hover:border-iptGreen" variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()">
        Anterior
      </Button>

      <button v-for="page in pageCount" :key="page" @click="table.setPageIndex(page - 1)" :class="[
        'px-3 py-1 hover:border-iptGreen rounded',
        page === currentPage ? 'bg-iptGreen text-white' : 'bg-white'
      ]">
        {{ page }}
      </button>

      <Button class="hover:border-iptGreen" variant="outline" size="sm" :disabled="!table.getCanNextPage()"
        @click="table.nextPage()">
        Próxima
      </Button>
    </div>

    <Dialog v-model:open="showAddModal">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Localidade</DialogTitle>
          <DialogDescription>
            Insira o nome da nova localidade e clique em "Adicionar".
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleAddLocalidade" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nome da Localidade</label>
            <input v-model="novaLocalidade" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
              required />
          </div>

          <DialogFooter class="flex justify-end space-x-2">
            <Button type="submit"
              class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
              Adicionar
            </Button>
            <Button type="button"
              class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
              variant="ghost" @click="showAddModal = false; novaLocalidade = ''">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showEditModal">
      <DialogContent class="sm:max-w-md" v-if="editItem">
        <DialogHeader>
          <DialogTitle>Editar Localidade</DialogTitle>
          <DialogDescription>
            Altere o nome da localidade e clique em "Guardar".
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleEditLocalidade" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nome da Localidade</label>
            <input v-model="editItem.localidade" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
              required />
          </div>

          <DialogFooter class="flex justify-end space-x-2">
            <Button type="submit"
              class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
              Guardar
            </Button>
            <Button type="button"
              class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
              variant="ghost" @click="showEditModal = false">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="sm:max-w-md" v-if="deleteItem">
        <DialogHeader>
          <DialogTitle>Eliminar Localidade</DialogTitle>
          <DialogDescription>
            Tem a certeza que deseja eliminar esta localidade?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex justify-end space-x-2">
          <div class="flex justify-center gap-4 mt-4">
            <Button type="button" class="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
              @click="handleDeleteLocalidade(deleteItem)">
              Excluir
            </Button>
            <Button type="button"
              class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
              variant="ghost" @click="showDeleteModal = false">
              Cancelar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>