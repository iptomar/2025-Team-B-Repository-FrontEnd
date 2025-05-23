<script setup>
import { ref, onBeforeMount } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useRouter } from 'vue-router'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const formSchema = toTypedSchema(z.object({
  email: z.string().email('Email inválido').min(5, 'O email deve ter pelo menos 5 caracteres').max(100, 'O email deve ter no máximo 100 caracteres'),
  password: z.string().min(6, 'A password deve ter pelo menos 6 caracteres').max(50, 'A password deve ter no máximo 50 caracteres')
}))

const form = useForm({
  validationSchema: formSchema
})

const loading = ref(false)
const error = ref(null)
const router = useRouter();



onBeforeMount(() => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/cursos')
  }
})

async function login(values) { 
  loading.value = true;
  const url = "http://localhost:5039/api/auth/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    localStorage.setItem("token", json.token);
    router.push('/cursos')
  } catch (error) {
    console.error("Erro ao fazer login:", error.message);
  } finally {
    loading.value = false;
  }
}

// Handle form submission
const onSubmit = form.handleSubmit((values) => {
  login(values)
})
</script>

<template>
  <div class="flex flex-col w-full gap-4 relative">
    <div class="w-full flex justify-center">
      <img class="w-1/2" src="/ipt_logo.png" alt="IPT Logo" />
    </div>
    <form @submit="onSubmit" class="space-y-4 gap-4">
      <!-- Campo de email -->
      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="justify-items-center">
          <FormControl>
            <Input class="w-1/2 justify-items-center focus:border-iptGreen" type="email" placeholder="Insira o seu email" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Campo de password -->
      <FormField v-slot="{ componentField }" name="password">
        <FormItem class="justify-items-center">
          <FormControl>
            <Input class="w-1/2 justify-items-center focus:border-iptGreen" type="password" placeholder="Insira a sua senha" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button class="bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen" type="submit">
       Entrar
      </Button>
    </form>
  </div>

  <!-- Spinner -->
  <div v-if="loading" id="spinner" class="fixed inset-0 flex items-center justify-center bg-gray-500/50 backdrop-blur-sm">
    <div class="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
  </div>
</template>