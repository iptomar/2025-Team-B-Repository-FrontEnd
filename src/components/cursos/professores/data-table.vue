<script setup lang="ts" generic="TData, TValue">
import { ref, computed, onMounted } from 'vue'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
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
import { fetchProfessores } from '@/api/professores';
import { adicionarProfessorAoCurso } from '@/api/professores';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { parseJwt } from '@/utils/user-utils.js'
import { canSubmit } from '@/utils/user-utils.js'


const userRoles = ref<string[]>([]);

let token = localStorage.getItem('token')
const decodedToken = parseJwt(token);
userRoles.value = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];


const { toast } = useToast()

const props = defineProps<{
  columns: ColumnDef<TData & { id: number }, TValue>[],
  data: (TData & { id: number })[],
  cursoId: number,
  professoresNoCurso: { id: string, userName: string }[],
  professorId: string | null
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const resetAddProf = () => {
  addProf.value = { userName: '' };
}

const addProfDialog = ref(false);
const professores = ref<{ id: string; userName: string }[]>([])

const addProf = ref<{ userName: string }>({ userName: '' })

const professoresDisponiveis = computed(() => {
  const idsJaAdicionados = new Set(props.professoresNoCurso.map(p => p.id));
  return professores.value.filter(p => !idsJaAdicionados.has(p.id));
});

const handleSubmit = async () => {
  try {
    await adicionarProfessorAoCurso({
      CursoFK: props.cursoId,
      ProfessorFK: addProf.value.userName,
    });
    emit('refresh');
    toast({ title: 'Professor adicionado com sucesso!', variant: 'success' });
    addProfDialog.value = false;
    resetAddProf();
  } catch (error) {
    addProfDialog.value = false;
    toast({ title: 'Erro ao adicinar professor. Verifique os campos e tente novamente.', variant: 'destructive' });
  }
};

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

onMounted(async () => {
  try {
    professores.value = await fetchProfessores()
  } catch (error) {
    toast({
      title: 'Erro ao carregar professores. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
  }
})
</script>

<template>
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex justify-end items-center pb-4 w-full space-x-20">
      <div class="flex-1">
        <Input class="w-full h-[2.6rem]" placeholder="Procurar por professor..."
          :model-value="table.getColumn('userName')?.getFilterValue() as string"
          @update:model-value="table.getColumn('userName')?.setFilterValue($event)" />
      </div>

      <button v-if="canSubmit(userRoles, professorId)" @click="addProfDialog = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Adicionar Professor
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
              <TableCell :colspan="props.columns.length" class="h-24 text-center">
                Sem Professores
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

  <Dialog v-model:open="addProfDialog">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Professor</DialogTitle>
        <DialogDescription>
          Escolha um professor e clique em "Adicionar".
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Professor</label>
          <select v-model="addProf.userName" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option value="" disabled>Selecione o professor</option>
            <option v-for="prof in professoresDisponiveis" :key="prof.id" :value="prof.id">
              {{ prof.userName }}
            </option>
          </select>
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Adicionar
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="() => { addProfDialog = false; resetAddProf(); }" >
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>