<script setup lang="ts" generic="TData, TValue">
import { ref, computed, watch } from 'vue'
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
import type { Tipologia } from '../../interfaces'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { fetchTurmas } from '@/api/turmas'
import { getTipologia } from "@/api/tipologias";
import { createAula } from '@/api/aulas'
import { parseJwt } from '@/utils/user-utils.js'
import { canSubmit } from '@/utils/user-utils.js'


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
  data: (TData & { id: number })[],
  cadeiraId: number,
  cursoId: number,
  professoresNoCurso: { id: string, userName: string }[],
  semestreCadeira: number,
  anoCadeira: number,
  professorId: string | null
}>()

const tipologias = ref<Tipologia[]>([]);
const professores = ref<{ id: string; userName: string }[]>([]);
const turmas = ref<{ id: number; ano: number; letra: string; cursoFK: number; semestre: number }[]>([]);

const isCreateOpen = ref(false);

const hora = ref('00');
const minuto = ref('00');

const novaAula = ref({
  duracao: '',
  CadeiraFK: props.cadeiraId,
  TipologiaFK: 0,
  TurmaFK: 0,
  ProfessorFK: 0
})

const handleSubmit = async () => {
  try {
    novaAula.value.duracao = `${hora.value}:${minuto.value}:00`;

    await createAula(novaAula.value);
    toast({ title: "Aula criada com sucesso!", variant: "success" });
    emit('refresh');
    isCreateOpen.value = false;

    novaAula.value = {
      duracao: '',
      CadeiraFK: props.cadeiraId,
      TipologiaFK: 0,
      TurmaFK: 0,
      ProfessorFK: 0,
    };

    hora.value = '00';
    minuto.value = '00';
  } catch (error) {
    isCreateOpen.value = false;
    toast({
      title: "Erro ao criar aula",
      description: String(error),
      variant: "destructive",
    });
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

watch(isCreateOpen, async (value) => {
  if (value) {
    try {
      tipologias.value = await getTipologia();
      professores.value = props.professoresNoCurso;
      const todasTurmas = await fetchTurmas();
      turmas.value = todasTurmas.filter((t: { cursoFK: number, semestre: number, ano: number }) =>
        t.cursoFK === props.cursoId &&
        t.semestre === props.semestreCadeira &&
        t.ano === props.anoCadeira
      );
    } catch (error) {
      toast({ title: "Erro ao carregar dados. Por favor, tente novamente.", variant: "destructive" });
    }
  }
});
</script>

<template>
  <Toaster />

  <div class="flex flex-col h-full w-full">
    <div class="flex justify-end items-center pb-4 w-full space-x-20">
      <button v-if="canSubmit(userRoles, professorId)" @click="isCreateOpen = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Criar Aula
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
              <TableCell :colspan="props.columns.length" class="h-24 text-center">
                Sem Aulas
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
        <DialogTitle>Criar Aula</DialogTitle>
        <DialogDescription>Preencha os dados da nova aula.</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Duração</label>
          <div class="flex space-x-2">
            <select v-model="hora" class="border border-gray-300 rounded px-2 py-1">
              <option v-for="h in [0, 1, 2, 3, 4, 5, 6]" :key="h" :value="String(h).padStart(2, '0')">
                {{ String(h).padStart(2, '0') }}
              </option>
            </select>
            <p class="flex items-center">:</p>
            <select v-model="minuto" class="border border-gray-300 rounded px-2 py-1">
              <option v-for="m in [0, 30]" :key="m" :value="String(m).padStart(2, '0')">
                {{ String(m).padStart(2, '0') }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm mb-1">Tipologia</label>
          <select v-model="novaAula.TipologiaFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option disabled value="0">Selecione uma tipologia</option>
            <option v-for="tip in tipologias" :value="tip.id">{{ tip.tipologia }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Professor</label>
          <select v-model="novaAula.ProfessorFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option disabled value="0">Selecione um professor</option>
            <option v-for="prof in professores" :value="prof.id">{{ prof.userName }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Turma</label>
          <select v-model="novaAula.TurmaFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option disabled value="0">Selecione uma turma</option>
            <option v-for="turma in turmas" :key="turma.id" :value="turma.id">
              {{ turma.letra }}
            </option>
          </select>
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Criar
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="isCreateOpen = false; novaAula = {
              duracao: '',
              CadeiraFK: props.cadeiraId,
              TipologiaFK: 0,
              TurmaFK: 0,
              ProfessorFK: 0
            }">
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>