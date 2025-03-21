<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'

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
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').max(50, 'A senha deve ter no máximo 50 caracteres')
}))

const form = useForm({
  validationSchema: formSchema
})

const loading = ref(false) // ✅ Agora está corretamente declarado
const error = ref(null)

async function login(values) { 
  loading.value = true;
  const url = "https://localhost:7110/api/auth/login";

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
    console.log(json); // guardar token
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
            <Input class="w-1/2 justify-items-center" type="email" placeholder="Insira o seu email" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Campo de password -->
      <FormField v-slot="{ componentField }" name="password">
        <FormItem class="justify-items-center">
          <FormControl>
            <Input class="w-1/2 justify-items-center" type="password" placeholder="Insira a sua senha" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit">
        Submit
      </Button>
    </form>
  </div>

  <!-- Spinner -->
  <div v-if="loading" id="spinner" class="fixed inset-0 flex items-center justify-center bg-gray-500/50 backdrop-blur-sm">
    <div class="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
  </div>
</template>