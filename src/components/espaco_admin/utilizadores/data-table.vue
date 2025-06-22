<script setup lang="ts" generic="TData extends { id: string }, TValue">
import { ref, computed, onMounted } from 'vue'
import type { SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { fetchUsers, fetchRoles } from '@/api/users'
import { registerAPI } from '@/api/api'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Users } from '@/components/interfaces'
import { createColumns } from './columns'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const data = ref<Users[]>([])
const rolesOptions = ref<string[]>([])

const refreshData = async () => {
  try {
    data.value = await fetchUsers()
  } catch (error) {
    toast({
      title: 'Erro ao atualizar dados. Por favor, tente novamente.',
      variant: 'destructive'
    })
  }
}

const loadRoles = async () => {
  try {
    rolesOptions.value = await fetchRoles()
  } catch (error) {
    toast({
      title: 'Erro ao carregar funções',
      description: 'Não foi possível carregar as funções disponíveis',
      variant: 'destructive'
    })
  }
}

onMounted(async () => {
  await refreshData()
  await loadRoles()
})

const showAddModal = ref(false)
const novoUtilizador = ref({
  nome: '',
  email: '',
  password: '',
  roles: [] as string[]
})

const handleSubmit = async () => {
  if (!novoUtilizador.value.email.includes('@')) {
    toast({
      title: 'E-mail inválido',
      variant: 'destructive'
    })
    return
  }

  if (novoUtilizador.value.password.length < 6) {
    toast({
      title: 'Senha muito curta',
      description: 'A senha deve ter pelo menos 6 caracteres',
      variant: 'destructive'
    })
    return
  }

  if (novoUtilizador.value.roles.length === 0) {
    toast({
      title: 'Selecione pelo menos uma função',
      variant: 'destructive'
    })
    return
  }

  try {
    await registerAPI({
      nome: novoUtilizador.value.nome,
      email: novoUtilizador.value.email,
      password: novoUtilizador.value.password,
      roles: novoUtilizador.value.roles
    })
    toast({
      title: 'Utilizador adicionado com sucesso!',
      variant: 'success'
    })
    novoUtilizador.value = {
      nome: '',
      email: '',
      password: '',
      roles: []
    }
    showAddModal.value = false
    refreshData()
  } catch (error) {
    toast({
      title: 'Erro ao adicionar utilizador',
      description: (error as Error).message || 'Tente novamente',
      variant: 'destructive'
    })
  }
}

const columns = createColumns(refreshData)

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
        <Input class="w-full h-[2.7rem]" placeholder="Procurar por utilizador..."
          :model-value="table.getColumn('email')?.getFilterValue() as string"
          @update:model-value="table.getColumn('email')?.setFilterValue($event)" />
      </div>

      <button @click="showAddModal = true"
        class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
        Adicionar Utilizador
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
                Sem utilizadores disponíveis.
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
          <DialogTitle>Adicionar utilizador</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo utilizador
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium">Nome Completo</label>
            <Input v-model="novoUtilizador.nome" required placeholder="Nome do utilizador" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">E-mail</label>
            <Input v-model="novoUtilizador.email" type="email" required placeholder="exemplo@email.com" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium">Senha</label>
            <Input 
              v-model="novoUtilizador.password" 
              type="password" 
              required 
              placeholder="Mínimo 6 caracteres" 
            />
          </div>

          <!-- Substituição do MultiSelect por checkboxes -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">Funções</label>
            <div class="space-y-2">
              <div v-for="role in rolesOptions" :key="role" class="flex items-center">
                <input 
                  type="checkbox"
                  :id="`role-${role}`"
                  :value="role"
                  v-model="novoUtilizador.roles"
                  class="mr-2 h-4 w-4 text-iptGreen border-gray-300 rounded focus:ring-iptGreen"
                >
                <label :for="`role-${role}`" class="text-sm text-gray-700">{{ role }}</label>
              </div>
            </div>
          </div>

          <DialogFooter class="flex justify-end gap-2 mt-4">
            <Button 
              type="submit" 
              class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen"
            >
              Adicionar
            </Button>
            <Button 
              variant="ghost" 
              class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
              @click="showAddModal = false; novoUtilizador = { nome: '', email: '', password: '', roles: [] }"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>