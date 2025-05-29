<script setup lang="ts" generic="TData extends {
  id: number; anoLetivoFK: number | null;
}, TValue">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { fetchAnosLetivos } from '@/api/anosLetivos.ts'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchCoordenadores, createCurso } from '@/api/cursos'
import type { anoLetivo } from '../interfaces'
import { fetchGraus } from '@/api/graus'
import { fetchInstituicoes } from '@/api/instituicoes'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
}>()

const anosLetivosRaw = ref<anoLetivo[]>([])
const anoSelecionado = ref<number | null>(null)
const graus = ref<{ id: number; grau: string }[]>([])
const professores = ref<{ id: string; userName: string }[]>([])
const instituicoes = ref<{ id: number; instituicao: string }[]>([])

const router = useRouter()
const isCreateOpen = ref(false);

const novoCurso = ref({
  curso: '',
  grauFK: null,
  professorFK: '',
  instituicaoFK: null,
  anoLetivoFK: anoSelecionado.value ?? null,
});

const resetNovoCurso = () => {
  novoCurso.value = {
    curso: '',
    grauFK: null,
    professorFK: '',
    instituicaoFK: null,
    anoLetivoFK: anoSelecionado.value ?? null,
  };
};

const handleSubmit = async () => {
  try {
    await createCurso(novoCurso.value);
    isCreateOpen.value = false;
    resetNovoCurso();
    emit('refresh');
    toast({
      title: 'Curso criado com sucesso!',
      variant: 'success',
    });
  } catch (error) {
    isCreateOpen.value = false;
    toast({
      title: 'Erro ao criar curso. Verifique os campos e tente novamente.',
      variant: 'destructive',
    });
  }
};

const goToCurso = (id: number) => {
  router.push(`/curso/${id}`)
}

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  anoLetivoFK: false,
})

const cursosFiltradosPorAno = computed(() => {
  if (!anoSelecionado.value) return props.data
  return props.data.filter(curso => curso.anoLetivoFK === anoSelecionado.value)
})

const table = useVueTable({
  get data() { return cursosFiltradosPorAno.value },
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

const currentPage = computed(() => table.getState().pagination.pageIndex + 1)
const pageCount = computed(() => table.getPageCount())

onMounted(async () => {
  try {
    const [anosResponse, grausResponse, profsResponse, instsResponse] = await Promise.all([
      fetchAnosLetivos(),
      fetchGraus(),
      fetchCoordenadores(),
      fetchInstituicoes()
    ]);

    anosLetivosRaw.value = anosResponse;
    graus.value = grausResponse;
    professores.value = profsResponse;
    instituicoes.value = instsResponse;

    if (anosLetivosRaw.value.length > 0) {
      const ultimoAno = [...anosLetivosRaw.value].sort((a, b) => b.id - a.id)[0];
      anoSelecionado.value = ultimoAno.id;
      novoCurso.value.anoLetivoFK = ultimoAno.id;
    }
  } catch (error) {
    console.error("Erro ao carregar dados iniciais:", error);
  }
});
</script>

<template>
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex items-center pb-4 w-full space-x-4">
      <div class="flex-1">
        <Input class="w-full h-[2.7rem]" placeholder="Procurar por curso..."
          :model-value="table.getColumn('curso')?.getFilterValue() as string"
          @update:model-value="table.getColumn('curso')?.setFilterValue($event)" />
      </div>

      <div class="flex-1">
        <select v-model="anoSelecionado" class="h-[2.6rem] border border-gray-300 rounded px-2 py-1">
          <option v-for="ano in anosLetivosRaw.slice().reverse()" :key="ano.id" :value="ano.id">
            {{ ano.anoLetivo }}
          </option>
        </select>
      </div>

      <button @click="isCreateOpen = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Criar Curso
      </button>
    </div>

    <div class="flex justify-center items-center overflow-auto border rounded-md">
      <Table class="w-full">
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
              @click="goToCurso(row.original.id)">
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

  <Dialog v-model:open="isCreateOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Criar Curso</DialogTitle>
        <DialogDescription>
          Crie um curso e clique em "Criar".
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Nome do Curso</label>
          <input v-model="novoCurso.curso" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
        </div>

        <div>
          <label class="block text-sm mb-1">Grau</label>
          <select v-model="novoCurso.grauFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option :value="null" disabled selected>Selecione o grau</option>
            <option v-for="grau in graus" :key="grau.id" :value="grau.id">{{ grau.grau }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Professor Responsável</label>
          <select v-model="novoCurso.professorFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option value="" disabled selected>Selecione o professor</option>
            <option v-for="prof in professores" :key="prof.id" :value="prof.id">{{ prof.userName }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Instituição</label>
          <select v-model="novoCurso.instituicaoFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option :value="null" disabled selected>Selecione a instituição</option>
            <option v-for="instituicao in instituicoes" :key="instituicao.id" :value="instituicao.id">
              {{ instituicao.instituicao }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Ano Letivo</label>
          <input :value="anosLetivosRaw.find(a => a.id === novoCurso.anoLetivoFK)?.anoLetivo || ''" type="text"
            class="w-full border border-gray-300 rounded px-2 py-1" readonly />
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Criar
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="() => { isCreateOpen = false; resetNovoCurso(); }">
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>