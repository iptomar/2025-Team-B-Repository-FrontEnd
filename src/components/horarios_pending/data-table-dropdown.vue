<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-vue-next";
import type { Horario } from "../interfaces";
import { useToast } from "@/components/ui/toast/use-toast";
//import { aprovarHorario, rejeitarHorario } from "@/api/horarios"; // cria estas funções na tua API

const props = defineProps<{ horario: Horario; onRefresh: () => void }>();
const { toast } = useToast();

const aprovar = async () => {
  try {
    //await aprovarHorario(props.horario.id);
    props.onRefresh();
    toast({ title: "Horário aprovado com sucesso.", variant: "success" });
  } catch {
    toast({ title: "Erro ao aprovar horário.", variant: "destructive" });
  }
};

const rejeitar = async () => {
  try {
    //await rejeitarHorario(props.horario.id);
    props.onRefresh();
    toast({ title: "Horário rejeitado com sucesso.", variant: "success" });
  } catch {
    toast({ title: "Erro ao rejeitar horário.", variant: "destructive" });
  }
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0 bg-white border hover:border-iptGreen">
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="aprovar">Aprovar</DropdownMenuItem>
      <DropdownMenuItem @click="rejeitar" class="text-red-500">Rejeitar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
