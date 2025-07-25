<!-- @/components/espaco_admin/tipologia/data-table.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { getTipologia, createTipologia } from '@/api/tipologias'
import type { Tipologia } from '@/components/interfaces'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createColumns } from './columns'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const data = ref<Tipologia[]>([])

const fetchData = async () => {
  try {
    data.value = await getTipologia()
  } catch (error) {
    toast({
      title: 'Erro ao buscar tipologias. Por favor, tente novamente.',
      variant: 'destructive'
    })
  }
}

onMounted(() => {
  fetchData()
})

const showAddModal = ref(false)
const novaTipologia = ref({
  tipologia: ''
})

const handleSubmit = async () => {
  try {
    await createTipologia(novaTipologia.value)
    await fetchData()
    novaTipologia.value = { tipologia: '' }
    showAddModal.value = false
    toast({
      title: 'Tipologia criada com sucesso.',
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: 'Erro ao criar tipologia. Por favor, tente novamente.',
      variant: 'destructive'
    })
  }
}

const columns = createColumns(fetchData)

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
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex items-center pb-4 w-full space-x-4">
      <div class="flex-1">
        <Input class="w-full h-[2.7rem]" placeholder="Procurar por tipologia..."
          :model-value="table.getColumn('tipologia')?.getFilterValue() as string"
          @update:model-value="table.getColumn('tipologia')?.setFilterValue($event)" />
      </div>

      <button @click="showAddModal = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Adicionar Tipologia
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
                Sem Tipologias.
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
      <DialogContent class="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Tipologia</DialogTitle>
          <DialogDescription>
            Insira uma nova tipologia e clique em "Adicionar".
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="mb-4">
            <label class="block mb-1">Nome da Tipologia</label>
            <input v-model="novaTipologia.tipologia" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
              required />
          </div>

          <DialogFooter class="flex justify-end space-x-2 mt-4">
            <Button type="submit"
              class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
              Adicionar
            </Button>
            <Button type="button"
              class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
              variant="ghost" @click="showAddModal = false; novaTipologia.tipologia = ''">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>