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
    <SidebarProvider>
        <AppSidebar />
        <main>
            <SidebarTrigger />
            <slot />
            <div>
                <h1>Dashboard</h1>
                <p>Bem-vindo ao seu painel!</p>
                <button @click="logout">Logout</button>
            </div>
        </main>
    </SidebarProvider>
</template>