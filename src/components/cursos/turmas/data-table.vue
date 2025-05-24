<script setup lang="ts" generic="TData, TValue">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { createTurma } from '@/api/turmas'
import type { Curso, Turma } from '@/components/interfaces'

const { toast } = useToast()

const props = defineProps<{
  columns: ColumnDef<Turma, any>[],
  data: Turma[],
  cursoSelecionado: Curso | null
}>();

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const router = useRouter()
const isCreateOpen = ref(false);

const novaTurma = ref({
  ano: 1,
  semestre: 1,
  letra: '',
  cursoFK: props.cursoSelecionado ? props.cursoSelecionado.id : 0,
});

const resetNovaTurma = () => {
  novaTurma.value = { 
    ano: 1, 
    semestre: 1, 
    letra: '', 
    cursoFK: props.cursoSelecionado ? props.cursoSelecionado.id : 0 
  }
}

const handleSubmit = async () => {
  try {
    if (props.cursoSelecionado) {
      novaTurma.value.cursoFK = props.cursoSelecionado.id;
    }
    await createTurma(novaTurma.value);
    emit('refresh');
    resetNovaTurma()
    toast({ title: 'Turma criada com sucesso!', variant: 'success' });
    isCreateOpen.value = false;
  } catch (error) {
    isCreateOpen.value = false;
    toast({ title: 'Erro ao criar turma. Verifique os campos e tente novamente.', variant: 'destructive' });
  }
};

const goToTurma = (id: number) => {
  router.push(`/turma/${id}`)
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

const limitValue = (field: 'ano' | 'semestre', min: number, max: number) => {
  const value = Number(novaTurma.value[field])
  if (value < min) novaTurma.value[field] = min
  if (value > max) novaTurma.value[field] = max
}
</script>

<template>
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex justify-end items-center pb-4 w-full space-x-20">
      <button @click="isCreateOpen = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Criar Turma
      </button>
    </div>

    <div class="flex justify-center items-center overflow-auto border rounded-md">
      <Table class="w-[77vw]">
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
              :data-state="row.getIsSelected() ? 'selected' : undefined" class="hover:bg-gray-50 cursor-pointer"
              @click="goToTurma(row.original.id)">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-2">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="props.columns.length" class="h-24 text-center">
                Sem Turmas
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
  </div>

  <Dialog v-model:open="isCreateOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Criar Turma</DialogTitle>
        <DialogDescription>
          Crie uma turma e clique em "Criar".
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Turma</label>
          <input v-model="novaTurma.letra" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
        </div>

        <div>
          <label class="block text-sm mb-1">Ano</label>
          <input v-model="novaTurma.ano" type="number" min="1" max="4" @input="limitValue('ano', 1, 4)"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
        </div>

        <div>
          <label class="block text-sm mb-1">Semestre</label>
          <input v-model="novaTurma.semestre" type="number" min="1" max="3" @input="limitValue('semestre', 1, 3)"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
          <p class="text-xs text-gray-500">* 3 - Para turmas anuais</p>
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Criar
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="() => { isCreateOpen = false; resetNovaTurma(); }">
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>