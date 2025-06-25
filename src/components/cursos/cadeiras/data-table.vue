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
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import type { Cadeira, Curso } from '@/components/interfaces'
import { createCadeira } from '@/api/cadeiras'
import { addCadeiraAoCurso } from '@/api/cursos'
import { parseJwt } from '@/utils/user-utils.js'
import { canSubmit } from '@/utils/user-utils.js'


const userRoles = ref<string[]>([]);

let token = localStorage.getItem('token')
const decodedToken = parseJwt(token);
userRoles.value = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];


const { toast } = useToast()

const props = defineProps<{
  columns: ColumnDef<Cadeira, any>[],
  data: Cadeira[],
  cursoSelecionado: Curso | null
}>();

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const router = useRouter()
const isCreateOpen = ref(false);

const novaCadeira = ref({ cadeira: '', ano: 1, semestre: 1, ects: 1 })

const resetNovaCadeira = () => {
  novaCadeira.value = { cadeira: '', ano: 1, semestre: 1, ects: 1 }
}

const handleSubmit = async () => {
  try {
    if (!props.cursoSelecionado) {
      toast({ title: 'Nenhum curso selecionado.', variant: 'destructive' });
      return;
    }
    
    const nova = await createCadeira(novaCadeira.value);

    await addCadeiraAoCurso(props.cursoSelecionado.id, nova.id);

    emit('refresh');
    resetNovaCadeira()
    toast({ title: 'Cadeira criada com sucesso!', variant: 'success' });
    isCreateOpen.value = false;
  } catch (error) {
    isCreateOpen.value = false;
    toast({ title: 'Erro ao criar cadeira. Verifique os campos e tente novamente.', variant: 'destructive' });
  }
};

const goToCadeira = (id: number) => {
  if (!props.cursoSelecionado) return;
  router.push({
    path: `/cadeira/${id}`,
    state: { cursoId: props.cursoSelecionado.id }
  });
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

const limitValue = (field: 'ano' | 'semestre' | 'ects', min: number, max: number) => {
  const value = Number(novaCadeira.value[field])
  if (value < min) novaCadeira.value[field] = min
  if (value > max) novaCadeira.value[field] = max
}
</script>

<template>
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex items-center pb-4 w-full space-x-20">
      <div class="flex-1">
        <Input class="w-full h-[2.6rem]" placeholder="Procurar por cadeira..."
          :model-value="table.getColumn('cadeira')?.getFilterValue() as string"
          @update:model-value="table.getColumn('cadeira')?.setFilterValue($event)" />
      </div>

      <button v-if="canSubmit(userRoles)" @click="isCreateOpen = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Criar Cadeira
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
              :data-state="row.getIsSelected() ? 'selected' : undefined" class="hover:bg-gray-50 cursor-pointer"
              @click="goToCadeira(row.original.id)">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-2">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="props.columns.length" class="h-24 text-center">
                Sem Cadeiras
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
        <DialogTitle>Criar Cadeira</DialogTitle>
        <DialogDescription>
          Crie uma cadeira e clique em "Criar".
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Nome da Cadeira</label>
          <input v-model="novaCadeira.cadeira" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
        </div>

        <div>
          <label class="block text-sm mb-1">Ano</label>
          <input v-model="novaCadeira.ano" type="number" min="1" max="4" @input="limitValue('ano', 1, 4)"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
        </div>

        <div>
          <label class="block text-sm mb-1">Semestre</label>
          <input v-model="novaCadeira.semestre" type="number" min="1" max="3" @input="limitValue('semestre', 1, 3)"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
          <p class="text-xs text-gray-500">* 3 - Para cadeiras anuais</p>
        </div>

        <div>
          <label class="block text-sm mb-1">ECTS</label>
          <input v-model="novaCadeira.ects" type="number" min="1" max="30" @input="limitValue('ects', 1, 30)"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Criar
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="isCreateOpen = false">
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>