<script setup lang="ts">
import { ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-vue-next";
import type { Tipologia } from "@/components/interfaces";
import { fetchTurmas } from "@/api/turmas";
import { getTipologia } from "@/api/tipologias";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { deleteAula, updateAula } from "@/api/aulas";

const { toast } = useToast()

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const props = defineProps<{
  aula: {
    id: number;
    duracao: string;
    tipologia: { id: number; tipologia: string };
    professor: { id: string; userName: string };
    turma: { id: number; ano: number; letra: string; semestre: number };
  };
  professoresNoCurso: { id: string, userName: string }[];
  cursoId: number;
  semestreCadeira: number;
  anoCadeira: number;
}>();

const tipologias = ref<Tipologia[]>([]);
const professores = ref<{ id: string; userName: string }[]>([]);
const turmas = ref<{ id: number; ano: number; letra: string; cursoFK: number; semestre: number }[]>([]);


const editarAula = ref({
  ...props.aula,
  TipologiaFK: props.aula.tipologia?.id,
  ProfessorFK: props.aula.professor?.id,
  TurmaFK: props.aula.turma?.id
});

const isEditOpen = ref(false);
const isDeleteOpen = ref(false);

const hora = ref('00');
const minuto = ref('00');

const handleEdit = () => {
  editarAula.value = {
    ...props.aula,
    TipologiaFK: props.aula.tipologia?.id,
    ProfessorFK: props.aula.professor?.id,
    TurmaFK: props.aula.turma?.id
  };
  isEditOpen.value = true;
};

const handleDelete = () => {
  editarAula.value = {
    ...props.aula,
    TipologiaFK: props.aula.tipologia?.id,
    ProfessorFK: props.aula.professor?.id,
    TurmaFK: props.aula.turma?.id
  };
  isDeleteOpen.value = true;
};

const handleSave = async () => {
  try {
    editarAula.value.duracao = `${hora.value}:${minuto.value}:00`;
    await updateAula(editarAula.value.id, editarAula.value);
    isEditOpen.value = false;
    emit('refresh');
    toast({ title: "Aula editada com sucesso!", variant: "success" });
  } catch (error) {
    toast({ title: "Erro ao editar aula.", description: String(error), variant: "destructive" });
  }
};

const handleDeleteConfirm = async () => {
  try {
    await deleteAula(editarAula.value.id);
    isDeleteOpen.value = false;
    emit('refresh');
    toast({ title: "Aula eliminada com sucesso!", variant: "success" });
  } catch (error) {
    toast({ title: "Erro ao eliminar aula.", description: String(error), variant: "destructive" });
  }
};

watch(isEditOpen, async (value) => {
  if (value) {
    tipologias.value = await getTipologia();
    professores.value = props.professoresNoCurso;

    const todasTurmas = await fetchTurmas();
    turmas.value = todasTurmas.filter((t: { cursoFK: number; semestre: number; ano: number; }) =>
      t.cursoFK === props.cursoId &&
      t.semestre === props.semestreCadeira &&
      t.ano === props.anoCadeira
    );

    const [hh, mm] = props.aula.duracao.split(':');
    hora.value = hh;
    minuto.value = mm;
  }
});
</script>

<template>
  <Toaster />

  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0 bg-white border hover:border-iptGreen">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="handleEdit">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete" class="text-red-500">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="isEditOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar Aula</DialogTitle>
        <DialogDescription>Faça alterações na aula e clique em "Guardar".</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSave" class="space-y-4">
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
          <select v-model="editarAula.TipologiaFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option v-for="tip in tipologias" :key="tip.id" :value="tip.id">{{ tip.tipologia }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Professor</label>
          <select v-model="editarAula.ProfessorFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option v-for="prof in professores" :key="prof.id" :value="prof.id">{{ prof.userName }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Turma</label>
          <select v-model="editarAula.TurmaFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option v-for="turma in turmas" :key="turma.id" :value="turma.id">{{ turma.letra }}</option>
          </select>
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Guardar
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="isEditOpen = false">
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="isDeleteOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirmar Eliminação</DialogTitle>
        <DialogDescription>Tem certeza de que deseja apagar esta aula?</DialogDescription>
      </DialogHeader>

      <div class="flex justify-center gap-4 mt-4">
        <Button type="button" class="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
          @click="handleDeleteConfirm">
          Excluir
        </Button>
        <Button type="button"
          class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
          variant="ghost" @click="isDeleteOpen = false">
          Cancelar
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>