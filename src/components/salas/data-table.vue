<script setup lang="ts" generic="TData, TValue">
import { ref, computed, onMounted } from 'vue'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Localidade } from '../interfaces'
import { getLocalidades } from '@/api/localidades'
import { createSala } from '@/api/salas'
import { parseJwt } from '@/utils/user-utils.js'
import { userIsAdmin } from '@/utils/user-utils.js'


const userRoles = ref<string[]>([]);

let token = localStorage.getItem('token')
const decodedToken = parseJwt(token);
userRoles.value = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];


const { toast } = useToast()

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const props = defineProps<{
  columns: ColumnDef<TData & { id: number }, TValue>[]
  data: (TData & { id: number })[]
}>()

const showAddModal = ref(false)
const novaSala = ref({
  sala: '',
  localidadeFK: null as number | null,
})

const localidades = ref<Localidade[]>([]);

const handleSubmit = async () => {
  try {
    await createSala(novaSala.value)
    showAddModal.value = false
    novaSala.value = { sala: '', localidadeFK: null }
    emit('refresh')
    toast({
      title: 'A sala foi adicionada com sucesso.',
      variant: 'success',
    })
  } catch (error) {
    toast({
      title: 'Não foi possível adicionar a sala, por favor tente novamente.',
      variant: 'destructive',
    })
  }
}

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  SalaOuLocalidade: false,
})
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

onMounted(async () => {
  try {
    localidades.value = await getLocalidades();
  } catch (error) {
    toast({
      title: 'Não foi possível carregar as localidades.',
      variant: 'destructive',
    })
  }
});
</script>

<template>
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex items-center pb-4 w-full space-x-4">
      <div class="flex-1">
        <Input class="w-full h-[2.7rem]" placeholder="Procurar por sala ou localidade..."
          :model-value="table.getColumn('SalaOuLocalidade')?.getFilterValue() as string"
          @update:model-value="table.getColumn('SalaOuLocalidade')?.setFilterValue($event)" />
      </div>

      <button v-if="userIsAdmin(userRoles)" @click="showAddModal = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Adicionar Sala
      </button>
    </div>

    <div class="flex min-w-[900px] justify-center items-center overflow-auto border rounded-md">
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
                Sem Salas.
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
          <DialogTitle>Adicionar Sala</DialogTitle>
          <DialogDescription>
            Insira a designação da sala e clique em "Adicionar".
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block mb-1">Nome da Sala</label>
            <input v-model="novaSala.sala" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
              required />
          </div>

          <div>
            <label class="block mb-1">Localidade</label>
            <select v-model="novaSala.localidadeFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
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
              variant="ghost"
              @click="showAddModal = false; novaSala = { sala: '', localidadeFK: null }">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>