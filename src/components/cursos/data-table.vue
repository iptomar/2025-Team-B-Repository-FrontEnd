<script setup lang="ts" generic="TData, TValue">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'

const props = defineProps<{
  columns: ColumnDef<TData & { id: number }, TValue>[]
  data: (TData & { id: number })[]
}>()

const router = useRouter()
const showModal = ref(false);
const novoCurso = ref({
  curso: '',
  grau: '',
  respProf: '',
  anoLetivo: '',
  instituicao: ''
});
const graus = ['Licenciatura', 'Mestrado', 'Doutoramento'];
const professores = ['Dr. Silva', 'Dra. Costa', 'Dr. Rodrigues'];
const anosLetivos = ['2020/2021', '2021/2022', '2022/2023', '2023/2024', '2024/2025'];
const instituicoes = ['ESTT', 'ESTA', 'ESTG'];

const handleSubmit = () => {
  // Enviar para backend
  console.log(novoCurso.value);
  showModal.value = false;
};

const goToCurso = (id: string) => {
  router.push(`/curso/${id}`)
}

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  cursoOuGrau: false,
  anoLetivo: false,
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
});

onMounted(async () => {
  const defaultAnoLetivo = anosLetivos[anosLetivos.length - 1];
  table.getColumn('anoLetivo')?.setFilterValue(defaultAnoLetivo);
});
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex items-center pb-4 w-full space-x-4">
      <div class="flex-1">
        <Input class="w-full h-[2.7rem]" placeholder="Procurar por curso ou grau..."
          :model-value="table.getColumn('cursoOuGrau')?.getFilterValue() as string"
          @update:model-value="table.getColumn('cursoOuGrau')?.setFilterValue($event)" />
      </div>

      <div class="flex-1">
        <select class="h-[2.6rem] border border-gray-300 rounded px-2 py-1"
          :value="table.getColumn('anoLetivo')?.getFilterValue() || anosLetivos[anosLetivos.length - 1]"
          @change="table.getColumn('anoLetivo')?.setFilterValue(($event.target as HTMLSelectElement).value)">
          <option v-for="ano in anosLetivos.slice().reverse()" :key="ano" :value="ano">
            {{ ano }}
          </option>
        </select>
      </div>

      <button @click="showModal = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Criar Curso
      </button>
    </div>


    <div class="flex justify-center items-center overflow-auto border rounded-md">
      <Table class="w-[77vw]">
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" class="bg-gray-100 p-2 text-left">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined" class="hover:bg-gray-50 cursor-pointer"
              @click="goToCurso(String(row.original.id))">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-2">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="props.columns.length" class="h-24 text-center">
                Sem Cursos
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

  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-xl mb-4">Criar Curso</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block mb-1">Nome do Curso</label>
          <input v-model="novoCurso.curso" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
        </div>

        <div class="mb-4">
          <label class="block mb-1">Grau</label>
          <select v-model="novoCurso.grau" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option value="">Selecione o grau</option>
            <option v-for="grau in graus" :key="grau" :value="grau">{{ grau }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Professor Responsável</label>
          <select v-model="novoCurso.respProf" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option value="">Selecione o professor</option>
            <option v-for="prof in professores" :key="prof" :value="prof">{{ prof }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Instituição</label>
          <select v-model="novoCurso.instituicao" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option value="">Selecione a instituição</option>
            <option v-for="instituicao in instituicoes" :key="instituicao" :value="instituicao">{{ instituicao }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Ano Letivo</label>
          <input type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            :value="anosLetivos[anosLetivos.length - 1]" readonly />
        </div>

        <div class="flex justify-center space-x-2">
          <button type="submit"
            class="px-4 py-2 text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen rounded">
            Criar
          </button>
          <button type="button" @click="showModal = false"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>