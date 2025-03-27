<script>
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const logout = () => {
            localStorage.removeItem('token');
            router.push('/');
        };

        return { logout };
    },
};
</script>

<template>
    <div>
        <h1>Dashboard</h1>
        <p class="mb-7">Bem-vindo ao seu painel!</p>
        <button class="text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen" @click="logout">Logout</button>
    </div>
</template>