<script setup lang="ts" generic="TData, TValue">
import { ref, onMounted } from 'vue';
import { useVueTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, FlexRender } from '@tanstack/vue-table';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast';
import { getUserId } from '@/utils/user-utils.js';
import type { Horario } from '@/components/interfaces';
import { getColumnsHorarios } from './columns';

const horarios = ref<Horario[]>([]);
const { toast } = useToast();
const showTable = ref(false);
const globalFilter = ref('');

async function fetchHorariosPendentes() {
  try {
    const response = await fetch(`https://localhost:7223/api/Horarios/pendentes?id=${getUserId()}`);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    horarios.value = await response.json();
    showTable.value = true;
  } catch (error) {
    toast({ title: "Erro ao carregar horários pendentes.", variant: "destructive" });
  }
}

onMounted(fetchHorariosPendentes);

const sorting = ref([]);
const columnFilters = ref([]);
const columnVisibility = ref({ searchable: false });

const table = useVueTable({
  get data() { return horarios.value; },
  get columns() { return getColumnsHorarios(fetchHorariosPendentes); },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: {
    get sorting() { return sorting.value; },
    get columnFilters() { return columnFilters.value; },
    get columnVisibility() { return columnVisibility.value; },
    get globalFilter() { return globalFilter.value; },
  },
  onGlobalFilterChange: (value) => {
    globalFilter.value = value;
  },
  globalFilterFn: (row, columnId, filterValue) => {
    const searchValue = filterValue.toLowerCase();
    const rowData = row.original;
    const searchableText = `${rowData.inicio} ${rowData.fim} ${rowData.turma.curso.curso} ${rowData.turma.letra}`.toLowerCase();
    return searchableText.includes(searchValue);
  },
});
</script>

<template>
  <Toaster />
  <div class="w-full space-y-4">
    <div class="border-b pb-4">
      <h1 class="text-3xl font-bold">Notificações</h1>
      <p class="text-gray-600">Por favor verifique os horários pendentes para aprovação.</p>
    </div>

    <Input 
      class="w-full" 
      placeholder="Filtrar por curso, turma, início, fim..." 
      :model-value="globalFilter"
      @update:model-value="table.setGlobalFilter($event)" 
    />

    <div v-if="showTable" class="overflow-auto border rounded-md">
      <Table class="w-full">
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" class="bg-gray-100 font-semibold px-6 py-4">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-6 py-4">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow><TableCell :colspan="6" class="text-center px-6 py-4">Nenhum horário pendente de verificação encontrado.</TableCell></TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
