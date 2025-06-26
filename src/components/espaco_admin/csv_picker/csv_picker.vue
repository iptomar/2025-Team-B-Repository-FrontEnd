<script setup lang="ts">
import { ref } from 'vue';
import { filesSubmit } from '@/api/csv';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast();

const files = ref<File[]>([]);

function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const filesAsArray = Array.from(input?.files || []);
    files.value = filesAsArray;
}

function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    const filesAsArray = Array.from(e.dataTransfer?.files || []);
    files.value = filesAsArray;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


function handleFileImport() {
    if (files.value.length === 0) return;

    filesSubmit(files.value)
        .then(() => {
            files.value = [];
            toast({
              title: 'Ficheiros importados com sucesso!',
              variant: 'success'
            });
        })
        .catch(() => {
            toast({
              title: 'Erro ao importar os ficheiros. Por favor, tente novamente.',
              variant: 'destructive'
            });
        })
        .finally(() => {
            files.value = [];
        });
}
</script>
<template>
    <Toaster />
    
    <div class="flex flex-col gap-2">
        <div class="flex items-center justify-center w-full">
            <label for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-iptGreen border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">

                <div v-if="files.length === 0">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Clique para
                                adicionar</span> ou arraste para a caixa</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">CSV (MAX. 200MB)</p>
                    </div>
                </div>
                <ul v-if="files.length > 0">
                    <li v-for="file in files" :key="file.name">
                        {{ file.name }} {{ formatFileSize(file.size) }}
                    </li>
                </ul>
                <input id="dropzone-file" type="file" multiple accept=".csv" class="hidden" @change="handleFileSelect"
                    @dragover.prevent @drop="handleFileDrop" />
            </label>
        </div>
        <div>
            <button
                class="h-full w-full mt-4 text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2 rounded-lg transition-colors duration-200"
                @click="handleFileImport" :disabled="files.length === 0"
                :class="{ 'opacity-50 cursor-not-allowed': files.length === 0 }">
                <span v-if="files.length > 1">
                    Importar ficheiros ({{ files.length }})
                </span>
                <span v-else-if="files.length === 1">
                    Importar ficheiro
                </span>
                <span v-else>
                    Nenhum ficheiro selecionado
                </span>
            </button>
        </div>
    </div>
</template>