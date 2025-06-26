<script setup lang="ts" generic="TData, TValue">
import { ref, onMounted, computed } from 'vue'
import type { SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { getInstituicoes, createInstituicao, deleteInstituicao, updateInstituicao } from '@/api/instituicoes'
import { getLocalidades } from '@/api/localidades'
import type { Instituicao } from '@/components/interfaces'
import { getColumns } from './columns'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const data = ref<Instituicao[]>([])
const localidades = ref<{ id: number, localidade: string }[]>([])

const fetchData = async () => {
  try {
    data.value = await getInstituicoes()
    localidades.value = await getLocalidades()
  } catch (error) {
    toast({
      title: 'Erro ao buscar dados. Por favor, tente novamente.',
      variant: 'destructive'
    })
  }
}

onMounted(() => {
  fetchData()
})

const showAddModal = ref(false)
const novaInstituicao = ref({
  instituicao: '',
  localidadeFK: null as number | null
})

const handleAddInstituicao = async () => {
  try {
    if (novaInstituicao.value.localidadeFK === null) {
      throw new Error('Localidade deve ser selecionada');
    }
    await createInstituicao({
      instituicao: novaInstituicao.value.instituicao,
      localidadeFK: novaInstituicao.value.localidadeFK
    })
    toast({
      title: 'Instituição adicionada com sucesso.',
      variant: 'success'
    })
    await fetchData()
    showAddModal.value = false
    novaInstituicao.value = { instituicao: '', localidadeFK: 0 }
  } catch (error) {
    toast({
      title: 'Erro ao adicionar instituição. Por favor, tente novamente.',
      variant: 'destructive'
    })
  }
}

const openEditModal = (instituicao: Instituicao) => {
  editItem.value = { ...instituicao }
  showEditModal.value = true
}

const openDeleteModal = (id: number) => {
  deleteItem.value = id
  showDeleteModal.value = true
}

const columns = getColumns(openEditModal, openDeleteModal, localidades.value)

const showDeleteModal = ref(false);
const deleteItem = ref<number | null>(null);

const handleDeleteInstituicao = async (id: number) => {
  try {
    await deleteInstituicao(id)
    await fetchData()
    toast({
      title: 'Instituição excluída com sucesso.',
      variant: 'success'
    })
    showDeleteModal.value = false
    deleteItem.value = null
  } catch (error) {
    toast({
      title: 'Erro ao excluir instituição. Por favor, tente novamente.',
      variant: 'destructive'
    })
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
    toast({
      title: 'Instituição editada com sucesso.',
      variant: 'success'
    })
    await fetchData()
    showEditModal.value = false
    editItem.value = null
  } catch (error) {
    toast({
      title: 'Erro ao editar instituição. Por favor, tente novamente.',
      variant: 'destructive'
    })
  }
}

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  InstituicaoOuLocalidade: false,
})

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
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex items-center pb-4 w-full space-x-4">
      <div class="flex-1">
        <Input class="w-full h-[2.7rem]" placeholder="Procurar por instituição ou localidade..."
          :model-value="table.getColumn('InstituicaoOuLocalidade')?.getFilterValue() as string"
          @update:model-value="table.getColumn('InstituicaoOuLocalidade')?.setFilterValue($event)" />
      </div>

      <button @click="showAddModal = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Adicionar Instituição
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
                Sem Instituições.
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Instituição</DialogTitle>
          <DialogDescription>
            Insira o nome da nova instituição e clique em "Adicionar".
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleAddInstituicao" class="space-y-4">
          <div>
            <label class="block mb-1">Nome da Instituição</label>
            <input v-model="novaInstituicao.instituicao" type="text"
              class="w-full border border-gray-300 rounded px-2 py-1" required />
          </div>

          <div>
            <label class="block mb-1">Localidade</label>
            <select v-model="novaInstituicao.localidadeFK" class="w-full border border-gray-300 rounded px-2 py-1"
              required>
              <option value=null disabled>Selecione a localidade</option>
              <option v-for="localidade in localidades" :key="localidade.id" :value="localidade.id">
                {{ localidade.localidade }}
              </option>
            </select>
          </div>
          <DialogFooter class="flex justify-end gap-2">
            <Button type="submit"
              class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
              Adicionar
            </Button>
            <Button type="button"
              class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
              variant="ghost" @click="showAddModal = false; novaInstituicao = { instituicao: '', localidadeFK: null }">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showEditModal">
      <DialogContent v-if="editItem">
        <DialogHeader>
          <DialogTitle>Editar Instituição</DialogTitle>
          <DialogDescription>
            Altere o nome da instituição e clique em "Guardar".
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleEditInstituicao" class="space-y-4">
          <div>
            <label class="block mb-1">Nome da Instituição</label>
            <input v-model="editItem.instituicao" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
              required />
          </div>

          <div>
            <label class="block mb-1">Localidade</label>
            <select v-model="editItem.localidade.id" class="w-full border border-gray-300 rounded px-2 py-1" required>
              <option vvalue="" disabled>Selecione a localidade</option>
              <option v-for="localidade in localidades" :key="localidade.id" :value="localidade.id">
                {{ localidade.localidade }}
              </option>
            </select>
          </div>

          <DialogFooter class="flex justify-end gap-2">
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Instituição</DialogTitle>
          <DialogDescription>
            Tem a certeza que deseja eliminar esta instituição?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex justify-end gap-2">
          <Button type="button" class="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
            @click="deleteItem !== null && handleDeleteInstituicao(deleteItem)">
            Excluir
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="showDeleteModal = false">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>